// import React, { useEffect, useRef, useState } from 'react';
// import Slider from 'react-slick';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import MacdPlot from './CreateMacdPlot';
// import CandleSpread from './CandleSpreadDistribution';
// import CandleBreach from './CandleBreach';
// import LastTraded from './LastTraded';
// import AvgBoxPlots from './AvgBoxPlots';
// import WormsPlots from './WormsPlots';
// import SensexStockCorrBar from './SensexVsStockCorrBar';
// import SensexVsStockCorr from './SensexVsStockCorr';
// import HeatMap from './HeatMap';
// import DelRate from './DelRate';
// // import './Graph.css';
// import VoltyPlot from './VoltyPlot';
// import IndustryBubble from './IndustryBubble';
// import TechnicalPlot from './TechnicalPlot';
// import toast from 'react-hot-toast';
// import { ArrowsUpFromLine } from 'lucide-react';
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import SensexCalculator from './SensexCalculator';

// const GraphSlider = ({ symbol }) => {
//   const [activeTab, setActiveTab] = useState('graphs');
//   const [plotData, setPlotData] = useState(JSON.parse(localStorage.getItem("plotData")) || null);
//   const [graphsLoaded, setGraphsLoaded] = useState(false); // Track if the graphs have been loaded
//   const sliderRef=useRef(null)

//   useEffect(() => {
//     const fetchPlotData = async () => {
//       if (graphsLoaded) return; // Only fetch if graphs are not loaded yet

//       try {
//         const response = await fetch("http://localhost:8080/api/stocks/process", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ symbol }),
//         });
//         if (!response.ok) {
//           throw new Error("Failed to fetch plot data");
//         }

//         const data = await response.json();
//         setPlotData(data);
//         localStorage.setItem("plotData", JSON.stringify(data));
//         setGraphsLoaded(true); // Mark as loaded
//       } catch (error) {
//         console.error("Error fetching plot data:", error);
//         toast.error("Error fetching plot data");
//       }
//     };

//     if (symbol) {
//       fetchPlotData();
//     }
//   }, [symbol, graphsLoaded]);

//   const CustomPrevArrow = (props) => {
//     const { className, style, onClick } = props;
//     return (
//       <FaChevronLeft
//         className={className}
//         style={{
//           ...style,
//           display: "block",
//           color: "black",
//           fontSize: "24px",
//           left: "-40px",
//           zIndex: 1000,
//         }}
//         onClick={onClick}
//       />
//     );
//   };

//   const CustomNextArrow = (props) => {
//     const { className, style, onClick } = props;
//     return (
//       <FaChevronRight
//         className={className}
//         style={{
//           ...style,
//           display: "block",
//           color: "black",
//           fontSize: "24px",
//           right: "-40px",
//           zIndex: 1000,
//         }}
//         onClick={onClick}
//       />
//     );
//   };

//   const settings = {
//     // dots: true,
//     fade: true,
//     infinite: true,
//     autoplaySpeed: 5000,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     swipeToSlide: true,
//     arrows:true,
//     prevArrow: <CustomPrevArrow />,
//     nextArrow: <CustomNextArrow />,
//   };

//   const renderGraphTabContent = () => {
//     return (
//       <div className="mt-10 mb-10 mr-10 ml-10">

//         <Slider ref={sliderRef} {...settings}>
//           {/* Graph Sections with symbol prop */}

//           <section className="w-full shadow-xl flex justify-center items-center    ">
//           <h2 className="text-2xl text-center font-bold mb-3">Candle Chronicles: Spread Patterns Over Time (TTM)</h2>
//             <CandleSpread className="m-20" symbol={symbol} />

//           </section>

//           <section className="w-full shadow-xl flex justify-center items-center    ">
//           <h2 className="text-2xl text-center font-bold mb-3">Boxing Prices: TTM Box Plot for Trade Prices</h2>
//             <LastTraded symbol={symbol} />

//           </section>

//           <section className="w-full     shadow-xl flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3">Price Trends in a Box: Monthly Ranges and Averages Explored (TTM)</h2>
//             <AvgBoxPlots symbol={symbol} />

//           </section>

//           <section className="w-full     shadow-xl flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3">Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends</h2>
//             <WormsPlots symbol={symbol} />
//            </section>

//           <section className="w-full     shadow-xl flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3">MACD Analysis for TTM</h2>
//             <MacdPlot symbol={symbol} />
//           </section>

//           <section className="w-full     shadow-xl flex justify-center items-center">
//           <h2 className="text-xl text-center font-bold m-3">Monthly Percentage Insights: Sensex (Nifty 50) and Stock Fluctuations (TTM)</h2>
//             <SensexStockCorrBar symbol={symbol} />

//           </section>

//           <section className="w-full     shadow-xl flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3">Sensex Symphony: Harmonizing Stock Correlation Trends (TTM)</h2>
//             <SensexVsStockCorr symbol={symbol} />

//           </section>

//           <section className="w-full     shadow-xl flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3">{`Performance Heatmap : Nifty50 vs BSE vs ${symbol}`}</h2>
//             <HeatMap symbol={symbol} />

//           </section>

//           <section className="w-full     shadow-xl flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3">Market Mood: Delivery Trends & Trading Sentiment</h2>
//             <DelRate symbol={symbol} />

//           </section>

//           <section className="w-full     shadow-xl flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3">Breach Busters: Analyzing High and Low Breaches</h2>
//             <CandleBreach symbol={symbol} />

//           </section>

//           <section className="w-full     shadow-xl flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3">{`Volatility for ${symbol}`} </h2>
//             <VoltyPlot symbol={symbol} />

//           </section>

//           <section className="w-full     shadow-xl flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3"> Sensex Calulator</h2>
//             <SensexCalculator />

//           </section>

//           <section className="w-full     shadow-xl flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3">PE vs EPS vs Book Value: Gladiators in the Industry Arena</h2>
//             <IndustryBubble symbol={symbol} />

//           </section>
//         </Slider>
//       </div>
//     );
//   };

//   const renderTechnicalTabContent = () => {
//     return (
//       <div className='m-10'>
//         <section className="w-full     shadow-xl flex justify-center items-center">
//         {/* <h2 className="text-2xl text-center font-bold mb-3"></h2> */}
//         <TechnicalPlot symbol={symbol} />
//       </section>
//       </div>
//     );
//   };

//   return (
//     <div>
//       <center>
//         {/* Tab Navigation */}
//         <div className="tabs tabs-lifted m-20">
//   {/* Graphs Tab */}
//   <button
//     role="tab"
//     className={`tab text-xl font-bold px-6 transition-all duration-300 ${
//       activeTab === 'graphs'
//         ? 'tab-active bg-yellow-500 text-black border-b-4 border-yellow-700 shadow-md' // Active tab
//         : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black' // Inactive tab
//     }`}
//     onClick={() => {
//       setActiveTab('graphs');
//       if (!graphsLoaded) setGraphsLoaded(false);
//     }}
//   >
//     Data Analysis
//   </button>

//   {/* Technical Tab */}
//   <button
//     role="tab"
//     className={`tab text-xl font-bold px-6 transition-all duration-300 ${
//       activeTab === 'technical'
//         ? 'tab-active bg-blue-500 text-black border-b-4 border-blue-700 shadow-md' // Active tab
//         : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black' // Inactive tab
//     }`}
//     onClick={() => setActiveTab('technical')}
//   >
//     Technical Plot
//   </button>
// </div>

// {/* Render content based on selected tab */}
// <div className=" rounded-lg p-6 mt-4 shadow-lg">
//   {activeTab === 'graphs' ? renderGraphTabContent() : renderTechnicalTabContent()}
// </div>

//       </center>
//     </div>
//   );
// };

// export default GraphSlider;

// import React, { useEffect, useRef, useState } from 'react';
// import Slider from 'react-slick';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// import CandleSpread from './CandleSpreadDistribution';
// import CandleBreach from './CandleBreach';
// import LastTraded from './LastTraded';
// import AvgBoxPlots from './AvgBoxPlots';
// import WormsPlots from './WormsPlots';
// import SensexStockCorrBar from './SensexVsStockCorrBar';
// import SensexVsStockCorr from './SensexVsStockCorr';
// import HeatMap from './HeatMap';
// import DelRate from './DelRate';
// // import './Graph.css';
// import VoltyPlot from './VoltyPlot';
// import IndustryBubble from './IndustryBubble';
// import TechnicalPlot from './TechnicalPlot';
// import toast from 'react-hot-toast';
// import { ArrowsUpFromLine } from 'lucide-react';
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import SensexCalculator from './SensexCalculator';
// import MacdPlot from './MacdPlot';

// const GraphSlider = ({ symbol, isFullWidth }) => {
//   const [activeTab, setActiveTab] = useState('graphs');
//   const [plotData, setPlotData] = useState(JSON.parse(localStorage.getItem("plotData")) || null);
//   const [graphsLoaded, setGraphsLoaded] = useState(false); // Track if the graphs have been loaded
//   const sliderRef=useRef(null)
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   useEffect(() => {
//     const fetchPlotData = async () => {
//       if (plotData?.[symbol]) return; // Don't fetch if already present

//       try {
//         // const response = await fetch("http://192.168.1.250:8080/CMDA-3.3.9/api/stocks/process", {
//           const response = await fetch(`${API_BASE}/api/stocks/process`, {

//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ symbol }),
//         });

//         if (!response.ok) throw new Error("Failed to fetch plot data");

//         const data = await response.json();
//         const updatedData = { ...plotData, [symbol]: data }; // Store per stock
//         setPlotData(updatedData);
//         localStorage.setItem("plotData", JSON.stringify(updatedData));
//       } catch (error) {
//         console.error("Error fetching plot data:", error);
//         toast.error("Error fetching plot data");
//       }
//     };

//     if (symbol && !plotData?.[symbol]) fetchPlotData();
//   }, [symbol]); // ✅ Depend only on `symbol`, not `activeTab`

//   const CustomPrevArrow = (props) => {
//     const { className, onClick } = props;
//     return (
//       <FaChevronLeft
//           className={`${className} !text-black dark:!text-white text-8xl absolute right-[-20px] z-[1000] cursor-pointer`}
//       onClick={onClick}
//       />
//     );
//   };

//   const CustomNextArrow = (props) => {
//     const { className, onClick } = props;
//     return (
//       <FaChevronRight
//       className={`${className} !text-black dark:!text-white text-8xl absolute right-[-20px] z-[1000] cursor-pointer`}
//       onClick={onClick}
//       />
//     );
//   };

//   const settings = {
//     // dots: true,
//     fade: true,
//     infinite: true,
//     autoplaySpeed: 5000,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     swipeToSlide: true,
//     arrows:true,
//     prevArrow: <CustomPrevArrow/>,
//     nextArrow: <CustomNextArrow/>,
//   };

//   const renderGraphTabContent = () => {
//     return (
//       <div className={`${isFullWidth ? "w-full" : "w-auto"} transition-all duration-300`}>

//        <Slider ref={sliderRef} key="graph-slider" {...settings}>
//           {/* Graph Sections with symbol prop */}

//           <section className="w-full flex justify-center items-center    ">
//           <h2 className="text-2xl text-center font-bold mb-3">Candle Chronicles: Spread Patterns Over Time (TTM)</h2>
//             <CandleSpread className="m-20" symbol={symbol} />

//           </section>

//           <section className="w-full  flex justify-center items-center    ">
//           <h2 className="text-2xl text-center font-bold mb-3">Boxing Prices: TTM Box Plot for Trade Prices</h2>
//             <LastTraded symbol={symbol} />

//           </section>

//           <section className="w-full flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3">Price Trends in a Box: Monthly Ranges and Averages Explored (TTM)</h2>
//             <AvgBoxPlots symbol={symbol} />

//           </section>

//           <section className="w-full flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3">Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends</h2>
//             <WormsPlots symbol={symbol} />
//            </section>

//           <section className="w-full flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3">MACD Analysis for TTM</h2>
//             <MacdPlot symbol={symbol} />
//           </section>

//           <section className="w-full flex justify-center items-center">
//           <h2 className="text-xl text-center font-bold m-3">Monthly Percentage Insights: Sensex (Nifty 50) and Stock Fluctuations (TTM)</h2>
//             <SensexStockCorrBar symbol={symbol} />

//           </section>

//           <section className="w-full flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3">Sensex Symphony: Harmonizing Stock Correlation Trends (TTM)</h2>
//             <SensexVsStockCorr symbol={symbol} />

//           </section>

//           <section className="w-full flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3">{`Performance Heatmap : Nifty50 vs BSE vs ${symbol}`}</h2>
//             <HeatMap symbol={symbol} />

//           </section>

//           <section className="w-full flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3">Market Mood: Delivery Trends & Trading Sentiment</h2>
//             <DelRate symbol={symbol} />

//           </section>

//           <section className="w-full flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3">Breach Busters: Analyzing High and Low Breaches</h2>
//             <CandleBreach symbol={symbol} />

//           </section>

//           <section className="w-full flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3">{`Volatility for ${symbol}`} </h2>
//             <VoltyPlot symbol={symbol} />

//           </section>

//           <section className="w-full flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3"> Sensex Calulator</h2>
//             <SensexCalculator />

//           </section>

//           <section className="w-full flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3">PE vs EPS vs Book Value: Gladiators in the Industry Arena</h2>
//             <IndustryBubble symbol={symbol} />

//           </section>
//         </Slider>
//       </div>
//     );
//   };

//   const renderTechnicalTabContent = () => {
//     return (
//       <div className='m-10'>
//         <section className="w-full flex justify-center items-center">
//         <h2 className="text-2xl text-center font-bold mb-3"></h2>
//         <TechnicalPlot symbol={symbol} />
//       </section>
//       </div>
//     );
//   };

//   return (
//     <div>
//       <center>
//         {/* Tab Navigation */}
//         <div className="tabs tabs-lifted m-20">

// <button
//   role="tab"
//   className={`tab  text-2xl font-bold px-6 py-5 transition-all duration-200 ${
//     activeTab === 'graphs'
//       ? 'tab-active py-5 text-cyan-600 text-3xl shadow-md dark:bg-slate-800 dark:text-white'
//       : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-white'
//   }`}
//   onClick={() => setActiveTab('graphs')} // No `graphsLoaded` reset
// >
//   <span className='dark:text-cyan-400'>Data Analysis</span>
// </button>

// <button
//   role="tab"
//   className={`tab text-2xl font-bold px-6  py-5 transition-all duration-200 ${
//     activeTab === 'technical'
//       ? 'tab-active  py-5 text-cyan-600 text-3xl shadow-md dark:bg-slate-800 dark:text-white'
//       : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-white'
//   }`}
//   onClick={() => setActiveTab('technical')} // Just switch tab, no reload
// >
//   <span className='dark:text-cyan-400'>Candle Stick</span>
// </button>

// </div>

// {/* Render content based on selected tab */}
// {/* <div className=" rounded-lg p-6 mt-4 shadow-lg">
//   {activeTab === 'graphs' ? renderGraphTabContent() : renderTechnicalTabContent()}
// </div> */}

// <div className="rounded-lg p-6 mt-8 shadow-lg dark:bg-slate-800 dark:text-white">
//   <div style={{ display: activeTab === 'graphs' ? 'block' : 'none' }}>
//     {renderGraphTabContent()}
//   </div>
//   <div style={{ display: activeTab === 'technical' ? 'block' : 'none' }}>
//     {renderTechnicalTabContent()}
//   </div>
// </div>

//       </center>
//     </div>
//   );
// };

// export default GraphSlider;

// ------------taking time ------------------

// import React, { useEffect, useRef, useState } from 'react';
// import Slider from 'react-slick';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// import CandleSpread from './CandleSpreadDistribution';
// import CandleBreach from './CandleBreach';
// import LastTraded from './LastTraded';
// import AvgBoxPlots from './AvgBoxPlots';
// import WormsPlots from './WormsPlots';
// import SensexStockCorrBar from './SensexVsStockCorrBar';
// import SensexVsStockCorr from './SensexVsStockCorr';
// import HeatMap from './HeatMap';
// import DelRate from './DelRate';
// import VoltyPlot from './VoltyPlot';
// import IndustryBubble from './IndustryBubble';
// import TechnicalPlot from './TechnicalPlot';
// import toast from 'react-hot-toast';
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import SensexCalculator from './SensexCalculator';
// import MacdPlot from './MacdPlot';

// const GraphSlider = ({ symbol, isFullWidth }) => {
//   const [activeTab, setActiveTab] = useState('graphs');
//   const [plotData, setPlotData] = useState(JSON.parse(localStorage.getItem("plotData")) || null);
//   const [graphsLoaded, setGraphsLoaded] = useState(false);
//   const sliderRef = useRef(null);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   // Function to get auth token
//   const getAuthToken = () => {
//     return localStorage.getItem("authToken");
//   };

//   useEffect(() => {
//     const fetchPlotData = async () => {
//       if (plotData?.[symbol]) return; // Don't fetch if already present

//       try {
//         const token = getAuthToken();
//         if (!token) {
//           throw new Error("Please log in to fetch plot data.");
//         }

//         const response = await fetch(`${API_BASE}/api/stocks/process`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`, // Add Authorization header
//           },
//           body: JSON.stringify({ symbol }),
//         });

//         if (!response.ok) throw new Error("Failed to fetch plot data");

//         const data = await response.json();
//         const updatedData = { ...plotData, [symbol]: data };
//         setPlotData(updatedData);
//         localStorage.setItem("plotData", JSON.stringify(updatedData));
//         setGraphsLoaded(true);
//       } catch (error) {
//         console.error("Error fetching plot data:", error);
//         toast.error(error.message || "Error fetching plot data");
//       }
//     };

//     if (symbol && !plotData?.[symbol]) fetchPlotData();
//   }, [symbol, plotData]);

//   const CustomPrevArrow = (props) => {
//     const { className, onClick } = props;
//     return (
//       <FaChevronLeft
//         className={`${className} !text-black dark:!text-white text-8xl absolute right-[-20px] z-[1000] cursor-pointer`}
//         onClick={onClick}
//       />
//     );
//   };

//   const CustomNextArrow = (props) => {
//     const { className, onClick } = props;
//     return (
//       <FaChevronRight
//         className={`${className} !text-black dark:!text-white text-8xl absolute right-[-20px] z-[1000] cursor-pointer`}
//         onClick={onClick}
//       />
//     );
//   };

//   const settings = {
//     fade: true,
//     infinite: true,
//     autoplaySpeed: 5000,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     swipeToSlide: true,
//     arrows: true,
//     prevArrow: <CustomPrevArrow />,
//     nextArrow: <CustomNextArrow />,
//   };

//   const renderGraphTabContent = () => {
//     return (
//       <div className={`${isFullWidth ? "w-full" : "w-auto"} transition-all duration-300`}>
//         <Slider ref={sliderRef} key="graph-slider" {...settings}>
//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">Candle Chronicles: Spread Patterns Over Time (TTM)</h2>
//             <CandleSpread className="m-20" symbol={symbol} />
//           </section>

//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">Boxing Prices: TTM Box Plot for Trade Prices</h2>
//             <LastTraded symbol={symbol} />
//           </section>

//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">Price Trends in a Box: Monthly Ranges and Averages Explored (TTM)</h2>
//             <AvgBoxPlots symbol={symbol} />
//           </section>

//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends</h2>
//             <WormsPlots symbol={symbol} />
//           </section>

//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">MACD Analysis for TTM</h2>
//             <MacdPlot symbol={symbol} />
//           </section>

//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-xl text-center font-bold m-3">Monthly Percentage Insights: Sensex (Nifty 50) and Stock Fluctuations (TTM)</h2>
//             <SensexStockCorrBar symbol={symbol} />
//           </section>

//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">Sensex Symphony: Harmonizing Stock Correlation Trends (TTM)</h2>
//             <SensexVsStockCorr symbol={symbol} />
//           </section>

//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">{`Performance Heatmap : Nifty50 vs BSE vs ${symbol}`}</h2>
//             <HeatMap symbol={symbol} />
//           </section>

//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">Market Mood: Delivery Trends & Trading Sentiment</h2>
//             <DelRate symbol={symbol} />
//           </section>

//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">Breach Busters: Analyzing High and Low Breaches</h2>
//             <CandleBreach symbol={symbol} />
//           </section>

//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">{`Volatility for ${symbol}`}</h2>
//             <VoltyPlot symbol={symbol} />
//           </section>

//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">Sensex Calculator</h2>
//             <SensexCalculator />
//           </section>

//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">PE vs EPS vs Book Value: Gladiators in the Industry Arena</h2>
//             <IndustryBubble symbol={symbol} />
//           </section>
//         </Slider>
//       </div>
//     );
//   };

//   const renderTechnicalTabContent = () => {
//     return (
//       <div className='m-10'>
//         <section className="w-full flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3"></h2>
//           <TechnicalPlot symbol={symbol} />
//         </section>
//       </div>
//     );
//   };

//   return (
//     <div>
//       <center>
//         <div className="tabs tabs-lifted m-20">
//           <button
//             role="tab"
//             className={`tab text-2xl font-bold px-6 py-5 transition-all duration-200 ${
//               activeTab === 'graphs'
//                 ? 'tab-active py-5 text-cyan-600 text-3xl shadow-md dark:bg-slate-800 dark:text-white'
//                 : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-white'
//             }`}
//             onClick={() => setActiveTab('graphs')}
//           >
//             <span className='dark:text-cyan-400'>Data Analysis</span>
//           </button>
//           <button
//             role="tab"
//             className={`tab text-2xl font-bold px-6 py-5 transition-all duration-200 ${
//               activeTab === 'technical'
//                 ? 'tab-active py-5 text-cyan-600 text-3xl shadow-md dark:bg-slate-800 dark:text-white'
//                 : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-white'
//             }`}
//             onClick={() => setActiveTab('technical')}
//           >
//             <span className='dark:text-cyan-400'>Candle Stick</span>
//           </button>
//         </div>

//         <div className="rounded-lg p-6 mt-8 shadow-lg dark:bg-slate-800 dark:text-white">
//           <div style={{ display: activeTab === 'graphs' ? 'block' : 'none' }}>
//             {renderGraphTabContent()}
//           </div>
//           <div style={{ display: activeTab === 'technical' ? 'block' : 'none' }}>
//             {renderTechnicalTabContent()}
//           </div>
//         </div>
//       </center>
//     </div>
//   );
// };

// export default GraphSlider;

// import React, { useEffect, useRef, useState } from 'react';
// import Slider from 'react-slick';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// import CandleBreach from './CandleBreach';
// import LastTraded from './LastTraded';
// import AvgBoxPlots from './AvgBoxPlots';
// import WormsPlots from './WormsPlots';
// import SensexStockCorrBar from './SensexVsStockCorrBar';
// import SensexVsStockCorr from './SensexVsStockCorr';
// import HeatMap from './HeatMap';
// import DelRate from './DelRate';
// import VoltyPlot from './VoltyPlot';
// import IndustryBubble from './IndustryBubble';
// import TechnicalPlot from './TechnicalPlot';
// import toast from 'react-hot-toast';
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import SensexCalculator from './SensexCalculator';
// import MacdPlot from './MacdPlot';
// import CandleSpread from './CandleSpreadDistribution';
// import {  FaExpand, FaTimes } from 'react-icons/fa';

// const GraphSlider = ({ symbol, isFullWidth }) => {
//   const [activeTab, setActiveTab] = useState('graphs');
//    const [fullscreenGraph, setFullscreenGraph] = useState(null);
//   const [plotData, setPlotData] = useState(() => {
//     const saved = localStorage.getItem('plotData');
//     return saved ? JSON.parse(saved) : {};
//   });
//   const [graphsLoaded, setGraphsLoaded] = useState(false);
//   const sliderRef = useRef(null);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   const getAuthToken = () => {
//     return localStorage.getItem('authToken');
//   };

//   useEffect(() => {
//     const fetchPlotData = async () => {
//       if (plotData?.[symbol]) {
//         setGraphsLoaded(true);
//         return;
//       }

//       try {
//         const token = getAuthToken();
//         if (!token) {
//           throw new Error('Please log in to fetch plot data.');
//         }

//         const response = await fetch(`${API_BASE}/api/stocks/process`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           body: JSON.stringify({ symbol }),
//         });

//         if (!response.ok) throw new Error('Failed to fetch plot data');

//         const data = await response.json();
//         const updatedData = { ...plotData, [symbol]: data };
//         setPlotData(updatedData);
//         localStorage.setItem('plotData', JSON.stringify(updatedData));
//         setGraphsLoaded(true);
//       } catch (error) {
//         console.error('Error fetching plot data:', error);
//         toast.error(error.message || 'Error fetching plot data');
//       }
//     };

//     if (symbol && !plotData?.[symbol]) fetchPlotData();
//   }, [symbol, plotData]);

//   const CustomPrevArrow = (props) => {
//     const { className, onClick } = props;
//     return (
//       <FaChevronLeft
//         className={`${className} !text-black dark:!text-white text-8xl absolute right-[-20px] z-[1000] cursor-pointer`}
//         onClick={onClick}
//       />
//     );
//   };

//   const CustomNextArrow = (props) => {
//     const { className, onClick } = props;
//     return (
//       <FaChevronRight
//         className={`${className} !text-black dark:!text-white text-8xl absolute right-[-20px] z-[1000] cursor-pointer`}
//         onClick={onClick}
//       />
//     );
//   };

//   const settings = {
//     fade: true,
//     infinite: true,
//     autoplaySpeed: 5000,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     swipeToSlide: true,
//     arrows: true,
//     prevArrow: <CustomPrevArrow />,
//     nextArrow: <CustomNextArrow />,
//   };
//     const graphSections = [
//     { title: "Candle Chronicles: Spread Patterns Over Time (TTM)", component: <CandleSpread symbol={symbol} />, key: "CandleSpread" },
//     { title: "Boxing Prices: TTM Box Plot for Trade Prices", component: <LastTraded symbol={symbol} />, key: "LastTraded" },
//     { title: "Price Trends in a Box: Monthly Ranges and Averages Explored (TTM)", component: <AvgBoxPlots symbol={symbol} />, key: "AvgBoxPlots" },
//     { title: "Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends", component: <WormsPlots symbol={symbol} />, key: "WormsPlots" },
//     { title: "MACD Analysis for TTM", component: <MacdPlot symbol={symbol} />, key: "MacdPlot" },
//     { title: "Monthly Percentage Insights: Sensex (Nifty 50) and Stock Fluctuations (TTM)", component: <SensexStockCorrBar symbol={symbol} />, key: "SensexStockCorrBar" },
//     { title: "Sensex Symphony: Harmonizing Stock Correlation Trends (TTM)", component: <SensexVsStockCorr symbol={symbol} />, key: "SensexVsStockCorr" },
//     { title: `Performance Heatmap : Nifty50 vs BSE vs ${symbol}`, component: <HeatMap symbol={symbol} />, key: "HeatMap" },
//     { title: "Market Mood: Delivery Trends & Trading Sentiment", component: <DelRate symbol={symbol} />, key: "DelRate" },
//     { title: "Breach Busters: Analyzing High and Low Breaches", component: <CandleBreach symbol={symbol} />, key: "CandleBreach" },
//     { title: `Volatility for ${symbol}`, component: <VoltyPlot symbol={symbol} />, key: "VoltyPlot" },
//     { title: "Sensex Calculator", component: <SensexCalculator />, key: "SensexCalculator" },
//     { title: "PE vs EPS vs Book Value: Gladiators in the Industry Arena", component: <IndustryBubble symbol={symbol} />, key: "IndustryBubble" },
//   ];

//   const renderGraphTabContent = () => {
//     return (
//       <div className={`${isFullWidth ? 'w-full' : 'w-auto'} transition-all duration-300`}>
//         {/* <Slider ref={sliderRef} key="graph-slider" {...settings}>
//           <section className="w-full flex justify-center items-center">
//             <div className="absolute top-3 right-6 z-20">
//               <button
//                 onClick={() => setFullscreenGraph({   })}
//                 className="text-gray-600 dark:text-white hover:text-cyan-500 text-xl"
//                 title="Expand"
//               >
//                 <FaExpand />
//               </button>
//             </div>
//             <h2 className="text-2xl text-center font-bold mb-3">Candle Chronicles: Spread Patterns Over Time (TTM)</h2>
//             <CandleSpread className="m-20" symbol={symbol} cachedData={plotData[symbol]?.candleSpread} />
//           </section>
//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">Boxing Prices: TTM Box Plot for Trade Prices</h2>
//             <LastTraded symbol={symbol} cachedData={plotData[symbol]?.lastTraded} />
//           </section>
//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">Price Trends in a Box: Monthly Ranges and Averages Explored (TTM)</h2>
//             <AvgBoxPlots symbol={symbol} cachedData={plotData[symbol]?.avgBoxPlots} />
//           </section>
//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends</h2>
//             <WormsPlots symbol={symbol} cachedData={plotData[symbol]?.wormsPlots} />
//           </section>
//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">MACD Analysis for TTM</h2>
//             <MacdPlot symbol={symbol} cachedData={plotData[symbol]?.macdPlot} />
//           </section>
//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-xl text-center font-bold m-3">Monthly Percentage Insights: Sensex (Nifty 50) and Stock Fluctuations (TTM)</h2>
//             <SensexStockCorrBar symbol={symbol} cachedData={plotData[symbol]?.sensexStockCorrBar} />
//           </section>
//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">Sensex Symphony: Harmonizing Stock Correlation Trends (TTM)</h2>
//             <SensexVsStockCorr symbol={symbol} cachedData={plotData[symbol]?.sensexVsStockCorr} />
//           </section>
//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">{`Performance Heatmap : Nifty50 vs BSE vs ${symbol}`}</h2>
//             <HeatMap symbol={symbol} cachedData={plotData[symbol]?.heatMap} />
//           </section>
//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">Market Mood: Delivery Trends & Trading Sentiment</h2>
//             <DelRate symbol={symbol} cachedData={plotData[symbol]?.delRate} />
//           </section>
//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">Breach Busters: Analyzing High and Low Breaches</h2>
//             <CandleBreach symbol={symbol} cachedData={plotData[symbol]?.candleBreach} />
//           </section>
//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">{`Volatility for ${symbol}`}</h2>
//             <VoltyPlot symbol={symbol} cachedData={plotData[symbol]?.voltyPlot} />
//           </section>
//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">Sensex Calculator</h2>
//             <SensexCalculator />
//           </section>
//           <section className="w-full flex justify-center items-center">
//             <h2 className="text-2xl text-center font-bold mb-3">PE vs EPS vs Book Value: Gladiators in the Industry Arena</h2>
//             <IndustryBubble symbol={symbol} cachedData={plotData[symbol]?.industryBubble} />
//           </section>
//         </Slider> */}

//          <Slider ref={sliderRef} key="graph-slider" {...settings}>
//         {graphSections.map(({ title, component, key }) => (
//           <section key={key} className="relative w-full flex justify-center items-center">
//             <div className="absolute top-3 right-6 z-20">
//               <button
//                 onClick={() => setFullscreenGraph({ title, component })}
//                 className="text-gray-600 dark:text-white hover:text-cyan-500 text-xl"
//                 title="Expand"
//               >
//                 <FaExpand />
//               </button>
//             </div>
//             <div className="w-full text-center">
//               <h2 className="text-2xl font-bold mb-3">{title}</h2>
//               {component}
//             </div>
//           </section>
//         ))}
//       </Slider>
//       </div>
//     );
//   };

//   const renderTechnicalTabContent = () => {
//     return (
//       <div className="m-10">
//         <section className="w-full flex justify-center items-center">
//           <h2 className="text-2xl text-center font-bold mb-3"></h2>
//           <TechnicalPlot symbol={symbol} cachedData={plotData[symbol]?.technicalPlot} />
//         </section>
//       </div>
//     );
//   };

//     const renderFullscreenOverlay = () => (
//     fullscreenGraph && (
//       <div className="fixed top-0 left-0 w-full h-full bg-white dark:bg-black bg-opacity-95 z-[9999] flex flex-col items-center justify-center p-6 overflow-auto">
//         <div className="w-full flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">{fullscreenGraph.title}</h2>
//           <button
//             onClick={() => setFullscreenGraph(null)}
//             className="text-gray-800 dark:text-white text-2xl hover:text-red-500"
//             title="Close"
//           >
//             <FaTimes />
//           </button>
//         </div>
//         <div className="w-full">{fullscreenGraph.component}</div>
//       </div>
//     )
//   );

//   return (
//     <div>
//       <center>
//         <div className="tabs tabs-lifted m-20">
//           <button
//             role="tab"
//             className={`tab text-2xl font-bold px-6 py-5 transition-all duration-200 ${
//               activeTab === 'graphs'
//                 ? 'tab-active py-5 text-cyan-600 text-3xl shadow-md dark:bg-slate-800 dark:text-white'
//                 : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-white'
//             }`}
//             onClick={() => setActiveTab('graphs')}
//           >
//             <span className="dark:text-cyan-400">Data Analysis</span>
//           </button>
//           <button
//             role="tab"
//             className={`tab text-2xl font-bold px-6 py-5 transition-all duration-200 ${
//               activeTab === 'technical'
//                 ? 'tab-active py-5 text-cyan-600 text-3xl shadow-md dark:bg-slate-800 dark:text-white'
//                 : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-white'
//             }`}
//             onClick={() => setActiveTab('technical')}
//           >
//             <span className="dark:text-cyan-400">Candle Stick</span>
//           </button>
//         </div>
//         <div className="rounded-lg p-6 mt-8 shadow-lg dark:bg-slate-800 dark:text-white">
//           <div style={{ display: activeTab === 'graphs' ? 'block' : 'none' }}>
//             {renderGraphTabContent()}
//           </div>
//           <div style={{ display: activeTab === 'technical' ? 'block' : 'none' }}>
//             {renderTechnicalTabContent()}
//           </div>
//         </div>
//       </center>
//         {renderFullscreenOverlay()}
//     </div>
//   );
// };

// export default GraphSlider;

// import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// import Slider from 'react-slick';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// import CandleBreach from './CandleBreach';
// import LastTraded from './LastTraded';
// import AvgBoxPlots from './AvgBoxPlots';
// import WormsPlots from './WormsPlots';
// import SensexStockCorrBar from './SensexVsStockCorrBar';
// import SensexVsStockCorr from './SensexVsStockCorr';
// import HeatMap from './HeatMap';
// import DelRate from './DelRate';
// import VoltyPlot from './VoltyPlot';
// import IndustryBubble from './IndustryBubble';
// import TechnicalPlot from './TechnicalPlot';
// import toast from 'react-hot-toast';
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import SensexCalculator from './SensexCalculator';
// import MacdPlot from './MacdPlot';
// import CandleSpread from './CandleSpreadDistribution';
// import {  FaExpand, FaTimes } from 'react-icons/fa';

// const GraphSlider = ({ symbol, isFullWidth }) => {
//   const [activeTab, setActiveTab] = useState('graphs');
//   const [fullscreenGraph, setFullscreenGraph] = useState(null);
//   const [plotData, setPlotData] = useState(() => {
//     const saved = localStorage.getItem('plotData');
//     return saved ? JSON.parse(saved) : {};
//   });
//   const [graphsLoaded, setGraphsLoaded] = useState(false);
//   const sliderRef = useRef(null);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   const getAuthToken = () => localStorage.getItem('authToken');

//   useEffect(() => {
//     const fetchPlotData = async () => {
//       if (plotData?.[symbol]) {
//         setGraphsLoaded(true);
//         return;
//       }

//       try {
//         const token = getAuthToken();
//         if (!token) throw new Error('Please log in to fetch plot data.');

//         const response = await fetch(`${API_BASE}/api/stocks/process`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           body: JSON.stringify({ symbol }),
//         });

//         if (!response.ok) throw new Error('Failed to fetch plot data');

//         const data = await response.json();
//         const updatedData = { ...plotData, [symbol]: data };
//         setPlotData(updatedData);
//         localStorage.setItem('plotData', JSON.stringify(updatedData));
//         setGraphsLoaded(true);
//       } catch (error) {
//         toast.error(error.message || 'Error fetching plot data');
//       }
//     };

//     if (symbol && !plotData?.[symbol]) fetchPlotData();
//   }, [symbol]);

//   const CustomPrevArrow = useCallback((props) => (
//     <FaChevronLeft
//       className={`${props.className} !text-black dark:!text-white text-8xl absolute right-[-20px] z-[1000] cursor-pointer`}
//       onClick={props.onClick}
//     />
//   ), []);

//   const CustomNextArrow = useCallback((props) => (
//     <FaChevronRight
//       className={`${props.className} !text-black dark:!text-white text-8xl absolute right-[-20px] z-[1000] cursor-pointer`}
//       onClick={props.onClick}
//     />
//   ), []);

//   const settings = useMemo(() => ({
//     fade: true,
//     infinite: true,
//     autoplaySpeed: 5000,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     swipeToSlide: true,
//     arrows: true,
//     prevArrow: <CustomPrevArrow />,
//     nextArrow: <CustomNextArrow />,
//   }), [CustomPrevArrow, CustomNextArrow]);

//   const graphSections = useMemo(() => [
//     { title: "Candle Chronicles", component: <CandleSpread symbol={symbol} />, key: "CandleSpread" },
//     { title: "Boxing Prices", component: <LastTraded symbol={symbol} />, key: "LastTraded" },
//     { title: "Monthly Ranges and Averages", component: <AvgBoxPlots symbol={symbol} />, key: "AvgBoxPlots" },
//     { title: "Trend Tapestry", component: <WormsPlots symbol={symbol} />, key: "WormsPlots" },
//     { title: "MACD Analysis", component: <MacdPlot symbol={symbol} />, key: "MacdPlot" },
//     { title: "Sensex & Stock Fluctuations", component: <SensexStockCorrBar symbol={symbol} />, key: "SensexStockCorrBar" },
//     { title: "Sensex Symphony", component: <SensexVsStockCorr symbol={symbol} />, key: "SensexVsStockCorr" },
//     { title: `Heatmap: ${symbol}`, component: <HeatMap symbol={symbol} />, key: "HeatMap" },
//     { title: "Delivery Trends", component: <DelRate symbol={symbol} />, key: "DelRate" },
//     { title: "Breach Busters", component: <CandleBreach symbol={symbol} />, key: "CandleBreach" },
//     { title: `Volatility: ${symbol}`, component: <VoltyPlot symbol={symbol} />, key: "VoltyPlot" },
//     { title: "Sensex Calculator", component: <SensexCalculator />, key: "SensexCalculator" },
//     { title: "Industry Arena", component: <IndustryBubble symbol={symbol} />, key: "IndustryBubble" },
//   ], [symbol]);

//   const renderGraphTabContent = useCallback(() => (
//     <div className={`${isFullWidth ? 'w-full' : 'w-auto'} transition-all duration-300`}>
//       <Slider ref={sliderRef} key="graph-slider" {...settings}>
//         {graphSections.map(({ title, component, key }) => (
//           <section key={key} className="relative w-full flex justify-center items-center">
//             <div className="absolute top-3 right-6 z-20">
//               <button
//                 onClick={() => setFullscreenGraph({ title, component })}
//                 className="text-gray-600 dark:text-white hover:text-cyan-500 text-xl"
//                 title="Expand"
//               >
//                 <FaExpand />
//               </button>
//             </div>
//             <div className="w-full text-center">
//               <h2 className="text-2xl font-bold mb-3">{title}</h2>
//               {component}
//             </div>
//           </section>
//         ))}
//       </Slider>
//     </div>
//   ), [graphSections, settings]);

//   const renderTechnicalTabContent = useCallback(() => (
//     <div className="m-10">
//       <section className="w-full flex justify-center items-center">
//         <TechnicalPlot symbol={symbol} cachedData={plotData[symbol]?.technicalPlot} />
//       </section>
//     </div>
//   ), [symbol, plotData]);

//   const renderFullscreenOverlay = useCallback(() => (
//     fullscreenGraph && (
//       <div className="fixed top-0 left-0 w-full h-full bg-white dark:bg-black bg-opacity-95 z-[9999] flex flex-col items-center justify-center p-6 overflow-auto">
//         <div className="w-full flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">{fullscreenGraph.title}</h2>
//           <button
//             onClick={() => setFullscreenGraph(null)}
//             className="text-gray-800 dark:text-white text-2xl hover:text-red-500"
//             title="Close"
//           >
//             <FaTimes />
//           </button>
//         </div>
//         <div className="w-full">{fullscreenGraph.component}</div>
//       </div>
//     )
//   ), [fullscreenGraph]);

//   return (
//     <div>
//       <center>
//         <div className="tabs tabs-lifted m-20">
//           <button
//             role="tab"
//             className={`tab text-2xl font-bold px-6 py-5 transition-all duration-200 ${activeTab === 'graphs' ? 'tab-active py-5 text-cyan-600 text-3xl shadow-md dark:bg-slate-800 dark:text-white' : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-white'}`}
//             onClick={() => setActiveTab('graphs')}
//           >
//             <span className="dark:text-cyan-400">Data Analysis</span>
//           </button>
//           <button
//             role="tab"
//             className={`tab text-2xl font-bold px-6 py-5 transition-all duration-200 ${activeTab === 'technical' ? 'tab-active py-5 text-cyan-600 text-3xl shadow-md dark:bg-slate-800 dark:text-white' : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-white'}`}
//             onClick={() => setActiveTab('technical')}
//           >
//             <span className="dark:text-cyan-400">Candle Stick</span>
//           </button>
//         </div>
//         <div className="rounded-lg p-6 mt-8 shadow-lg dark:bg-slate-800 dark:text-white">
//           <div style={{ display: activeTab === 'graphs' ? 'block' : 'none' }}>
//             {renderGraphTabContent()}
//           </div>
//           <div style={{ display: activeTab === 'technical' ? 'block' : 'none' }}>
//             {renderTechnicalTabContent()}
//           </div>
//         </div>
//       </center>
//       {renderFullscreenOverlay()}
//     </div>
//   );
// };

// export default GraphSlider;

// import React, { useEffect, useState } from 'react';
// import CandleBreach from './CandleBreach';
// import LastTraded from './LastTraded';
// import AvgBoxPlots from './AvgBoxPlots';
// import WormsPlots from './WormsPlots';
// import SensexStockCorrBar from './SensexVsStockCorrBar';
// import SensexVsStockCorr from './SensexVsStockCorr';
// import HeatMap from './HeatMap';
// import DelRate from './DelRate';
// import VoltyPlot from './VoltyPlot';
// import IndustryBubble from './IndustryBubble';
// import TechnicalPlot from './TechnicalPlot';
// import toast from 'react-hot-toast';
// import { FaTimes } from 'react-icons/fa';
// import SensexCalculator from './SensexCalculator';
// import MacdPlot from './MacdPlot';
// import CandleSpread from './CandleSpreadDistribution';

// const GraphSlider = ({ symbol, symbols, isFullWidth, timeRange = '1Y', normalize = false, overlay = false }) => {
//   const [activeTab, setActiveTab] = useState('graphs');
//   // const [fullscreenGraph, setFullscreenGraph] = useState(null);
//     const [selectedGraphs, setSelectedGraphs] = useState([]);
//   const [plotData, setPlotData] = useState(() => {
//     const saved = localStorage.getItem('plotData');
//     return saved ? JSON.parse(saved) : {};
//   });
//   const [graphsLoaded, setGraphsLoaded] = useState(false);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   const getAuthToken = () => {
//     return localStorage.getItem('authToken');
//   };
//  useEffect(() => {

//     const fetchPlotData = async () => {
//       if (plotData?.[symbol]) {
//         setGraphsLoaded(true);
//         return;
//       }

//       try {
//         const token = getAuthToken();
//         if (!token) {
//           throw new Error('Please log in to fetch plot data.');
//         }

//         const response = await fetch(`${API_BASE}/api/stocks/process`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           body: JSON.stringify({ symbol }),
//         });

//         if (!response.ok) throw new Error('Failed to fetch plot data');

//         const data = await response.json();
//         const updatedData = { ...plotData, [symbol]: data };
//         setPlotData(updatedData);
//         localStorage.setItem('plotData', JSON.stringify(updatedData));
//         setGraphsLoaded(true);
//       } catch (error) {
//         console.error('Error fetching plot data:', error);
//         toast.error(error.message || 'Error fetching plot data');
//       }
//     };

//     if (symbols && (!plotData?.[symbol])?.[timeRange]?.[normalize ? 'normalized' : 'raw'] )fetchPlotData();
//   }, [symbol,symbols,timeRange, normalize, plotData]);

//   const graphSections = [
//     {
//       title: "Candle Chronicles: Spread Patterns Over Time (TTM)",
//       description: "Visualizes the distribution of candlestick spread patterns over the past year.",
//       component: <CandleSpread symbol={symbol} />,
//       key: "CandleSpread" ,
//       image:"/assets/Screenshot 2025-06-04 102920.png"
//     },
//     {
//       title: "Boxing Prices: TTM Box Plot for Trade Prices",
//       description: "Shows a box plot of trade prices over the last year with key levels.",
//       component: <LastTraded symbol={symbol} />,
//       key: "LastTraded",
//      image:"/assets/Screenshot 2025-06-04 102934.png"
//    },
//     {
//       title: "Price Trends in a Box: Monthly Ranges and Averages Explored (TTM)",
//       description: "Displays monthly price ranges and averages over the past year.",
//       component: <AvgBoxPlots symbol={symbol} />,
//       key: "AvgBoxPlots" ,
//  image:"/assets/Screenshot 2025-06-04 102946.png"
//     },
//     {
//       title: "Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends",
//       description: "Analyzes weekly trade delivery patterns during market trends.",
//       component: <WormsPlots symbol={symbol} />,
//       key: "WormsPlots" ,
//  image:"/assets/Screenshot 2025-06-04 103000.png"
//  },
//     {
//       title: "MACD Analysis for TTM",
//       description: "Plots the MACD indicator to identify momentum over the last year.",
//       component: <MacdPlot symbol={symbol} />,
//       key: "MacdPlot" ,
//  image:"/assets/Screenshot 2025-06-04 103019.png"
//     },
//     {
//       title: "Sensex & Stock Fluctuations",
//       description: "Compares monthly percentage changes between Sensex and the stock.",
//       component: <SensexStockCorrBar symbol={symbol} />,
//       key: "SensexStockCorrBar" ,
//  image:"/assets/sensex.png"
//  },
//     {
//       title: "Sensex Symphony: Harmonizing Stock Correlation Trends (TTM)",
//       description: "Visualizes correlation trends between Sensex and the stock.",
//       component: <SensexVsStockCorr symbol={symbol} />,
//       key: "SensexVsStockCorr",
//  image:"/assets/Screenshot 2025-06-04 103050.png"
//  },
//     {
//       title: `Performance Heatmap: Nifty50 vs BSE vs ${symbol}`,
//       description: "A heatmap comparing performance across Nifty50, BSE, and the stock.",
//       component: <HeatMap symbol={symbol} />,
//       key: "HeatMap" ,
//  image:"/assets/Screenshot 2025-06-04 103102.png"
//   },
//     {
//       title: "Market Mood: Delivery Trends & Trading Sentiment",
//       description: "Analyzes delivery trends and trading sentiment over time.",
//       component: <DelRate symbol={symbol} />,
//       key: "DelRate" ,
//  image:"/assets/Screenshot 2025-06-04 103114.png"
// },
//     {
//       title: "Breach Busters: Analyzing High and Low Breaches",
//       description: "Examines instances of high and low price breaches.",
//       component: <CandleBreach symbol={symbol} />,
//       key: "CandleBreach" ,
//  image:"/assets/Screenshot 2025-06-04 103128.png"
// },
//     {
//       title: `Volatility for ${symbol}`,
//       description: "Plots the volatility trends for the stock over the past year.",
//       component: <VoltyPlot symbol={symbol} />,
//       key: "VoltyPlot" ,
//  image:"/assets/Screenshot 2025-06-04 103142.png"
//  },
//     {
//       title: "Sensex Calculator",
//       description: "A tool to calculate Sensex-related metrics for analysis.",
//       component: <SensexCalculator />,
//       key: "SensexCalculator" ,
//  image:"/assets/Screenshot 2025-06-04 103203.png"
// },
//     {
//       title: "PE vs EPS vs Book Value: Gladiators in the Industry Arena",
//       description: "Compares PE, EPS, and Book Value within the industry context.",
//       component: <IndustryBubble symbol={symbol} />,
//       key: "IndustryBubble" ,
//  image:"/assets/sensex2.png"
//     },
//   ];

//   const handleGraphSelect = (graph) => {
//     setSelectedGraphs((prev) => {
//       // In comparison mode (side-by-side), allow one graph per GraphSlider
//       if (symbols && symbols.length > 1 && !overlay) {
//         return [graph]; // Select only the clicked graph
//       }
//       // In single-symbol or overlay mode, toggle selection (up to 2 graphs)
//       if (prev.some((g) => g.key === graph.key)) {
//         return prev.filter((g) => g.key !== graph.key);
//       }
//       if (prev.length < 2) {
//         return [...prev, graph];
//       }
//       return [prev[1], graph];
//     });
//   };

//   // Clear selected graphs
//   const handleClearSelection = () => {
//     setSelectedGraphs([]);
//   };

//   // Render graph tab content
//   const renderGraphTabContent = () => {
//     // If graphs are selected, display them instead of the grid
//     if (selectedGraphs.length > 0) {
//       return (
//         <div className={`${isFullWidth ? 'w-full' : 'w-auto'} transition-all duration-300 p-4`}>
//           {/* Button to clear selection and return to grid */}
//           <div className="flex justify-center  mb-4">
//             <button
//               onClick={handleClearSelection}
//                className="flex items-center gap-2 bg-gradient-to-r from-sky-700 to-sky-800 text-white
//                 px-6 py-3 rounded-full hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"

//             >
//               Back to Graph Selection
//             </button>
//           </div>
//           <div className={` grid ${selectedGraphs.length === 2 && !overlay ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
//             {selectedGraphs.map(({ title, component, key }) => (
//               <div
//                 key={key}
//                 className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg shadow-black  p-4 flex flex-col items-center w-full"
//               >
//                 <h2 className="text-xl font-semibold mb-3 text-center">{title}</h2>
//                 <div className="w-full h-[600px] overflow-auto">{component}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       );
//     }

//     // Display grid of graph previews if no graphs are selected
//     return (
//       <div className={`${isFullWidth ? 'w-full' : 'w-auto'} transition-all duration-300 p-4`}>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {graphSections.map(({ title, description, component, key, image }) => (
//             <div
//               key={key}
//               className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg shadow-black p-4 flex flex-col items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${
//                 selectedGraphs.some((g) => g.key === key) ? 'border-2 border-cyan-600' : ''
//               }`}
//               onClick={() => handleGraphSelect({ title, component, key })}
//             >
//                <h2 className="text-xl font-semibold mb-2 text-center sm:text-sm">{title}</h2>
//               <img src={image} alt={title} className="w-full h-32 object-cover mb-2" />

//               <p className="text-sm text-gray-600 dark:text-gray-300 text-center">{description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // Render candlestick chart
//     const renderTechnicalTabContent = () => {
//     return (
//       <div className="">
//         <section className="w-full ">
//           <h2 className="text-2xl text-center  font-bold mb-3">Candlestick Analysis</h2>
//           <TechnicalPlot symbol={symbol} cachedData={plotData[symbol]?.technicalPlot} />
//         </section>
//       </div>
//     );
//   };

//   return (
//     <div>
//       <center>
//         <div className="tabs tabs-lifted m-20 mx-auto w-max">
//           <button
//             role="tab"
//             className={`tab text-2xl font-bold transition-all duration-200 ${
//               activeTab === 'graphs'
//                 ? 'tab-active text-cyan-600 text-3xl dark:bg-slate-800 dark:text-white'
//                 : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-white'
//             }`}
//             onClick={() => setActiveTab('graphs')}
//           >
//             <span className="dark:text-cyan-400 mt-0">Data Analysis</span>
//           </button>
//           <button
//             role="tab"
//             className={`tab text-2xl font-bold transition-all duration-200 ${
//               activeTab === 'technical'
//                 ? 'tab-active text-cyan-600 text-3xl dark:bg-slate-800 dark:text-white'
//                 : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-white'
//             }`}
//             onClick={() => setActiveTab('technical')}
//           >
//             <span className="dark:text-cyan-400">Candle Stick</span>
//           </button>
//         </div>

//         <div className="p-6 mt-8 dark:bg-slate-800 dark:text-white">
//           <div style={{ display: activeTab === 'graphs' ? 'block' : 'none' }}>{renderGraphTabContent()}</div>
//           <div style={{ display: activeTab === 'technical' ? 'block' : 'none' }}>{renderTechnicalTabContent()}</div>
//         </div>
//       </center>
//     </div>
//   );
// };

// export default GraphSlider;

// import React, { useEffect, useState } from 'react';
// import CandleBreach from './CandleBreach';
// import LastTraded from './LastTraded';
// import AvgBoxPlots from './AvgBoxPlots';
// import WormsPlots from './WormsPlots';
// import SensexStockCorrBar from './SensexVsStockCorrBar';
// import SensexVsStockCorr from './SensexVsStockCorr';
// import HeatMap from './HeatMap';
// import DelRate from './DelRate';
// import VoltyPlot from './VoltyPlot';
// import IndustryBubble from './IndustryBubble';
// import TechnicalPlot from './TechnicalPlot';
// import toast from 'react-hot-toast';
// import { FaTimes } from 'react-icons/fa';
// import SensexCalculator from './SensexCalculator';
// import MacdPlot from './MacdPlot';
// import CandleSpread from './CandleSpreadDistribution';
// import candle_spread from '/public/assets/gaph1.png'
// import Industry_Bubble from '/public/assets/graph13.png'
// import Sensex_Calculator from '/public/assets/graph7.png'
// import Volty_Plot from '/public/assets/graph12.png'
// import Candle_Breach from '/public/assets/graph9.png'
// import Del_Rate from '/public/assets/graph3.png'
//   import Heat_Map from '/public/assets/graph8.png'
//   import Sensex_VsStockCorr from '/public/assets/graph5.png'
//  import Sensex_StockCorrBar from '/public/assets/graph6.png'
//   import Macd_Plot  from '/public/assets/graph11.png'
//  import Worms_Plots from '/public/assets/graph4.png'
//  import AvgBox_Plots from '/public/assets/graph10.png'
// import Last_Traded from '/public/assets/graph2.png'

// const GraphSlider = ({ symbol, symbols, isFullWidth, timeRange = '1Y', normalize = false, overlay = false }) => {
//   const [activeTab, setActiveTab] = useState('graphs');
//   // const [fullscreenGraph, setFullscreenGraph] = useState(null);
//     const [selectedGraphs, setSelectedGraphs] = useState([]);
//   const [plotData, setPlotData] = useState(() => {
//     const saved = localStorage.getItem('plotData');
//     return saved ? JSON.parse(saved) : {};
//   });
//   const [graphsLoaded, setGraphsLoaded] = useState(false);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   const getAuthToken = () => {
//     return localStorage.getItem('authToken');
//   };
//  useEffect(() => {

//     const fetchPlotData = async () => {
//       if (plotData?.[symbol]) {
//         setGraphsLoaded(true);
//         return;
//       }

//       try {
//         const token = getAuthToken();
//         if (!token) {
//           throw new Error('Please log in to fetch plot data.');
//         }

//         const response = await fetch(`${API_BASE}/api/stocks/process`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           body: JSON.stringify({ symbol }),
//         });

//         if (!response.ok) throw new Error('Failed to fetch plot data');

//         const data = await response.json();
//         const updatedData = { ...plotData, [symbol]: data };
//         setPlotData(updatedData);
//         localStorage.setItem('plotData', JSON.stringify(updatedData));
//         setGraphsLoaded(true);
//       } catch (error) {
//         console.error('Error fetching plot data:', error);
//         toast.error(error.message || 'Error fetching plot data');
//       }
//     };

//     if (symbols && (!plotData?.[symbol])?.[timeRange]?.[normalize ? 'normalized' : 'raw'] )fetchPlotData();
//   }, [symbol,symbols,timeRange, normalize, plotData]);

//   const graphSections = [
//     {
//       title: "Candle Chronicles: Spread Patterns Over Time (TTM)",
//       description: "Visualizes the distribution of candlestick spread patterns over the past year.",
//       component: <CandleSpread symbol={symbol} />,
//       key: "CandleSpread" ,
//       image:candle_spread
//     },
//     {
//       title: "Boxing Prices: TTM Box Plot for Trade Prices",
//       description: "Shows a box plot of trade prices over the last year with key levels.",
//       component: <LastTraded symbol={symbol} />,
//       key: "LastTraded",
//      image:Last_Traded
//    },
//     {
//       title: "Price Trends in a Box: Monthly Ranges and Averages Explored (TTM)",
//       description: "Displays monthly price ranges and averages over the past year.",
//       component: <AvgBoxPlots symbol={symbol} />,
//       key: "AvgBoxPlots" ,
//  image:AvgBox_Plots

//     },
//     {
//       title: "Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends",
//       description: "Analyzes weekly trade delivery patterns during market trends.",
//       component: <WormsPlots symbol={symbol} />,
//       key: "WormsPlots" ,
//  image:Worms_Plots

//  },
//     {
//       title: "MACD Analysis for TTM",
//       description: "Plots the MACD indicator to identify momentum over the last year.",
//       component: <MacdPlot symbol={symbol} />,
//       key: "MacdPlot" ,
//  image:Macd_Plot

//     },
//     {
//       title: "Sensex & Stock Fluctuations",
//       description: "Compares monthly percentage changes between Sensex and the stock.",
//       component: <SensexStockCorrBar symbol={symbol} />,
//       key: "SensexStockCorrBar" ,
//  image:Sensex_StockCorrBar

//  },
//     {
//       title: "Sensex Symphony: Harmonizing Stock Correlation Trends (TTM)",
//       description: "Visualizes correlation trends between Sensex and the stock.",
//       component: <SensexVsStockCorr symbol={symbol} />,
//       key: "SensexVsStockCorr",
//  image:Sensex_VsStockCorr

//  },
//     {
//       title: `Performance Heatmap: Nifty50 vs BSE vs ${symbol}`,
//       description: "A heatmap comparing performance across Nifty50, BSE, and the stock.",
//       component: <HeatMap symbol={symbol} />,
//       key: "HeatMap" ,
//  image:Heat_Map
//   },
//     {
//       title: "Market Mood: Delivery Trends & Trading Sentiment",
//       description: "Analyzes delivery trends and trading sentiment over time.",
//       component: <DelRate symbol={symbol} />,
//       key: "DelRate" ,
//  image:Del_Rate

// },
//     {
//       title: "Breach Busters: Analyzing High and Low Breaches",
//       description: "Examines instances of high and low price breaches.",
//       component: <CandleBreach symbol={symbol} />,
//       key: "CandleBreach" ,
//  image:Candle_Breach

// },
//     {
//       title: `Volatility for ${symbol}`,
//       description: "Plots the volatility trends for the stock over the past year.",
//       component: <VoltyPlot symbol={symbol} />,
//       key: "VoltyPlot" ,
//  image:Volty_Plot

//  },
//     {
//       title: "Sensex Calculator",
//       description: "A tool to calculate Sensex-related metrics for analysis.",
//       component: <SensexCalculator />,
//       key: "SensexCalculator" ,
//  image:Sensex_Calculator

// },
//     {
//       title: "PE vs EPS vs Book Value: Gladiators in the Industry Arena",
//       description: "Compares PE, EPS, and Book Value within the industry context.",
//       component: <IndustryBubble symbol={symbol} />,
//       key: "IndustryBubble" ,
//  image:Industry_Bubble

//     },
//   ];

//   const handleGraphSelect = (graph) => {
//     setSelectedGraphs((prev) => {
//       // In comparison mode (side-by-side), allow one graph per GraphSlider
//       if (symbols && symbols.length > 1 && !overlay) {
//         return [graph]; // Select only the clicked graph
//       }
//       // In single-symbol or overlay mode, toggle selection (up to 2 graphs)
//       if (prev.some((g) => g.key === graph.key)) {
//         return prev.filter((g) => g.key !== graph.key);
//       }
//       if (prev.length < 2) {
//         return [...prev, graph];
//       }
//       return [prev[1], graph];
//     });
//   };

//   // Clear selected graphs
//   const handleClearSelection = () => {
//     setSelectedGraphs([]);
//   };

//   // Render graph tab content
//   const renderGraphTabContent = () => {
//     // If graphs are selected, display them instead of the grid
//     if (selectedGraphs.length > 0) {
//       return (
//         <div className={`${isFullWidth ? 'w-full' : 'w-auto'} transition-all duration-300 p-4`}>
//           {/* Button to clear selection and return to grid */}
//           <div className="flex justify-center  mb-4">
//             <button
//               onClick={handleClearSelection}
//                className="flex items-center gap-2 bg-gradient-to-r from-sky-700 to-sky-800 text-white
//                 px-6 py-3 rounded-full hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"

//             >
//               Back to Graph Selection
//             </button>
//           </div>
//           <div className={` grid ${selectedGraphs.length === 2 && !overlay ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
//             {selectedGraphs.map(({ title, component, key }) => (
//               <div
//                 key={key}
//                 className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg shadow-black  p-4 flex flex-col items-center w-full"
//               >
//                 <h2 className="text-xl font-semibold mb-3 text-center">{title}</h2>
//                 <div className="w-full h-[600px] overflow-auto">{component}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       );
//     }

//     // Display grid of graph previews if no graphs are selected
//     return (
//       <div className={`${isFullWidth ? 'w-full' : 'w-auto'} transition-all duration-300 p-4`}>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {graphSections.map(({ title, description, component, key, image }) => (
//             <div
//               key={key}
//               className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg shadow-black p-4 flex flex-col items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${
//                 selectedGraphs.some((g) => g.key === key) ? 'border-2 border-cyan-600' : ''
//               }`}
//               onClick={() => handleGraphSelect({ title, component, key })}
//             >
//                <h2 className="text-xl font-semibold mb-2 text-center sm:text-sm">{title}</h2>
//               <img src={image} alt={title} className="w-full h-32 object-cover mb-2" />

//               <p className="text-sm text-gray-600 dark:text-gray-300 text-center">{description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // Render candlestick chart
//     const renderTechnicalTabContent = () => {
//     return (
//       <div className="">
//         <section className="w-full ">
//           <h2 className="text-2xl text-center  font-bold mb-3">Candlestick Analysis</h2>
//           <TechnicalPlot symbol={symbol} cachedData={plotData[symbol]?.technicalPlot} />
//         </section>
//       </div>
//     );
//   };

//   return (
//     <div>
//       <center>
//         <div className="tabs tabs-lifted m-20 mx-auto w-max">
//           <button
//             role="tab"
//             className={`tab text-2xl font-bold transition-all duration-200 ${
//               activeTab === 'graphs'
//                 ? 'tab-active text-cyan-600 text-3xl dark:bg-slate-800 dark:text-white'
//                 : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-white'
//             }`}
//             onClick={() => setActiveTab('graphs')}
//           >
//             <span className="dark:text-cyan-400 mt-0">Data Analysis</span>
//           </button>
//           <button
//             role="tab"
//             className={`tab text-2xl font-bold transition-all duration-200 ${
//               activeTab === 'technical'
//                 ? 'tab-active text-cyan-600 text-3xl dark:bg-slate-800 dark:text-white'
//                 : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-white'
//             }`}
//             onClick={() => setActiveTab('technical')}
//           >
//             <span className="dark:text-cyan-400">Candle Stick</span>
//           </button>
//         </div>

//         <div className="p-6 mt-8 dark:bg-slate-800 dark:text-white">
//           <div style={{ display: activeTab === 'graphs' ? 'block' : 'none' }}>{renderGraphTabContent()}</div>
//           <div style={{ display: activeTab === 'technical' ? 'block' : 'none' }}>{renderTechnicalTabContent()}</div>
//         </div>
//       </center>
//     </div>
//   );
// };

// export default GraphSlider;

// import React, { useEffect, useState } from 'react';
// import CandleBreach from './CandleBreach';
// import LastTraded from './LastTraded';
// import AvgBoxPlots from './AvgBoxPlots';
// import WormsPlots from './WormsPlots';
// import SensexStockCorrBar from './SensexVsStockCorrBar';
// import SensexVsStockCorr from './SensexVsStockCorr';
// import HeatMap from './HeatMap';
// import DelRate from './DelRate';
// import VoltyPlot from './VoltyPlot';
// import IndustryBubble from './IndustryBubble';
// import TechnicalPlot from './TechnicalPlot';
// import toast from 'react-hot-toast';
// import SensexCalculator from './SensexCalculator';
// import MacdPlot from './MacdPlot';
// import CandleSpread from './CandleSpreadDistribution';

// import candle_spread from '/public/assets/gaph1.png'
// import Industry_Bubble from '/public/assets/graph13.png'
// import Sensex_Calculator from '/public/assets/graph7.png'
// import Volty_Plot from '/public/assets/graph12.png'
// import Candle_Breach from '/public/assets/graph9.png'
// import Del_Rate from '/public/assets/graph3.png'
// import Heat_Map from '/public/assets/graph8.png'
// import Sensex_VsStockCorr from '/public/assets/graph5.png'
// import Sensex_StockCorrBar from '/public/assets/graph6.png'
// import Macd_Plot  from '/public/assets/graph11.png'
// import Worms_Plots from '/public/assets/graph4.png'
// import AvgBox_Plots from '/public/assets/graph10.png'
// import Last_Traded from '/public/assets/graph2.png'

// const GraphSlider = ({ symbol, symbols, isFullWidth, timeRange = '1Y', normalize = false, overlay = false }) => {
//   const [activeTab, setActiveTab] = useState('graphs');
//   const [selectedGraphs, setSelectedGraphs] = useState([]);
//   const [plotData, setPlotData] = useState(() => {
//     const saved = localStorage.getItem('plotData');
//     return saved ? JSON.parse(saved) : {};
//   });
//   const [graphsLoaded, setGraphsLoaded] = useState(false);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

//   const getAuthToken = () => localStorage.getItem('authToken');

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
//     const fetchPlotData = async () => {
//       const cacheKey = `plot_${symbol}_${timeRange}_${normalize}`;
//       const cachedData = getCachedData(cacheKey);
//       if (cachedData) {
//         setPlotData((prev) => ({ ...prev, [symbol]: cachedData }));
//         setGraphsLoaded(true);
//         return;
//       }

//       try {
//         const token = getAuthToken();
//         if (!token) {
//           throw new Error('Please log in to fetch plot data.');
//         }

//         const response = await fetch(`${API_BASE}/api/stocks/process`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           body: JSON.stringify({ symbol, timeRange, normalize }),
//         });

//         if (!response.ok) throw new Error('Failed to fetch plot data');

//         const data = await response.json();
//         setPlotData((prev) => {
//           const updated = { ...prev, [symbol]: data };
//           setCachedData(cacheKey, data);
//           return updated;
//         });
//         setGraphsLoaded(true);
//       } catch (error) {
//         console.error('Error fetching plot data:', error);
//         toast.error(error.message || 'Error fetching plot data');
//       }
//     };

//     if (symbol && !plotData?.[symbol]?.[timeRange]?.[normalize ? 'normalized' : 'raw']) {
//       fetchPlotData();
//     } else {
//       setGraphsLoaded(true);
//     }
//   }, [symbol, timeRange, normalize, plotData]);

//   const graphSections = [
//     {
//       title: "Candle Chronicles: Spread Patterns Over Time (TTM)",
//       description: "Visualizes the distribution of candlestick spread patterns over the past year.",
//       component: <CandleSpread symbol={symbol} />,
//       key: "CandleSpread",
//       image:candle_spread
//     },
//     {
//       title: "Boxing Prices: TTM Box Plot for Trade Prices",
//       description: "Shows a box plot of trade prices over the last year with key levels.",
//       component: <LastTraded symbol={symbol} />,
//       key: "LastTraded",
//       image:Last_Traded
//     },
//     {
//       title: "Price Trends in a Box: Monthly Ranges and Averages Explored (TTM)",
//       description: "Displays monthly price ranges and averages over the past year.",
//       component: <AvgBoxPlots symbol={symbol} />,
//       key: "AvgBoxPlots",
//       image:AvgBox_Plots
//     },
//     {
//       title: "Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends",
//       description: "Analyzes weekly trade delivery patterns during market trends.",
//       component: <WormsPlots symbol={symbol} />,
//       key: "WormsPlots",
//       image:Worms_Plots
//     },
//     {
//       title: "MACD Analysis for TTM",
//       description: "Plots the MACD indicator to identify momentum over the last year.",
//       component: <MacdPlot symbol={symbol} />,
//       key: "MacdPlot",
//       image:Macd_Plot
//     },
//     {
//       title: "Sensex & Stock Fluctuations",
//       description: "Compares monthly percentage changes between Sensex and the stock.",
//       component: <SensexStockCorrBar symbol={symbol} />,
//       key: "SensexStockCorrBar",
//       image:Sensex_StockCorrBar
//     },
//     {
//       title: "Sensex Symphony: Harmonizing Stock Correlation Trends (TTM)",
//       description: "Visualizes correlation trends between Sensex and the stock.",
//       component: <SensexVsStockCorr symbol={symbol} />,
//       key: "SensexVsStockCorr",
//       image:Sensex_VsStockCorr
//     },
//     {
//       title: `Performance Heatmap: Nifty50 vs BSE vs ${symbol}`,
//       description: "A heatmap comparing performance across Nifty50, BSE, and the stock.",
//       component: <HeatMap symbol={symbol} />,
//       key: "HeatMap",
//       image:Heat_Map
//     },
//     {
//       title: "Market Mood: Delivery Trends & Trading Sentiment",
//       description: "Analyzes delivery trends and trading sentiment over time.",
//       component: <DelRate symbol={symbol} />,
//       key: "DelRate",
//       image:Del_Rate
//     },
//     {
//       title: "Breach Busters: Analyzing High and Low Breaches",
//       description: "Examines instances of high and low price breaches.",
//       component: <CandleBreach symbol={symbol} />,
//       key: "CandleBreach",
//       image:Candle_Breach
//     },
//     {
//       title: `Volatility for ${symbol}`,
//       description: "Plots the volatility trends for the stock over the past year.",
//       component: <VoltyPlot symbol={symbol} />,
//       key: "VoltyPlot",
//       image:Volty_Plot
//     },
//     {
//       title: "Sensex Calculator",
//       description: "A tool to calculate Sensex-related metrics for analysis.",
//       component: <SensexCalculator />,
//       key: "SensexCalculator",
//       image:Sensex_Calculator
//     },
//     {
//       title: "PE vs EPS vs Book Value: Gladiators in the Industry Arena",
//       description: "Compares PE, EPS, and Book Value within the industry context.",
//       component: <IndustryBubble symbol={symbol} />,
//       key: "IndustryBubble",
//       image:Industry_Bubble
//     },
//   ];

//   const handleGraphSelect = (graph) => {
//     setSelectedGraphs((prev) => {
//       if (symbols && symbols.length > 1 && !overlay) {
//         return [graph];
//       }
//       if (prev.some((g) => g.key === graph.key)) {
//         return prev.filter((g) => g.key !== graph.key);
//       }
//       if (prev.length < 2) {
//         return [...prev, graph];
//       }
//       return [prev[1], graph];
//     });
//   };

//   const handleClearSelection = () => {
//     setSelectedGraphs([]);
//   };

//   const renderGraphTabContent = () => {
//     if (selectedGraphs.length > 0) {
//       return (
//         <div className={`${isFullWidth ? 'w-full' : 'w-auto'} transition-all duration-300 p-4`}>
//           <div className="flex justify-center mb-4">
//             <button
//               onClick={handleClearSelection}
//               className="flex items-center gap-2 bg-gradient-to-r from-sky-700 to-sky-800 text-white px-6 py-3 rounded-full hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
//             >
//               Back to Graph Selection
//             </button>
//           </div>
//           <div className={`grid ${selectedGraphs.length === 2 && !overlay ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
//             {selectedGraphs.map(({ title, component, key }) => (
//               <div
//                 key={key}
//                 className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg shadow-black p-4 flex flex-col items-center w-full"
//               >
//                 <h2 className="text-xl font-semibold mb-3 text-center">{title}</h2>
//                 <div className="w-full h-[600px] overflow-auto">{component}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className={`${isFullWidth ? 'w-full' : 'w-auto'} transition-all duration-300 p-4`}>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {graphSections.map(({ title, description, component, key }) => (
//             <div
//               key={key}
//               className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg shadow-black p-4 flex flex-col items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${
//                 selectedGraphs.some((g) => g.key === key) ? 'border-2 border-cyan-600' : ''
//               }`}
//               onClick={() => handleGraphSelect({ title, component, key })}
//             >
//               <h2 className="text-xl font-semibold mb-2 text-center sm:text-sm">{title}</h2>
//               <p className="text-sm text-gray-600 dark:text-gray-300 text-center">{description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const renderTechnicalTabContent = () => {
//     return (
//       <div className="">
//         <section className="w-full">
//           <h2 className="text-2xl text-center font-bold mb-3">Candlestick Analysis</h2>
//           <TechnicalPlot symbol={symbol} cachedData={plotData[symbol]?.technicalPlot} />
//         </section>
//       </div>
//     );
//   };

//   return (
//     <div>
//       <center>
//         <div className="tabs tabs-lifted m-20 mx-auto w-max">
//           <button
//             role="tab"
//             className={`tab text-2xl font-bold transition-all duration-200 ${
//               activeTab === 'graphs'
//                 ? 'tab-active text-cyan-600 text-3xl dark:bg-slate-800 dark:text-white'
//                 : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-white'
//             }`}
//             onClick={() => setActiveTab('graphs')}
//           >
//             <span className="dark:text-cyan-400 mt-0">Data Analysis</span>
//           </button>
//           <button
//             role="tab"
//             className={`tab text-2xl font-bold transition-all duration-200 ${
//               activeTab === 'technical'
//                 ? 'tab-active text-cyan-600 text-3xl dark:bg-slate-800 dark:text-white'
//                 : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-white'
//             }`}
//             onClick={() => setActiveTab('technical')}
//           >
//             <span className="dark:text-cyan-400">Candle Stick</span>
//           </button>
//         </div>
//         <div className="p-6 mt-8 dark:bg-slate-800 dark:text-white">
//           <div style={{ display: activeTab === 'graphs' ? 'block' : 'none' }}>{renderGraphTabContent()}</div>
//           <div style={{ display: activeTab === 'technical' ? 'block' : 'none' }}>{renderTechnicalTabContent()}</div>
//         </div>
//       </center>
//     </div>
//   );
// };

// export default GraphSlider;

// ++++++++++++++++++++++++++++++++++++++++++++++++++++

// import React, { useEffect, useState } from 'react';
// import CandleBreach from './CandleBreach';
// import LastTraded from './LastTraded';
// import AvgBoxPlots from './AvgBoxPlots';
// import WormsPlots from './WormsPlots';
// import SensexStockCorrBar from './SensexVsStockCorrBar';
// import SensexVsStockCorr from './SensexVsStockCorr';
// import HeatMap from './HeatMap';
// import DelRate from './DelRate';
// import VoltyPlot from './VoltyPlot';
// import IndustryBubble from './IndustryBubble';
// import TechnicalPlot from './TechnicalPlot';
// import toast from 'react-hot-toast';
// import SensexCalculator from './SensexCalculator';
// import MacdPlot from './MacdPlot';
// import CandleSpread from './CandleSpreadDistribution';

// import candle_spread from '/public/assets/gaph1.png';
// import Industry_Bubble from '/public/assets/graph13.png';
// import Sensex_Calculator from '/public/assets/graph7.png';
// import Volty_Plot from '/public/assets/graph12.png';
// import Candle_Breach from '/public/assets/graph9.png';
// import Del_Rate from '/public/assets/graph3.png';
// import Heat_Map from '/public/assets/graph8.png';
// import Sensex_VsStockCorr from '/public/assets/graph5.png';
// import Sensex_StockCorrBar from '/public/assets/graph6.png';
// import Macd_Plot from '/public/assets/graph11.png';
// import Worms_Plots from '/public/assets/graph4.png';
// import AvgBox_Plots from '/public/assets/graph10.png';
// import Last_Traded from '/public/assets/graph2.png';
// import { motion } from "framer-motion"

// const GraphSlider = ({ symbol, symbols, isFullWidth, timeRange = '1Y', normalize = false, overlay = false, tabContext = 'equityHub' }) => {
//   const [activeTab, setActiveTab] = useState(() => {
//     const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//     const saved = localStorage.getItem(storageKey);
//     return saved ? JSON.parse(saved).activeTab || 'graphs' : 'graphs';
//   });
//   const [selectedGraphs, setSelectedGraphs] = useState(() => {
//     const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//     const saved = localStorage.getItem(storageKey);
//     return saved ? JSON.parse(saved).selectedGraphs || [] : [];
//   });
//   const [plotData, setPlotData] = useState(() => {
//     const saved = localStorage.getItem('plotData');
//     return saved ? JSON.parse(saved) : {};
//   });
//   const [graphsLoaded, setGraphsLoaded] = useState(false);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

//   const getAuthToken = () => localStorage.getItem('authToken');

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
//     const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//     // Store only serializable data
//     const serializableSelectedGraphs = selectedGraphs.map(({ key, title }) => ({ key, title }));
//     localStorage.setItem(storageKey, JSON.stringify({ activeTab, selectedGraphs: serializableSelectedGraphs }));
//   }, [activeTab, selectedGraphs, symbol, tabContext]);

//   useEffect(() => {
//     const fetchPlotData = async () => {
//       const cacheKey = `plot_${symbol}_${timeRange}_${normalize}`;
//       const cachedData = getCachedData(cacheKey);
//       if (cachedData) {
//         setPlotData((prev) => ({ ...prev, [symbol]: cachedData }));
//         setGraphsLoaded(true);
//         return;
//       }

//       try {
//         const token = getAuthToken();
//         if (!token) {
//           throw new Error('Please log in to fetch plot data.');
//         }

//         const response = await fetch(`${API_BASE}/stocks/process`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           body: JSON.stringify({ symbol, timeRange, normalize }),
//         });

//         if (!response.ok) throw new Error('Failed to fetch plot data');

//         const data = await response.json();
//         setPlotData((prev) => {
//           const updated = { ...prev, [symbol]: data };
//           setCachedData(cacheKey, data);
//           return updated;
//         });
//         setGraphsLoaded(true);
//       } catch (error) {
//         console.error('Error fetching plot data:', error);
//         toast.error(error.message || 'Error fetching plot data');
//       }
//     };

//     if (symbol && !plotData?.[symbol]?.[timeRange]?.[normalize ? 'normalized' : 'raw']) {
//       fetchPlotData();
//     } else {
//       setGraphsLoaded(true);
//     }
//   }, [symbol, timeRange, normalize, plotData]);

//   const graphSections = [
//     {
//       title: "Candle Chronicles: Spread Patterns Over Time (TTM)",
//       description: "Visualizes the distribution of candlestick spread patterns over the past year.",
//       component: <CandleSpread symbol={symbol} />,
//       key: "CandleSpread",
//       image: candle_spread,
//     },
//     {
//       title: "Boxing Prices: TTM Box Plot for Trade Prices",
//       description: "Shows a box plot of trade prices over the last year with key levels.",
//       component: <LastTraded symbol={symbol} />,
//       key: "LastTraded",
//       image: Last_Traded,
//     },
//     {
//       title: "Price Trends in a Box: Monthly Ranges and Averages Explored (TTM)",
//       description: "Displays monthly price ranges and averages over the past year.",
//       component: <AvgBoxPlots symbol={symbol} />,
//       key: "AvgBoxPlots",
//       image: AvgBox_Plots,
//     },
//     {
//       title: "Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends",
//       description: "Analyzes weekly trade delivery patterns during market trends.",
//       component: <WormsPlots symbol={symbol} />,
//       key: "WormsPlots",
//       image: Worms_Plots,
//     },
//     {
//       title: "MACD Analysis for TTM",
//       description: "Plots the MACD indicator to identify momentum over the last year.",
//       component: <MacdPlot symbol={symbol} />,
//       key: "MacdPlot",
//       image: Macd_Plot,
//     },
//     {
//       title: "Sensex & Stock Fluctuations",
//       description: "Compares monthly percentage changes between Sensex and the stock.",
//       component: <SensexStockCorrBar symbol={symbol} />,
//       key: "SensexStockCorrBar",
//       image: Sensex_StockCorrBar,
//     },
//     {
//       title: "Sensex Symphony: Harmonizing Stock Correlation Trends (TTM)",
//       description: "Visualizes correlation trends between Sensex and the stock.",
//       component: <SensexVsStockCorr symbol={symbol} />,
//       key: "SensexVsStockCorr",
//       image: Sensex_VsStockCorr,
//     },
//     {
//       title: `Performance Heatmap: Nifty50 vs BSE vs ${symbol}`,
//       description: "A heatmap comparing performance across Nifty50, BSE, and the stock.",
//       component: <HeatMap symbol={symbol} />,
//       key: "HeatMap",
//       image: Heat_Map,
//     },
//     {
//       title: "Market Mood: Delivery Trends & Trading Sentiment",
//       description: "Analyzes delivery trends and trading sentiment over time.",
//       component: <DelRate symbol={symbol} />,
//       key: "DelRate",
//       image: Del_Rate,
//     },
//     {
//       title: "Breach Busters: Analyzing High and Low Breaches",
//       description: "Examines instances of high and low price breaches.",
//       component: <CandleBreach symbol={symbol} />,
//       key: "CandleBreach",
//       image: Candle_Breach,
//     },
//     {
//       title: "Sensex Calculator",
//       description: "A tool to calculate Sensex-related metrics for analysis.",
//       component: <SensexCalculator />,
//       key: "SensexCalculator",
//       image: Sensex_Calculator,
//     },
//     {
//       title: "PE vs EPS vs Book Value: Gladiators in the Industry Arena",
//       description: "Compares PE, EPS, and Book Value within the industry context.",
//       component: <IndustryBubble symbol={symbol} />,
//       key: "IndustryBubble",
//       image: Industry_Bubble,
//     },
//   ];

//   const handleGraphSelect = (graph) => {
//     setSelectedGraphs((prev) => {
//       if (symbols && symbols.length > 1 && !overlay) {
//         return [{ key: graph.key, title: graph.title }]; // Store only serializable data
//       }
//       if (prev.some((g) => g.key === graph.key)) {
//         return prev.filter((g) => g.key !== graph.key);
//       }
//       if (prev.length < 2) {
//         return [...prev, { key: graph.key, title: graph.title }];
//       }
//       return [prev[1], { key: graph.key, title: graph.title }];
//     });
//   };

//   const handleClearSelection = () => {
//     setSelectedGraphs([]);
//   };

//   const renderGraphTabContent = () => {
//     if (selectedGraphs.length > 0) {
//       return (
//         <div className={`${isFullWidth ? 'w-full' : 'w-auto'} transition-all duration-300 p-4`}>
//           <div className="flex justify-center mb-4">
//             <button
//               onClick={handleClearSelection}
//               className="flex items-center gap-2 bg-gradient-to-r from-sky-700 to-sky-800 text-white px-6 py-3 rounded-full hover:from-cyan-600 hover:to-cyan-700 transition-all "
//             >
//               Back to Graph Selection
//             </button>
//           </div>
//           <div className={`grid ${selectedGraphs.length === 2 && !overlay ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
//             {selectedGraphs.map(({ title, key }) => {
//               const graph = graphSections.find((g) => g.key === key);
//               return (
//                 <div
//                   key={key}
//                   className="relative bg-white dark:bg-gray-800 rounded-lg  p-4 flex flex-col items-center w-full"
//                 >
//                   <h2 className="text-xl font-semibold mb-3 text-center">{title}</h2>
//                   <div className="w-full h-[600px] overflow-auto">{graph.component}</div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className={`${isFullWidth ? 'w-full' : 'w-auto'} transition-all duration-300 p-4`}>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {graphSections.map(({ title, description, key, image }) => (
//             <div
//               key={key}
//               className={`relative bg-white dark:bg-gray-800  p-4 flex flex-col items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ${
//                 selectedGraphs.some((g) => g.key === key) ? '' : ''
//               }`}
//               onClick={() => handleGraphSelect({ title, key })}
//             >
//               <img src={image} alt={title} className="w-full h-32 object-cover rounded mb-2" />
//               <h2 className="text-xl font-semibold mb-2 text-center sm:text-sm">{title}</h2>
//               <p className="text-sm text-gray-600 dark:text-gray-300 text-center">{description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const renderTechnicalTabContent = () => {
//     return (
//       <div className="">
//         <section className="w-full">
//           <h2 className="text-2xl text-center font-bold mb-3">Candlestick Analysis</h2>
//           <TechnicalPlot symbol={symbol} cachedData={plotData[symbol]?.technicalPlot} />
//         </section>
//       </div>
//     );
//   };

//       return (
//    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//   {/* Tab Navigation */}
//   <motion.div
//     className="flex justify-center mb-8"
//     initial={{ opacity: 0, y: -20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.3 }}
//   >
//     <div className="relative bg-gray-100 dark:bg-slate-700 p-1 inline-flex">
//       <div
//         className="absolute h-[calc(100%-8px)] top-1 bg-white dark:bg-slate-800  transition-all duration-300 ease-in-out"
//         style={{
//           width: `${activeTab === 'graphs' ? '50%' : '50%'}`,
//           left: `${activeTab === 'graphs' ? '4px' : 'calc(50% - 4px)'}`,
//         }}
//       />

//       <button
//         onClick={() => setActiveTab('graphs')}
//         className={`relative z-10 px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
//           activeTab === 'graphs'
//             ? 'text-cyan-600 dark:text-cyan-400'
//             : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100'
//         }`}
//       >
//         <span className="flex items-center">
//           <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//           </svg>
//           Data Analysis
//         </span>
//       </button>

//       <button
//         onClick={() => setActiveTab('technical')}
//         className={`relative z-10 px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
//           activeTab === 'technical'
//             ? 'text-cyan-600 dark:text-cyan-400'
//             : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100'
//         }`}
//       >
//         <span className="flex justify-center items-center">
//           <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
//           </svg>
//           Candle Stick
//         </span>
//       </button>
//     </div>
//   </motion.div>

//   {/* Tab Content */}
//   <motion.div
//     className="bg-white dark:bg-slate-800  overflow-hidden"
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     transition={{ delay: 0.1 }}
//   >
//     <div className="p-6">
//       <div className={activeTab === 'graphs' ? 'block' : 'hidden'}>
//         {renderGraphTabContent()}
//       </div>
//       <div className={activeTab === 'technical' ? 'block' : 'hidden'}>
//         {renderTechnicalTabContent()}
//       </div>
//     </div>
//   </motion.div>
// </div>
//   );

//   // return (
//   //   <div>
//   //     <center>
//   //       <div className="tabs tabs-lifted m-20 mx-auto w-max">
//   //         <button
//   //           role="tab"
//   //           className={`tab text-2xl font-bold transition-all duration-200 ${
//   //             activeTab === 'graphs'
//   //               ? 'tab-active text-cyan-600 text-3xl dark:bg-slate-800 dark:text-white'
//   //               : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-white'
//   //           }`}
//   //           onClick={() => setActiveTab('graphs')}
//   //         >
//   //           <span className="dark:text-cyan-400 mt-0">Data Analysis</span>
//   //         </button>
//   //         <button
//   //           role="tab"
//   //           className={`tab text-2xl font-bold transition-all duration-200 ${
//   //             activeTab === 'technical'
//   //               ? 'tab-active text-cyan-600 text-3xl dark:bg-slate-800 dark:text-white'
//   //               : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-white'
//   //           }`}
//   //           onClick={() => setActiveTab('technical')}
//   //         >
//   //           <span className="dark:text-cyan-400">Candle Stick</span>
//   //         </button>
//   //       </div>
//   //       <div className="p-6 mt-8 dark:bg-slate-800 dark:text-white">
//   //         <div style={{ display: activeTab === 'graphs' ? 'block' : 'none' }}>{renderGraphTabContent()}</div>
//   //         <div style={{ display: activeTab === 'technical' ? 'block' : 'none' }}>{renderTechnicalTabContent()}</div>
//   //       </div>
//   //     </center>
//   //   </div>
//   // );
// };

// export default GraphSlider;

// +++++++++++++++++++++++++++++++++++

// import React, { useEffect, useState } from 'react';
// // import { useAuth } from './AuthContext';
// import CandleBreach from './CandleBreach';
// import LastTraded from './LastTraded';
// import AvgBoxPlots from './AvgBoxPlots';
// import WormsPlots from './WormsPlots';
// import SensexStockCorrBar from './SensexVsStockCorrBar';
// import SensexVsStockCorr from './SensexVsStockCorr';
// import HeatMap from './HeatMap';
// import DelRate from './DelRate';
// import VoltyPlot from './VoltyPlot';
// import IndustryBubble from './IndustryBubble';
// import TechnicalPlot from './TechnicalPlot';
// import toast from 'react-hot-toast';
// import SensexCalculator from './SensexCalculator';
// import MacdPlot from './MacdPlot';
// import CandleSpread from './CandleSpreadDistribution';
// import Login from '../Login';

// import candle_spread from '/public/assets/gaph1.png';
// import Industry_Bubble from '/public/assets/graph13.png';
// import Sensex_Calculator from '/public/assets/graph7.png';
// import Volty_Plot from '/public/assets/graph12.png';
// import Candle_Breach from '/public/assets/graph9.png';
// import Del_Rate from '/public/assets/graph3.png';
// import Heat_Map from '/public/assets/graph8.png';
// import Sensex_VsStockCorr from '/public/assets/graph5.png';
// import Sensex_StockCorrBar from '/public/assets/graph6.png';
// import Macd_Plot from '/public/assets/graph11.png';
// import Worms_Plots from '/public/assets/graph4.png';
// import AvgBox_Plots from '/public/assets/graph10.png';
// import Last_Traded from '/public/assets/graph2.png';
// import { CgLogIn } from 'react-icons/cg';
// import { useAuth } from '../AuthContext';
// import CandlePattern from './CandlePattern';
// import Shareholding from './Shareholding';

// const GraphSlider = ({ symbol, symbols, isFullWidth, timeRange = '1Y', normalize = false, overlay = false, tabContext = 'equityHub', getAuthToken }) => {
//   const { isLoggedIn } = useAuth();
//   const [activeTab, setActiveTab] = useState(() => {
//     const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//     const saved = localStorage.getItem(storageKey);
//     return saved ? JSON.parse(saved).activeTab || 'graphs' : 'graphs';
//   });
//   const [selectedGraphs, setSelectedGraphs] = useState(() => {
//     const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//     const saved = localStorage.getItem(storageKey);
//     return saved ? JSON.parse(saved).selectedGraphs || [] : [];
//   });
//   const [plotData, setPlotData] = useState(() => {
//     const saved = localStorage.getItem('plotData');
//     return saved ? JSON.parse(saved) : {};
//   });
//   const [graphsLoaded, setGraphsLoaded] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [error, setError] = useState(null);
//   const API_BASE = import.meta.env.VITE_URL || 'http://localhost:8080';
//   const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
//   const MAX_VISIBLE_GRAPHS = 5;

//   const handleLoginClick = () => setShowLoginModal(true);
//   const handleCloseModal = () => setShowLoginModal(false);
//   const handleLoginSuccess = () => handleCloseModal();

//   const getCachedData = (key) => {
//     const cached = localStorage.getItem(key);
//     if (!cached) return null;
//     try {
//       const { data, timestamp } = JSON.parse(cached);
//       if (Date.now() - timestamp > CACHE_TTL) {
//         localStorage.removeItem(key);
//         return null;
//       }
//       return data;
//     } catch (err) {
//       console.error(`Failed to parse cached data for ${key}:`, err);
//       localStorage.removeItem(key);
//       return null;
//     }
//   };

//   const setCachedData = (key, data) => {
//     try {
//       const serializedData = JSON.stringify({ data, timestamp: Date.now() });
//       if (serializedData.length > 1024 * 1024) {
//         console.warn(`Data for ${key} exceeds 1MB, skipping cache.`);
//         return;
//       }
//       localStorage.setItem(key, serializedData);
//     } catch (err) {
//       if (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
//         console.error(`Quota exceeded for key ${key}. Clearing oldest items and retrying.`);
//         const now = Date.now();
//         for (let i = 0; i < localStorage.length; i++) {
//           const key = localStorage.key(i);
//           const cached = localStorage.getItem(key);
//           try {
//             const { timestamp } = JSON.parse(cached);
//             if (now - timestamp > 24 * 60 * 60 * 1000) {
//               localStorage.removeItem(key);
//               i--;
//             }
//           } catch (e) {
//             localStorage.removeItem(key);
//             i--;
//           }
//         }
//         try {
//           localStorage.setItem(key, serializedData);
//         } catch (retryErr) {
//           console.error(`Retry failed for ${key}. Switching to no-cache mode.`, retryErr);
//           setError("Storage quota exceeded. Data will be fetched live.");
//         }
//       } else {
//         console.error(`Failed to cache data for ${key}:`, err);
//         setError("Failed to cache data due to an unexpected error.");
//       }
//     }
//   };

//   useEffect(() => {
//     const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//     const serializableSelectedGraphs = selectedGraphs.map(({ key, title }) => ({ key, title }));
//     localStorage.setItem(storageKey, JSON.stringify({ activeTab, selectedGraphs: serializableSelectedGraphs }));
//   }, [activeTab, selectedGraphs, symbol, tabContext]);

//   useEffect(() => {
//     const fetchPlotData = async () => {
//       if (!symbol) {
//         setGraphsLoaded(true);
//         return;
//       }
//       const cacheKey = `plot_${symbol}_${timeRange}_${normalize}`;
//       const cachedData = getCachedData(cacheKey);
//       if (cachedData) {
//         setPlotData((prev) => ({ ...prev, [symbol]: cachedData }));
//         setGraphsLoaded(true);
//         return;
//       }

//       try {
//         const response = await fetch(`${API_BASE}/stocks/process`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             ...(getAuthToken && { Authorization: `Bearer ${getAuthToken()}` }),
//           },
//           body: JSON.stringify({ symbol, timeRange, normalize }),
//         });

//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         const data = await response.json();
//         setPlotData((prev) => {
//           const updated = { ...prev, [symbol]: { ...prev[symbol], [timeRange]: { [normalize ? 'normalized' : 'raw']: data } } };
//           setCachedData(cacheKey, data);
//           return updated;
//         });
//         setGraphsLoaded(true);
//       } catch (error) {
//         console.error('Error fetching plot data:', error);
//         toast.error(error.message || 'Error fetching plot data');
//       }
//     };

//     fetchPlotData();
//   }, [symbol, timeRange, normalize, API_BASE, getAuthToken]);

//   const graphSections = [
//     { title: "Candle Chronicles: Spread Patterns Over Time (TTM)", description: "Visualizes the distribution of candlestick spread patterns over the past year.", component: <CandleSpread symbol={symbol} />, key: "CandleSpread", image: candle_spread },
//     { title: "Boxing Prices: TTM Box Plot for Trade Prices", description: "Shows a box plot of trade prices over the last year with key levels.", component: <LastTraded symbol={symbol} />, key: "LastTraded", image: Last_Traded },
//     { title: "Price Trends in a Box: Monthly Ranges and Averages Explored (TTM)", description: "Displays monthly price ranges and averages over the past year.", component: <AvgBoxPlots symbol={symbol} />, key: "AvgBoxPlots", image: AvgBox_Plots },
//     { title: "Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends", description: "Analyzes weekly trade delivery patterns during market trends.", component: <WormsPlots symbol={symbol} />, key: "WormsPlots", image: Worms_Plots },
//     { title: "MACD Analysis for TTM", description: "Plots the MACD indicator to identify momentum over the last year.", component: <MacdPlot symbol={symbol} />, key: "MacdPlot", image: Macd_Plot },
//     { title: "Sensex & Stock Fluctuations", description: "Compares monthly percentage changes between Sensex and the stock.", component: <SensexStockCorrBar symbol={symbol} />, key: "SensexStockCorrBar", image: Sensex_StockCorrBar },
//     { title: "Sensex Symphony: Harmonizing Stock Correlation Trends (TTM)", description: "Visualizes correlation trends between Sensex and the stock.", component: <SensexVsStockCorr symbol={symbol} />, key: "SensexVsStockCorr", image: Sensex_VsStockCorr },
//     { title: `Performance Heatmap: Nifty50 vs BSE vs ${symbol}`, description: "A heatmap comparing performance across Nifty50, BSE, and the stock.", component: <HeatMap symbol={symbol} />, key: "HeatMap", image: Heat_Map },
//     { title: "Market Mood: Delivery Trends & Trading Sentiment", description: "Analyzes delivery trends and trading sentiment over time.", component: <DelRate symbol={symbol} />, key: "DelRate", image: Del_Rate },
//     { title: "Breach Busters: Analyzing High and Low Breaches", description: "Examines instances of high and low price breaches.", component: <CandleBreach symbol={symbol} />, key: "CandleBreach", image: Candle_Breach },
//     { title: "Sensex Calculator", description: "A tool to calculate Sensex-related metrics for analysis.", component: <SensexCalculator />, key: "SensexCalculator", image: Sensex_Calculator },
//     { title: "PE vs EPS vs Book Value: Gladiators in the Industry Arena", description: "Compares PE, EPS, and Book Value within the industry context.", component: <IndustryBubble symbol={symbol} />, key: "IndustryBubble", image: Industry_Bubble },
//   ];

//   const handleGraphSelect = (graph) => {
//     if (!isLoggedIn && !graphSections.slice(0, MAX_VISIBLE_GRAPHS).some((g) => g.key === graph.key)) {
//       setShowLoginModal(true);
//       return;
//     }
//     setSelectedGraphs((prev) => {
//       if (symbols && symbols.length > 1 && !overlay) return [{ key: graph.key, title: graph.title }];
//       if (prev.some((g) => g.key === graph.key)) return prev.filter((g) => g.key !== graph.key);
//       if (prev.length < 2) return [...prev, { key: graph.key, title: graph.title }];
//       return [prev[1], { key: graph.key, title: graph.title }];
//     });
//   };

//   const handleClearSelection = () => setSelectedGraphs([]);

//   const renderGraphTabContent = () => {
//     if (selectedGraphs.length > 0) {
//       return (
//         <div className={`${isFullWidth ? 'w-full' : 'w-auto'} transition-all duration-300 p-4`}>
//           <div className="flex justify-center mb-4">
//             <button
//               onClick={handleClearSelection}
//               className="flex items-center gap-2 bg-gradient-to-r from-sky-700 to-sky-800 text-white px-6 py-3 rounded-full hover:from-cyan-600 hover:to-cyan-700 transition-all hover:shadow-xl"
//             >
//               Back to Graph Selection
//             </button>
//           </div>
//           <div className={`grid ${selectedGraphs.length === 2 && !overlay ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
//             {selectedGraphs.map(({ title, key }) => {
//               const graph = graphSections.find((g) => g.key === key);
//               return graph ? (
//                 <div key={key} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm shadow-gray-300 p-4 flex flex-col items-center w-full h-full">
//                   <h2 className="text-xl font-semibold text-black mb-3 text-center">{title}</h2>
//                   <div className="w-full h-[600px] overflow-auto">{graph.component}</div>
//                 </div>
//               ) : null;
//             })}
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className={`${isFullWidth ? 'w-full' : 'w-auto'} transition-all duration-300 p-4`}>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {graphSections.map(({ title, description, key, image }, index) => {
//             const isVisible = isLoggedIn || index < MAX_VISIBLE_GRAPHS;
//             return (
//               <div
//                 key={key}
//                 className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg shadow-black p-4 flex flex-col items-center w-full h-full min-h-[300px] cursor-pointer"
//                 onClick={() => (isVisible ? handleGraphSelect({ title, key }) : handleLoginClick())}
//                 role="button"
//                 tabIndex={0}
//               >
//                 <div className="relative w-full h-full flex flex-col items-center">
//                   <div className="absolute inset-0 flex flex-col items-center" style={{ filter: !isVisible ? 'blur(5px)' : 'none' }}>
//                     <img src={image} alt={title} className="w-full h-32 object-cover rounded mb-2" />
//                     <h2 className="text-xl font-semibold text-black mb-2 text-center sm:text-sm">{title}</h2>
//                     <p className="text-sm text-gray-600 dark:text-gray-300 text-center">{description}</p>
//                   </div>
//                   {!isVisible && (
//                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 rounded-lg z-10">
//                       <CgLogIn className="w-12 h-12 text-white mb-2" />
//                       <span className="text-white text-xl font-semibold text-center">Please Login to Unlock</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   const renderTechnicalTabContent = () => (
//     <div className="w-full">
//       <h2 className="text-2xl text-center text-black font-bold mb-3">Candlestick Analysis</h2>
//       <TechnicalPlot symbol={symbol} cachedData={plotData[symbol]?.[timeRange]?.[normalize ? 'normalized' : 'raw']} />
//     </div>
//   );

//   const renderCandlePatternTabContent = () => (
//     <div className="w-full">
//       <h2 className="text-2xl text-center text-black font-bold mb-3"></h2>
//       <CandlePattern symbol={symbol} />
//     </div>
//   );

//       const renderShareHoldingTabContent = () => (
//     <div className="w-full">
//       {/* <h2 className="text-2xl text-center text-black font-bold mb-3">Candlestick Analysis</h2> */}
//       <Shareholding symbol={symbol} />
//     </div>
//   );

//   return (
//     <div className="text-center">
//       <div className="tabs tabs-lifted m-20 mx-auto w-max">
//         <button
//           role="tab"
//           className={`tab text-2xl font-bold transition-all duration-200 ${
//             activeTab === 'graphs'
//               ? 'tab-active text-cyan-600 text-3xl dark:text-cyan-400'
//               : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-gray-300'
//           }`}
//           onClick={() => setActiveTab('graphs')}
//         >
//           Data Analysis
//         </button>
//         <button
//           role="tab"
//           className={`tab text-2xl font-bold transition-all duration-200 ${
//             activeTab === 'technical'
//               ? 'tab-active text-cyan-600 text-3xl dark:text-cyan-400'
//               : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-gray-300'
//           }`}
//           onClick={() => setActiveTab('technical')}
//         >
//           Candle Stick
//         </button>
//         <button
//           role="tab"
//           className={`tab text-2xl font-bold transition-all duration-200 ${
//             activeTab === 'finance'
//               ? 'tab-active text-cyan-600 text-3xl dark:text-cyan-400'
//               : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-gray-300'
//           }`}
//           onClick={() => setActiveTab('candle_pattern')}
//         >
//           Candle Pattern
//         </button>
//         <button
//             role="tab"
//             className={`tab text-2xl font-bold transition-all duration-200 ${
//               activeTab === 'finance'
//                 ? 'tab-active text-cyan-600 text-3xl dark:text-cyan-400'
//                 : 'bg-base-200 text-gray-600 hover:bg-gray-300 hover:text-black dark:bg-slate-800 dark:text-gray-300'
//             }`}
//             onClick={() => setActiveTab('Shareholding')}
//           >
//             ShareHolding
//       </button>

//       </div>
//       <div className="p-6 mt-8 dark:bg-slate-800 dark:text-white">
//         {activeTab === 'graphs' && renderGraphTabContent()}
//         {activeTab === 'technical' && renderTechnicalTabContent()}
//         {activeTab === 'candle_pattern' && renderCandlePatternTabContent()}
//         {activeTab === 'Shareholding' && renderShareHoldingTabContent()}
//       </div>

//       <Login isOpen={showLoginModal} onClose={handleCloseModal} onSuccess={handleLoginSuccess} showButtons={false} />
//     </div>
//   );
// };

// export default GraphSlider;

// -----------------------woco---------------------

// import React, { useEffect, useState } from 'react';
// // import { useAuth } from './AuthContext';
// import CandleBreach from './CandleBreach';
// import LastTraded from './LastTraded';
// import AvgBoxPlots from './AvgBoxPlots';
// import WormsPlots from './WormsPlots';
// import SensexStockCorrBar from './SensexVsStockCorrBar';
// import SensexVsStockCorr from './SensexVsStockCorr';
// import HeatMap from './HeatMap';
// import DelRate from './DelRate';
// import VoltyPlot from './VoltyPlot';
// import IndustryBubble from './IndustryBubble';
// import TechnicalPlot from './TechnicalPlot';
// import toast from 'react-hot-toast';
// import SensexCalculator from './SensexCalculator';
// import MacdPlot from './MacdPlot';
// import CandleSpread from './CandleSpreadDistribution';
// import Login from '../Login';

// import candle_spread from '/public/assets/gaph1.png';
// import Industry_Bubble from '/public/assets/graph13.png';
// import Sensex_Calculator from '/public/assets/graph7.png';
// import Volty_Plot from '/public/assets/graph12.png';
// import Candle_Breach from '/public/assets/graph9.png';
// import Del_Rate from '/public/assets/graph3.png';
// import Heat_Map from '/public/assets/graph8.png';
// import Sensex_VsStockCorr from '/public/assets/graph5.png';
// import Sensex_StockCorrBar from '/public/assets/graph6.png';
// import Macd_Plot from '/public/assets/graph11.png';
// import Worms_Plots from '/public/assets/graph4.png';
// import AvgBox_Plots from '/public/assets/graph10.png';
// import Last_Traded from '/public/assets/graph2.png';
// // import { CgLogIn } from 'react-icons/cg';
// import { useAuth } from '../AuthContext';
// import CandlePattern from './CandlePattern';
// import Shareholding from './Shareholding';
// // import FinancialTab from './FinanicialTab';
// import { FaUserLock } from 'react-icons/fa';
// import FinancialTab from './FinancialTab';

// const GraphSlider = ({ symbol, symbols, isFullWidth, timeRange = '1Y', normalize = false, overlay = false, tabContext = 'equityHub', getAuthToken }) => {
//   const { isLoggedIn } = useAuth();
//   const [activeTab, setActiveTab] = useState(() => {
//     const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//     const saved = localStorage.getItem(storageKey);
//     return saved ? JSON.parse(saved).activeTab || 'graphs' : 'graphs';
//   });
//   const [selectedGraphs, setSelectedGraphs] = useState(() => {
//     const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//     const saved = localStorage.getItem(storageKey);
//     return saved ? JSON.parse(saved).selectedGraphs || [] : [];
//   });
//   const [plotData, setPlotData] = useState(() => {
//     const saved = localStorage.getItem('plotData');
//     return saved ? JSON.parse(saved) : {};
//   });
//   const [graphsLoaded, setGraphsLoaded] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [error, setError] = useState(null);
//   const API_BASE = import.meta.env.VITE_URL || 'http://localhost:8080';
//   const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
//   const MAX_VISIBLE_GRAPHS = 5;

//   const handleLoginClick = () => setShowLoginModal(true);
//   const handleCloseModal = () => setShowLoginModal(false);
//   const handleLoginSuccess = () => handleCloseModal();

//   const getCachedData = (key) => {
//     const cached = localStorage.getItem(key);
//     if (!cached) return null;
//     try {
//       const { data, timestamp } = JSON.parse(cached);
//       if (Date.now() - timestamp > CACHE_TTL) {
//         localStorage.removeItem(key);
//         return null;
//       }
//       return data;
//     } catch (err) {
//       console.error(`Failed to parse cached data for ${key}:`, err);
//       localStorage.removeItem(key);
//       return null;
//     }
//   };

//   const setCachedData = (key, data) => {
//     try {
//       const serializedData = JSON.stringify({ data, timestamp: Date.now() });
//       if (serializedData.length > 1024 * 1024) {
//         console.warn(`Data for ${key} exceeds 1MB, skipping cache.`);
//         return;
//       }
//       localStorage.setItem(key, serializedData);
//     } catch (err) {
//       if (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
//         console.error(`Quota exceeded for key ${key}. Clearing oldest items and retrying.`);
//         const now = Date.now();
//         for (let i = 0; i < localStorage.length; i++) {
//           const key = localStorage.key(i);
//           const cached = localStorage.getItem(key);
//           try {
//             const { timestamp } = JSON.parse(cached);
//             if (now - timestamp > 24 * 60 * 60 * 1000) {
//               localStorage.removeItem(key);
//               i--;
//             }
//           } catch (e) {
//             localStorage.removeItem(key);
//             i--;
//           }
//         }
//         try {
//           localStorage.setItem(key, serializedData);
//         } catch (retryErr) {
//           console.error(`Retry failed for ${key}. Switching to no-cache mode.`, retryErr);
//           setError("Storage quota exceeded. Data will be fetched live.");
//         }
//       } else {
//         console.error(`Failed to cache data for ${key}:`, err);
//         setError("Failed to cache data due to an unexpected error.");
//       }
//     }
//   };

//   useEffect(() => {
//     const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//     const serializableSelectedGraphs = selectedGraphs.map(({ key, title }) => ({ key, title }));
//     localStorage.setItem(storageKey, JSON.stringify({ activeTab, selectedGraphs: serializableSelectedGraphs }));
//   }, [activeTab, selectedGraphs, symbol, tabContext]);

//   useEffect(() => {
//     const fetchPlotData = async () => {
//       if (!symbol) {
//         setGraphsLoaded(true);
//         return;
//       }
//       const cacheKey = `plot_${symbol}_${timeRange}_${normalize}`;
//       const cachedData = getCachedData(cacheKey);
//       if (cachedData) {
//         setPlotData((prev) => ({ ...prev, [symbol]: cachedData }));
//         setGraphsLoaded(true);
//         return;
//       }

//       try {
//         const response = await fetch(`${API_BASE}/stocks/process`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             ...(getAuthToken && { Authorization: `Bearer ${getAuthToken()}` }),
//           },
//           body: JSON.stringify({ symbol, timeRange, normalize }),
//         });

//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         const data = await response.json();
//         setPlotData((prev) => {
//           const updated = { ...prev, [symbol]: { ...prev[symbol], [timeRange]: { [normalize ? 'normalized' : 'raw']: data } } };
//           setCachedData(cacheKey, data);
//           return updated;
//         });
//         setGraphsLoaded(true);
//       } catch (error) {
//         console.error('Error fetching plot data:', error);
//         toast.error(error.message || 'Error fetching plot data');
//       }
//     };

//     fetchPlotData();
//   }, [symbol, timeRange, normalize, API_BASE, getAuthToken]);

//   const graphSections = [
//     { title: "Candle Chronicles: Spread Patterns Over Time (TTM)", description: "Visualizes the distribution of candlestick spread patterns over the past year.", component: <CandleSpread symbol={symbol} />, key: "CandleSpread", image: candle_spread },
//     { title: "Boxing Prices: TTM Box Plot for Trade Prices", description: "Shows a box plot of trade prices over the last year with key levels.", component: <LastTraded symbol={symbol} />, key: "LastTraded", image: Last_Traded },
//     { title: "Price Trends in a Box: Monthly Ranges and Averages Explored (TTM)", description: "Displays monthly price ranges and averages over the past year.", component: <AvgBoxPlots symbol={symbol} />, key: "AvgBoxPlots", image: AvgBox_Plots },
//     { title: "Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends", description: "Analyzes weekly trade delivery patterns during market trends.", component: <WormsPlots symbol={symbol} />, key: "WormsPlots", image: Worms_Plots },
//     { title: "MACD Analysis for TTM", description: "Plots the MACD indicator to identify momentum over the last year.", component: <MacdPlot symbol={symbol} />, key: "MacdPlot", image: Macd_Plot },
//     { title: "Sensex & Stock Fluctuations", description: "Compares monthly percentage changes between Sensex and the stock.", component: <SensexStockCorrBar symbol={symbol} />, key: "SensexStockCorrBar", image: Sensex_StockCorrBar },
//     { title: "Sensex Symphony: Harmonizing Stock Correlation Trends (TTM)", description: "Visualizes correlation trends between Sensex and the stock.", component: <SensexVsStockCorr symbol={symbol} />, key: "SensexVsStockCorr", image: Sensex_VsStockCorr },
//     { title: `Performance Heatmap: Nifty50 vs BSE vs ${symbol}`, description: "A heatmap comparing performance across Nifty50, BSE, and the stock.", component: <HeatMap symbol={symbol} />, key: "HeatMap", image: Heat_Map },
//     { title: "Market Mood: Delivery Trends & Trading Sentiment", description: "Analyzes delivery trends and trading sentiment over time.", component: <DelRate symbol={symbol} />, key: "DelRate", image: Del_Rate },
//     { title: "Breach Busters: Analyzing High and Low Breaches", description: "Examines instances of high and low price breaches.", component: <CandleBreach symbol={symbol} />, key: "CandleBreach", image: Candle_Breach },
//     { title: "Sensex Calculator", description: "A tool to calculate Sensex-related metrics for analysis.", component: <SensexCalculator />, key: "SensexCalculator", image: Sensex_Calculator },
//     { title: "PE vs EPS vs Book Value: Gladiators in the Industry Arena", description: "Compares PE, EPS, and Book Value within the industry context.", component: <IndustryBubble symbol={symbol} />, key: "IndustryBubble", image: Industry_Bubble },
//   ];

//   const handleGraphSelect = (graph) => {
//     if (!isLoggedIn && !graphSections.slice(0, MAX_VISIBLE_GRAPHS).some((g) => g.key === graph.key)) {
//       setShowLoginModal(true);
//       return;
//     }
//     setSelectedGraphs((prev) => {
//       if (symbols && symbols.length > 1 && !overlay) return [{ key: graph.key, title: graph.title }];
//       if (prev.some((g) => g.key === graph.key)) return prev.filter((g) => g.key !== graph.key);
//       if (prev.length < 2) return [...prev, { key: graph.key, title: graph.title }];
//       return [prev[1], { key: graph.key, title: graph.title }];
//     });
//   };

//   const handleClearSelection = () => setSelectedGraphs([]);

//   const renderGraphTabContent = () => {
//     if (selectedGraphs.length > 0) {
//       return (
//         <div className={`${isFullWidth ? 'w-full' : 'w-auto'} transition-all duration-300 p-4`}>
//           <div className="flex justify-center mb-4">
//             <button
//               onClick={handleClearSelection}
//               className="flex items-center gap-2 bg-gradient-to-r from-sky-700 to-sky-800 text-white px-6 py-3 rounded-full hover:from-cyan-600 hover:to-cyan-700 transition-all hover:shadow-xl"
//             >
//               Back to Graph Selection
//             </button>
//           </div>
//           <div className={`grid ${selectedGraphs.length === 2 && !overlay ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
//             {selectedGraphs.map(({ title, key }) => {
//               const graph = graphSections.find((g) => g.key === key);
//               return graph ? (
//                 <div key={key} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm shadow-gray-300 p-4 flex flex-col items-center w-full h-full">
//                   <h2 className="text-xl font-semibold text-black mb-3 text-center">{title}</h2>
//                   <div className="w-full h-[600px] overflow-auto">{graph.component}</div>
//                 </div>
//               ) : null;
//             })}
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className={`${isFullWidth ? 'w-full' : 'w-auto'} transition-all duration-300 p-4`}>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {graphSections.map(({ title, description, key, image }, index) => {
//             const isVisible = isLoggedIn || index < MAX_VISIBLE_GRAPHS;
//             return (
//               <div
//                 key={key}
//                 className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg shadow-black p-4 flex flex-col items-center w-full h-full min-h-[300px] cursor-pointer"
//                 onClick={() => (isVisible ? handleGraphSelect({ title, key }) : handleLoginClick())}
//                 role="button"
//                 tabIndex={0}
//               >
//                 <div className="relative w-full h-full flex flex-col items-center">
//                   <div className="absolute inset-0 flex flex-col items-center" style={{ filter: !isVisible ? 'blur(5px)' : 'none' }}>
//                     <img src={image} alt={title} className="w-full h-32 object-cover rounded mb-2" />
//                     <h2 className="text-xl font-semibold text-black mb-2 text-center sm:text-sm">{title}</h2>
//                     <p className="text-sm text-gray-600 dark:text-gray-300 text-center">{description}</p>
//                   </div>
//                   {!isVisible && (
//                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 rounded-lg z-10">
//                       {/* <CgLogIn className="w-12 h-12 text-white mb-2" /> */}
//                          <FaUserLock className='text-2xl text-black'/>
//                       <span className="text-black text-sm font-semibold text-center">Please Login to Unlock</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   const renderTechnicalTabContent = () => (
//     <div className="w-full">
//       <h2 className="text-2xl text-center text-black font-bold mb-3">Candlestick Analysis</h2>
//       <TechnicalPlot symbol={symbol} cachedData={plotData[symbol]?.[timeRange]?.[normalize ? 'normalized' : 'raw']} />
//     </div>
//   );

//   const renderCandlePatternTabContent = () => (
//     <div className="w-full">
//       <h2 className="text-2xl text-center text-black font-bold mb-3"></h2>
//       <CandlePattern symbol={symbol} />
//     </div>
//   );

//     const renderFinanceTabContent = () => (
//     <div className="w-full">
//       {/* <h2 className="text-2xl text-center text-black font-bold mb-3">Financial Analysis</h2> */}
//       {/* Add your financial tab content here */}

//           <FinancialTab symbol={symbol} />
//     </div>
//   );

//       const renderShareHoldingTabContent = () => (
//     <div className="w-full">
//       {/* <h2 className="text-2xl text-center text-black font-bold mb-3">Candlestick Analysis</h2> */}
//       <Shareholding symbol={symbol} />
//     </div>
//   );

//   return (
//    <div className="text-center">
//  <div className="tabs mx-auto max-w-6xl flex justify-center m-8">
//   <div className="flex gap-2 flex-wrap justify-center">
//     {[
//       { id: 'graphs', label: 'Data Analysis' },
//       { id: 'technical', label: 'Candle Stick' },
//       { id: 'candle_pattern', label: 'Candle Pattern' },
//       { id: 'finance', label: 'Financials' },
//       { id: 'Shareholding', label: 'Shareholding' },
//     ].map((tab) => (
//       <button
//         key={tab.id}
//         role="tab"
//         aria-selected={activeTab === tab.id}
//         aria-controls={`${tab.id}-tabpanel`}
//         id={`${tab.id}-tab`}
//         onClick={() => setActiveTab(tab.id)}
//         className={`px-5 py-2 rounded text-xl font-medium transition-all duration-300 shadow-sm
//           ${
//             activeTab === tab.id
//               ? 'bg-gradient-to-r from-sky-700 to-cyan-700 text-white shadow-lg scale-105 '
//               : 'bg-gray-100  text-gray-800 hover:bg-gray-200 hover:shadow-md dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600'
//           }`}
//       >
//         {tab.label}
//       </button>
//     ))}
//   </div>
// </div>

//   <div
//     id={`${activeTab}-tabpanel`}
//     aria-labelledby={`${activeTab}-tab`}
//     role="tabpanel"
//     className="p-6 mt-2 rounded-lg bg-white shadow-sm dark:bg-slate-800 dark:text-white"
//   >
//     {activeTab === 'graphs' && renderGraphTabContent()}
//     {activeTab === 'technical' && renderTechnicalTabContent()}
//     {activeTab === 'candle_pattern' && renderCandlePatternTabContent()}
//     {activeTab === 'finance' && renderFinanceTabContent()}
//     {activeTab === 'Shareholding' && renderShareHoldingTabContent()}
//   </div>

//   <Login isOpen={showLoginModal} onClose={handleCloseModal} onSuccess={handleLoginSuccess} showButtons={false} />
// </div>
//   );
// };

// export default GraphSlider;
// -----------------wc-------------------------

// import React, { useEffect, useState, useRef } from 'react';
// import Slider from 'react-slick';
// // import { useAuth } from './AuthContext';
// import CandleBreach from './CandleBreach';
// import LastTraded from './LastTraded';
// import AvgBoxPlots from './AvgBoxPlots';
// import WormsPlots from './WormsPlots';
// import SensexStockCorrBar from './SensexVsStockCorrBar';
// import SensexVsStockCorr from './SensexVsStockCorr';
// import HeatMap from './HeatMap';
// import DelRate from './DelRate';
// import VoltyPlot from './VoltyPlot';
// import IndustryBubble from './IndustryBubble';
// // import TechnicalPlot from './TechnicalPlot';
// import toast from 'react-hot-toast';
// import SensexCalculator from './SensexCalculator';
// import MacdPlot from './MacdPlot';
// import CandleSpread from './CandleSpreadDistribution';
// import Login from '../Login';
// import PublicTradingActivityPlot from './PublicTradingActivityPlot';

// import { FaArrowLeft, FaArrowRight, FaChartLine, FaUserLock, FaUserTie } from 'react-icons/fa';
// import candle_spread from '/public/assets/gaph1.png';
// import Industry_Bubble from '/public/assets/graph13.png';
// import Sensex_Calculator from '/public/assets/graph7.png';
// import Volty_Plot from '/public/assets/graph12.png';
// import Candle_Breach from '/public/assets/graph9.png';
// import Del_Rate from '/public/assets/graph3.png';
// import Heat_Map from '/public/assets/graph8.png';
// import Sensex_VsStockCorr from '/public/assets/graph5.png';
// import Sensex_StockCorrBar from '/public/assets/graph6.png';
// import Macd_Plot from '/public/assets/graph11.png';
// import Worms_Plots from '/public/assets/graph4.png';
// import AvgBox_Plots from '/public/assets/graph10.png';
// import Last_Traded from '/public/assets/graph2.png';
// // import { CgLogIn } from 'react-icons/cg';
// import { useAuth } from '../AuthContext';
// import CandlePattern from './CandlePattern';
// import Shareholding from './Shareholding';
// // import FinancialTabs from './FinancialTabs';
// import FinancialTab from './FinancialTab';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { MdAnalytics, MdAttachMoney, MdSwapHoriz } from 'react-icons/md';

// const GraphSlider = ({ symbol, symbols, isFullWidth, timeRange = '1Y', normalize = false, overlay = false, tabContext = 'equityHub', getAuthToken }) => {
//   const { isLoggedIn } = useAuth();
//   const [activeTab, setActiveTab] = useState(() => {
//     const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//     const saved = localStorage.getItem(storageKey);
//     return saved ? JSON.parse(saved).activeTab || 'graphs' : 'graphs';
//   });
//   const [selectedGraphs, setSelectedGraphs] = useState(() => {
//     const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//     const saved = localStorage.getItem(storageKey);
//     return saved ? JSON.parse(saved).selectedGraphs || [] : [];
//   });
//   const [plotData, setPlotData] = useState(() => {
//     const saved = localStorage.getItem('plotData');
//     return saved ? JSON.parse(saved) : {};
//   });
//   const [graphsLoaded, setGraphsLoaded] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const sliderRef = useRef(null);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
//   const MAX_VISIBLE_GRAPHS = 5;

//   const handleLoginClick = () => setShowLoginModal(true);
//   const handleCloseModal = () => setShowLoginModal(false);
//   const handleLoginSuccess = () => handleCloseModal();

//   const getCachedData = (key) => {
//     const cached = localStorage.getItem(key);
//     if (!cached) return null;
//     try {
//       const { data, timestamp } = JSON.parse(cached);
//       if (Date.now() - timestamp > CACHE_TTL) {
//         localStorage.removeItem(key);
//         return null;
//       }
//       return data;
//     } catch (err) {
//       console.error(`Failed to parse cached data for ${key}:`, err);
//       localStorage.removeItem(key);
//       return null;
//     }
//   };

//   const setCachedData = (key, data) => {
//     try {
//       const serializedData = JSON.stringify({ data, timestamp: Date.now() });
//       if (serializedData.length > 1024 * 1024) {
//         console.warn(`Data for ${key} exceeds 1MB, skipping cache.`);
//         return;
//       }
//       localStorage.setItem(key, serializedData);
//     } catch (err) {
//       if (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
//         console.error(`Quota exceeded for key ${key}. Clearing oldest items and retrying.`);
//         const now = Date.now();
//         for (let i = 0; i < localStorage.length; i++) {
//           const key = localStorage.key(i);
//           const cached = localStorage.getItem(key);
//           try {
//             const { timestamp } = JSON.parse(cached);
//             if (now - timestamp > 24 * 60 * 60 * 1000) {
//               localStorage.removeItem(key);
//               i--;
//             }
//           } catch (e) {
//             localStorage.removeItem(key);
//             i--;
//           }
//         }
//         try {
//           localStorage.setItem(key, serializedData);
//         } catch (retryErr) {
//           console.error(`Retry failed for ${key}. Switching to no-cache mode.`, retryErr);
//           setError("Storage quota exceeded. Data will be fetched live.");
//         }
//       } else {
//         console.error(`Failed to cache data for ${key}:`, err);
//         setError("Failed to cache data due to an unexpected error.");
//       }
//     }
//   };

//   useEffect(() => {
//     const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//     const serializableSelectedGraphs = selectedGraphs.map(({ key, title }) => ({ key, title }));
//     localStorage.setItem(storageKey, JSON.stringify({ activeTab, selectedGraphs: serializableSelectedGraphs }));
//   }, [activeTab, selectedGraphs, symbol, tabContext]);

//   useEffect(() => {
//     const fetchPlotData = async () => {
//       if (!symbol) {
//         setGraphsLoaded(true);
//         return;
//       }
//       const cacheKey = `plot_${symbol}_${timeRange}_${normalize}`;
//       const cachedData = getCachedData(cacheKey);
//       if (cachedData) {
//         setPlotData((prev) => ({ ...prev, [symbol]: cachedData }));
//         setGraphsLoaded(true);
//         return;
//       }

//       try {
//         // const response = await fetch(`${API_BASE}/stocks/process`, {
//         const response = await fetch(`${API_BASE}/stocks/test/candle_chronicle`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             ...(getAuthToken && { Authorization: `Bearer ${getAuthToken()}` }),
//           },
//           body: JSON.stringify({ symbol, timeRange, normalize }),
//         });

//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         const data = await response.json();
//         setPlotData((prev) => {
//           const updated = { ...prev, [symbol]: { ...prev[symbol], [timeRange]: { [normalize ? 'normalized' : 'raw']: data } } };
//           setCachedData(cacheKey, data);
//           return updated;
//         });
//         setGraphsLoaded(true);
//       } catch (error) {
//         // console.error('Error fetching plot data:', error);
//         // toast.error(error.message || 'Error fetching plot data');
//       }
//     };

//     fetchPlotData();
//   }, [symbol, timeRange, normalize, API_BASE, getAuthToken]);

//   const graphSections = [
//     { title: "Candle Chronicles: Spread Patterns Over Time (TTM)", description: "Visualizes the distribution of candlestick spread patterns over the past year.", component: <CandleSpread symbol={symbol} />, key: "CandleSpread", image: candle_spread },
//     { title: "Boxing Prices: TTM Box Plot for Trade Prices", description: "Shows a box plot of trade prices over the last year with key levels.", component: <LastTraded symbol={symbol} />, key: "LastTraded", image: Last_Traded },
//     { title: "Price Trends in a Box: Monthly Ranges and Averages Explored (TTM)", description: "Displays monthly price ranges and averages over the past year.", component: <AvgBoxPlots symbol={symbol} />, key: "AvgBoxPlots", image: AvgBox_Plots },
//     { title: "Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends", description: "Analyzes weekly trade delivery patterns during market trends.", component: <WormsPlots symbol={symbol} />, key: "WormsPlots", image: Worms_Plots },
//     { title: "MACD Analysis for TTM", description: "Plots the MACD indicator to identify momentum over the last year.", component: <MacdPlot symbol={symbol} />, key: "MacdPlot", image: Macd_Plot },
//     { title: "Sensex & Stock Fluctuations", description: "Compares monthly percentage changes between Sensex and the stock.", component: <SensexStockCorrBar symbol={symbol} />, key: "SensexStockCorrBar", image: Sensex_StockCorrBar },
//     { title: "Sensex Symphony: Harmonizing Stock Correlation Trends (TTM)", description: "Visualizes correlation trends between Sensex and the stock.", component: <SensexVsStockCorr symbol={symbol} />, key: "SensexVsStockCorr", image: Sensex_VsStockCorr },
//     { title: `Performance Heatmap: Nifty50 vs BSE vs ${symbol}`, description: "A heatmap comparing performance across Nifty50, BSE, and the stock.", component: <HeatMap symbol={symbol} />, key: "HeatMap", image: Heat_Map },
//     { title: "Market Mood: Delivery Trends & Trading Sentiment", description: "Analyzes delivery trends and trading sentiment over time.", component: <DelRate symbol={symbol} />, key: "DelRate", image: Del_Rate },
//     { title: "Breach Busters: Analyzing High and Low Breaches", description: "Examines instances of high and low price breaches.", component: <CandleBreach symbol={symbol} />, key: "CandleBreach", image: Candle_Breach },
//     { title: "Sensex Calculator", description: "A tool to calculate Sensex-related metrics for analysis.", component: <SensexCalculator symbol={symbol} />, key: "SensexCalculator", image: Sensex_Calculator },
//     { title: "PE vs EPS vs Book Value: Gladiators in the Industry Arena", description: "Compares PE, EPS, and Book Value within the industry context.", component: <IndustryBubble symbol={symbol} />, key: "IndustryBubble", image: Industry_Bubble },
//   ];

//   const handleGraphSelect = (graph, index) => {
//     if (!isLoggedIn && !graphSections.slice(0, MAX_VISIBLE_GRAPHS).some((g) => g.key === graph.key)) {
//       setShowLoginModal(true);
//       return;
//     }
//     setSelectedGraphs((prev,) => {
//       if (symbols && symbols.length > 1 && !overlay) return [{ key: graph.key, title: graph.title }];
//       if (prev.some((g) => g.key === graph.key)) return prev.filter((g) => g.key !== graph.key);
//       if (prev.length < 2) return [...prev, { key: graph.key, title: graph.title }];
//       return [prev[1], { key: graph.key, title: graph.title }];

//     });

//     const allGraphs = isLoggedIn ? graphSections : graphSections.slice(0, MAX_VISIBLE_GRAPHS);
//     setSelectedGraphs(allGraphs.map(({ key, title }) => ({ key, title })));
//     setCurrentSlide(index);
//   };

//   const handleClearSelection = () => setSelectedGraphs([]);
//   // Custom Previous Arrow
//   const PrevArrow = ({ onClick }) => (
//     <button
//       onClick={onClick}
//       className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-sky-700 to-sky-800 text-white p-3 rounded-full hover:from-cyan-600 hover:to-cyan-700 transition-all hover:shadow-xl z-10"
//       aria-label="Previous Graph"
//     >
//       <FaArrowLeft className="w-5 h-5" />
//     </button>
//   );
//   // Custom Next Arrow
//   const NextArrow = ({ onClick }) => (
//     <button
//       onClick={onClick}
//       className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-sky-700 to-sky-800 text-white p-3 rounded-full hover:from-cyan-600 hover:to-cyan-700 transition-all hover:shadow-xl z-10"
//       aria-label="Next Graph"
//     >
//       <FaArrowRight className="w-5 h-5" />
//     </button>
//   );

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: true,
//     prevArrow: <PrevArrow />,
//     nextArrow: <NextArrow />,
//     afterChange: (index) => setCurrentSlide(index),
//     initialSlide: currentSlide,
//   };

//   const renderGraphTabContent = () => {
//     if (selectedGraphs.length > 0) {
//       return (
//         <div className={`${isFullWidth ? 'w-full' : 'w-auto'} transition-all duration-300 p-4`}>
//           <div className="flex justify-center mb-4">
//             <button
//               onClick={handleClearSelection}
//               className="flex items-center gap-2 bg-gradient-to-r from-sky-700 to-sky-800 text-white px-6 py-3 rounded-full hover:from-cyan-600 hover:to-cyan-700 transition-all hover:shadow-xl"
//             >
//               Back to Graph Selection
//             </button>
//           </div>
//           <Slider {...sliderSettings} ref={sliderRef}>
//             {selectedGraphs.map(({ title, key }, index) => {
//               const graph = graphSections.find((g) => g.key === key);
//               return graph ? (
//                 <div key={key} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm shadow-gray-300 p-4 flex flex-col items-center w-full h-full">
//                   <h2 className="text-xl font-semibold text-black mb-3 text-center dark:text-white">{title}</h2>
//                   <div className="w-full h-[600px] overflow-auto dark:text-white">{graph.component}</div>
//                 </div>
//               ) : null;
//             })}
//           </Slider>
//         </div>
//       );
//     }

//     return (
//       <div className={`${isFullWidth ? 'w-full' : 'w-auto'} transition-all duration-300 p-4`}>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {graphSections.map(({ title, description, key, image }, index) => {
//             const isVisible = isLoggedIn || index < MAX_VISIBLE_GRAPHS;
//             return (
//               <div
//                 key={key}
//                 className="relative bg-white dark:bg-gray-800 rounded-lg border p-4 flex flex-col items-center w-full h-full min-h-[300px] cursor-pointer"
//                 onClick={() => (isVisible ? handleGraphSelect({ title, key }, index) : handleLoginClick())}
//                 role="button"
//                 tabIndex={0}
//               >
//                 <div className="relative w-full h-full flex flex-col items-center">
//                   <div className="absolute inset-0 flex flex-col items-center" style={{ filter: !isVisible ? 'blur(5px)' : 'none' }}>
//                     <img src={image} alt={title} className="w-full h-32 object-cover rounded mb-2" />
//                     <h2 className="text-xl font-semibold text-black mb-2 text-center sm:text-sm dark:text-white">{title}</h2>
//                     <p className="text-sm text-gray-600 dark:text-gray-300 text-center dark:text-white">{description}</p>
//                   </div>
//                   {!isVisible && (
//                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 rounded-lg z-10">
//                       {/* <CgLogIn className="w-12 h-12 text-white mb-2" /> */}
//                       <FaUserLock className='text-2xl text-black' />
//                       <span className="text-white text-sm font-semibold text-center dark:text-white">Please Login to Unlock</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   // const renderTechnicalTabContent = () => (
//   //   <div className="w-full">
//   //     <h2 className="text-2xl text-center text-black font-bold mb-3">Candlestick Analysis</h2>
//   //     <TechnicalPlot symbol={symbol} cachedData={plotData[symbol]?.[timeRange]?.[normalize ? 'normalized' : 'raw']} />
//   //   </div>
//   // );

//   const renderCandlePatternTabContent = () => (
//     <div className="w-full">
//       <h2 className="text-2xl text-center text-black font-bold mb-3"></h2>
//       <CandlePattern symbol={symbol} />
//     </div>
//   );

//   const renderFinanceTabContent = () => (
//     <div className="w-full">
//       {/* <h2 className="text-2xl text-center text-black font-bold mb-3">Financial Analysis</h2> */}
//       {/* Add your financial tab content here */}
//       <FinancialTab symbol={symbol} />

//     </div>
//   );

//   const renderShareHoldingTabContent = () => (
//     <div className="w-full">
//       {/* <h2 className="text-2xl text-center text-black font-bold mb-3">Candlestick Analysis</h2> */}
//       <Shareholding symbol={symbol} />
//     </div>
//   );

//   const PublicTradingActivityTabContent = () => (
//     <div className="w-full">
//       {/* <h2 className="text-2xl text-center text-black font-bold mb-3">Candlestick Analysis</h2> */}
//       <PublicTradingActivityPlot symbol={symbol} />
//     </div>
//   );

//   return (
//     <div className="text-center font-sans">
//       <div className="tabs mx-auto max-w-6xl flex justify-center my-12">
//         <div className="flex gap-2 flex-wrap justify-center dark:from-slate-900/90 dark:to-slate-800/80 p-2 backdrop-blur-md  dark:border-slate-700/50 shadow-xl">
//           {[
//             { id: 'graphs', label: 'Data Analysis', icon: <MdAnalytics /> },
//             // { id: 'technical', label: 'Candle Stick' },
//             { id: 'candle_pattern', label: 'Candle Pattern', icon: <FaChartLine /> },
//             { id: 'finance', label: 'Financials', icon: <MdAttachMoney /> },
//             { id: 'Shareholding', label: 'Shareholding', icon: <FaUserTie /> },
//             { id: 'PublicTradingActivityPlot', label: 'Public Trading Activity', icon: <MdSwapHoriz /> }
//           ].map((tab) => (
//             <button
//               key={tab.id}
//               role="tab"
//               aria-selected={activeTab === tab.id}
//               aria-controls={`${tab.id}-tabpanel`}
//               id={`${tab.id}-tab`}
//               onClick={() => setActiveTab(tab.id)}
//               className={`relative px-8 py-3 rounded-md text-base font-semibold transition-all duration-300 ease-in-out transform hover:-translate-y-0.5
//                 ${activeTab === tab.id
//                   ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg shadow-sky-500/30'
//                   : 'text-gray-700 hover:text-sky-600 dark:text-gray-300 dark:hover:text-blue-400 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80'
//                 } flex items-center gap-2`}
//             >
//               <span>{tab.icon}</span>
//               <span>{tab.label}</span>
//               {activeTab === tab.id && (
//                 <span className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 w-6 h-1.5 bg-sky-400 rounded-sm animate-pulse"></span>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div
//         id={`${activeTab}-tabpanel`}
//         aria-labelledby={`${activeTab}-tab`}
//         role="tabpanel"
//         className="p-10 mt-6  bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-gray-200/50 dark:border-slate-700/50  transition-all duration-500 ease-in-out transform"
//       >

//         <div className="animate-fade-in">
//           {activeTab === 'graphs' && renderGraphTabContent()}

//           {activeTab === 'candle_pattern' && renderCandlePatternTabContent()}
//           {activeTab === 'finance' && renderFinanceTabContent()}
//           {activeTab === 'Shareholding' && renderShareHoldingTabContent()}
//           {activeTab === 'PublicTradingActivityPlot' && PublicTradingActivityTabContent()}
//         </div>
//       </div>

//       <Login isOpen={showLoginModal} onClose={handleCloseModal} onSuccess={handleLoginSuccess} showButtons={false} />
//     </div>
//   );
// };

// export default GraphSlider;

// import React, { useEffect, useState, useRef } from 'react';
// import Slider from 'react-slick';
// import CandleBreach from './CandleBreach';
// import LastTraded from './LastTraded';
// import AvgBoxPlots from './AvgBoxPlots';
// import WormsPlots from './WormsPlots';
// import SensexStockCorrBar from './SensexVsStockCorrBar';
// import SensexVsStockCorr from './SensexVsStockCorr';
// import HeatMap from './HeatMap';
// import DelRate from './DelRate';
// import VoltyPlot from './VoltyPlot';
// import IndustryBubble from './IndustryBubble';
// import SensexCalculator from './SensexCalculator';
// import MacdPlot from './MacdPlot';
// import CandleSpread from './CandleSpreadDistribution';
// import PublicTradingActivityPlot from './PublicTradingActivityPlot';
// import CandlePattern from './CandlePattern';
// import Shareholding from './Shareholding';
// import FinancialTab from './FinancialTab';
// import toast from 'react-hot-toast';
// import {
//   FaArrowLeft,
//   FaArrowRight,
//   FaChartLine,
//   FaUserLock,
//   FaUserTie,
//   FaChevronRight,
//   FaPlay,
//   FaTimes,
//   FaExpand
// } from 'react-icons/fa';
// import {
//   MdAnalytics,
//   MdAttachMoney,
//   MdSwapHoriz,
//   MdGridView,
//   MdBarChart,
//   MdShowChart,
//   MdPieChart,
//   MdTableChart
// } from 'react-icons/md';
// import {
//   FiBarChart2,
//   FiTrendingUp,
//   FiPieChart,
//   FiMap
// } from 'react-icons/fi';
// import { useAuth } from '../AuthContext';
// import { useLocation, useNavigate } from 'react-router-dom';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// // Import graph thumbnails
// import candle_spread from '/public/assets/gaph1.png';
// import Industry_Bubble from '/public/assets/graph13.png';
// import Sensex_Calculator from '/public/assets/graph7.png';
// import Volty_Plot from '/public/assets/graph12.png';
// import Candle_Breach from '/public/assets/graph9.png';
// import Del_Rate from '/public/assets/graph3.png';
// import Heat_Map from '/public/assets/graph8.png';
// import Sensex_VsStockCorr from '/public/assets/graph5.png';
// import Sensex_StockCorrBar from '/public/assets/graph6.png';
// import Macd_Plot from '/public/assets/graph11.png';
// import Worms_Plots from '/public/assets/graph4.png';
// import AvgBox_Plots from '/public/assets/graph10.png';
// import Last_Traded from '/public/assets/graph2.png';

// const GraphSlider = ({ symbol, symbols, isFullWidth, timeRange = '1Y', normalize = false, overlay = false, tabContext = 'equityHub', getAuthToken }) => {
//   const { isLoggedIn } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState(() => {
//     const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//     const saved = localStorage.getItem(storageKey);
//     return saved ? JSON.parse(saved).activeTab || 'graphs' : 'graphs';
//   });
//   const [selectedGraph, setSelectedGraph] = useState(() => {
//     const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//     const saved = localStorage.getItem(storageKey);
//     return saved ? JSON.parse(saved).selectedGraph || null : null;
//   });
//   const [plotData, setPlotData] = useState(() => {
//     const saved = localStorage.getItem('plotData');
//     return saved ? JSON.parse(saved) : {};
//   });
//   const [graphsLoaded, setGraphsLoaded] = useState(false);
//   const [error, setError] = useState(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const sliderRef = useRef(null);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const CACHE_TTL = 60 * 60 * 1000;
//   const MAX_VISIBLE_GRAPHS = 5;

//   // Restore selected graph from location.state.graphKey after login
//   useEffect(() => {
//     if (location.state?.graphKey && isLoggedIn) {
//       const graph = graphSections.find((g) => g.key === location.state.graphKey);
//       if (graph && selectedGraph?.key !== graph.key) {
//         setSelectedGraph({ key: graph.key, title: graph.title });
//         navigate(location.pathname, { replace: true, state: { from: location.state.from } });
//       }
//     }
//   }, [location.state, isLoggedIn, symbol, symbols, overlay, navigate]);

//   useEffect(() => {
//     const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//     const serializableSelectedGraph = selectedGraph ? { key: selectedGraph.key, title: selectedGraph.title } : null;
//     localStorage.setItem(storageKey, JSON.stringify({ activeTab, selectedGraph: serializableSelectedGraph }));
//   }, [activeTab, selectedGraph, symbol, tabContext]);

//   const getCachedData = (key) => {
//     const cached = localStorage.getItem(key);
//     if (!cached) return null;
//     try {
//       const { data, timestamp } = JSON.parse(cached);
//       if (Date.now() - timestamp > CACHE_TTL) {
//         localStorage.removeItem(key);
//         return null;
//       }
//       return data;
//     } catch (err) {
//       console.error(`Failed to parse cached data for ${key}:`, err);
//       localStorage.removeItem(key);
//       return null;
//     }
//   };

//   const setCachedData = (key, data) => {
//     try {
//       const serializedData = JSON.stringify({ data, timestamp: Date.now() });
//       if (serializedData.length > 1024 * 1024) {
//         console.warn(`Data for ${key} exceeds 1MB, skipping cache.`);
//         return;
//       }
//       localStorage.setItem(key, serializedData);
//     } catch (err) {
//       console.error(`Failed to cache data for ${key}:`, err);
//     }
//   };

//   useEffect(() => {
//     const fetchPlotData = async () => {
//       if (!symbol) {
//         setGraphsLoaded(true);
//         return;
//       }
//       const cacheKey = `plot_${symbol}_${timeRange}_${normalize}`;
//       const cachedData = getCachedData(cacheKey);
//       if (cachedData) {
//         setPlotData((prev) => ({ ...prev, [symbol]: cachedData }));
//         setGraphsLoaded(true);
//         return;
//       }

//       try {
//         const response = await fetch(`${API_BASE}/stocks/test/candle_chronicle`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             ...(getAuthToken && { Authorization: `Bearer ${getAuthToken()}` }),
//           },
//           body: JSON.stringify({ symbol, timeRange, normalize }),
//         });

//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         const data = await response.json();
//         setPlotData((prev) => {
//           const updated = { ...prev, [symbol]: { ...prev[symbol], [timeRange]: { [normalize ? 'normalized' : 'raw']: data } } };
//           setCachedData(cacheKey, data);
//           return updated;
//         });
//         setGraphsLoaded(true);
//       } catch (error) {
//         // toast.error(error.message || 'Error fetching plot data');
//       }
//     };

//     fetchPlotData();
//   }, [symbol, timeRange, normalize, API_BASE, getAuthToken]);

//   // Enhanced graph sections with icons and categories
//   const graphSections = [
//     {
//       title: "Candle Chronicles: Spread Patterns Over Time (TTM)",
//       description: "Visualizes the distribution of candlestick spread patterns over the past year.",
//       component: <CandleSpread symbol={symbol} />,
//       key: "CandleSpread",
//       image: candle_spread,
//       icon: <MdShowChart className="text-blue-500" />,
//       category: "Technical Analysis",
//       color: "blue"
//     },
//     {
//       title: "Boxing Prices: TTM Box Plot for Trade Prices",
//       description: "Shows a box plot of trade prices over the last year with key levels.",
//       component: <LastTraded symbol={symbol} />,
//       key: "LastTraded",
//       image: Last_Traded,
//       icon: <MdBarChart className="text-green-500" />,
//       category: "Price Analysis",
//       color: "green"
//     },
//     {
//       title: "Price Trends in a Box: Monthly Ranges and Averages Explored (TTM)",
//       description: "Displays monthly price ranges and averages over the past year.",
//       component: <AvgBoxPlots symbol={symbol} />,
//       key: "AvgBoxPlots",
//       image: AvgBox_Plots,
//       icon: <FiTrendingUp className="text-purple-500" />,
//       category: "Trend Analysis",
//       color: "purple"
//     },
//     {
//       title: "Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends",
//       description: "Analyzes weekly trade delivery patterns during market trends.",
//       component: <WormsPlots symbol={symbol} />,
//       key: "WormsPlots",
//       image: Worms_Plots,
//       icon: <FiMap className="text-orange-500" />,
//       category: "Volume Analysis",
//       color: "orange"
//     },
//     {
//       title: "MACD Analysis for TTM",
//       description: "Plots the MACD indicator to identify momentum over the last year.",
//       component: <MacdPlot symbol={symbol} />,
//       key: "MacdPlot",
//       image: Macd_Plot,
//       icon: <MdGridView className="text-red-500" />,
//       category: "Momentum",
//       color: "red"
//     },
//     {
//       title: "Sensex & Stock Fluctuations",
//       description: "Compares monthly percentage changes between Sensex and the stock.",
//       component: <SensexStockCorrBar symbol={symbol} />,
//       key: "SensexStockCorrBar",
//       image: Sensex_StockCorrBar,
//       icon: <FiBarChart2 className="text-cyan-500" />,
//       category: "Market Correlation",
//       color: "cyan"
//     },
//     {
//       title: "Sensex Symphony: Harmonizing Stock Correlation Trends (TTM)",
//       description: "Visualizes correlation trends between Sensex and the stock.",
//       component: <SensexVsStockCorr symbol={symbol} />,
//       key: "SensexVsStockCorr",
//       image: Sensex_VsStockCorr,
//       icon: <MdPieChart className="text-indigo-500" />,
//       category: "Correlation Analysis",
//       color: "indigo"
//     },
//     {
//       title: `Performance Heatmap: Nifty50 vs BSE vs ${symbol}`,
//       description: "A heatmap comparing performance across Nifty50, BSE, and the stock.",
//       component: <HeatMap symbol={symbol} />,
//       key: "HeatMap",
//       image: Heat_Map,
//       icon: <FiPieChart className="text-pink-500" />,
//       category: "Market Comparison",
//       color: "pink"
//     },
//     {
//       title: "Market Mood: Delivery Trends & Trading Sentiment",
//       description: "Analyzes delivery trends and trading sentiment over time.",
//       component: <DelRate symbol={symbol} />,
//       key: "DelRate",
//       image: Del_Rate,
//       icon: <MdTableChart className="text-teal-500" />,
//       category: "Sentiment Analysis",
//       color: "teal"
//     },
//     {
//       title: "Breach Busters: Analyzing High and Low Breaches",
//       description: "Examines instances of high and low price breaches.",
//       component: <CandleBreach symbol={symbol} />,
//       key: "CandleBreach",
//       image: Candle_Breach,
//       icon: <FaChartLine className="text-amber-500" />,
//       category: "Price Action",
//       color: "amber"
//     },
//     {
//       title: "Sensex Calculator",
//       description: "A tool to calculate Sensex-related metrics for analysis.",
//       component: <SensexCalculator symbol={symbol} />,
//       key: "SensexCalculator",
//       image: Sensex_Calculator,
//       icon: <MdAnalytics className="text-lime-500" />,
//       category: "Tools",
//       color: "lime"
//     },
//     {
//       title: "PE vs EPS vs Book Value: Gladiators in the Industry Arena",
//       description: "Compares PE, EPS, and Book Value within the industry context.",
//       component: <IndustryBubble symbol={symbol} />,
//       key: "IndustryBubble",
//       image: Industry_Bubble,
//       icon: <MdSwapHoriz className="text-emerald-500" />,
//       category: "Fundamental Analysis",
//       color: "emerald"
//     },
//   ];

//   const handleGraphSelect = (graph, index) => {
//     if (!isLoggedIn && !graphSections.slice(0, MAX_VISIBLE_GRAPHS).some((g) => g.key === graph.key)) {
//       navigate('/login', { state: { from: location.pathname, graphKey: graph.key } });
//       return;
//     }
//     if (selectedGraph && selectedGraph.key === graph.key) {
//       setSelectedGraph(null);
//     } else {
//       setSelectedGraph({ key: graph.key, title: graph.title });
//     }
//   };

//   const handleClearSelection = () => setSelectedGraph(null);

//   const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

//   // Enhanced Custom Arrows
//   const PrevArrow = ({ onClick }) => (
//     <button
//       onClick={onClick}
//       className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-white p-3 rounded-full hover:bg-white dark:hover:bg-slate-700 shadow-2xl border border-slate-200 dark:border-slate-600 transition-all duration-300 hover:scale-110 z-20 backdrop-blur-sm"
//       aria-label="Previous Graph"
//     >
//       <FaArrowLeft className="w-4 h-4" />
//     </button>
//   );

//   const NextArrow = ({ onClick }) => (
//     <button
//       onClick={onClick}
//       className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-white p-3 rounded-full hover:bg-white dark:hover:bg-slate-700 shadow-2xl border border-slate-200 dark:border-slate-600 transition-all duration-300 hover:scale-110 z-20 backdrop-blur-sm"
//       aria-label="Next Graph"
//     >
//       <FaArrowRight className="w-4 h-4" />
//     </button>
//   );

//   const sliderSettings = {
//     dots: false,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: false,
//     appendDots: dots => (
//       <div className="bg-white/80 dark:bg-slate-800/80 rounded-full px-4 py-2 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
//         <ul className="flex space-x-2"> {dots} </ul>
//       </div>
//     ),
//     customPaging: i => (
//       <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full transition-all duration-300 hover:bg-slate-400 dark:hover:bg-slate-500" />
//     )
//   };

//   const getColorClasses = (color) => {
//     const colorMap = {
//       blue: 'from-blue-500 to-blue-600',
//       green: 'from-green-500 to-green-600',
//       purple: 'from-purple-500 to-purple-600',
//       orange: 'from-orange-500 to-orange-600',
//       red: 'from-red-500 to-red-600',
//       cyan: 'from-cyan-500 to-cyan-600',
//       indigo: 'from-indigo-500 to-indigo-600',
//       pink: 'from-pink-500 to-pink-600',
//       teal: 'from-teal-500 to-teal-600',
//       amber: 'from-amber-500 to-amber-600',
//       lime: 'from-lime-500 to-lime-600',
//       emerald: 'from-emerald-500 to-emerald-600'
//     };
//     return colorMap[color] || 'from-slate-500 to-slate-600';
//   };

//   const renderGraphTabContent = () => {
//     if (selectedGraph) {
//       const graph = graphSections.find((g) => g.key === selectedGraph.key);
//       if (!graph) return null;

//       return (
//         <div className={`${isFullWidth ? 'w-full' : 'w-auto'} transition-all duration-300 p-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-900 p-0' : ''}`}>
//           {/* Graph Viewer Header */}
//           <div className={`flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl ${isFullscreen ? 'rounded-none border-b border-slate-200 dark:border-slate-700' : ''}`}>
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={handleClearSelection}
//                 className="flex items-center gap-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-white px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200 border border-slate-200 dark:border-slate-600"
//               >
//                 <FaArrowLeft className="w-4 h-4" />
//                 Back to Gallery
//               </button>
//             </div>

//           </div>

//           {/* Graph Content */}
//           <div className={`${isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[600px]'} relative`}>
//             <Slider {...sliderSettings} ref={sliderRef}>
//               <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 h-full">
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedGraph.title}</h2>
//                   <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getColorClasses(graph.color)} text-white`}>
//                     {graph.category}
//                   </span>
//                 </div>
//                 <div className="w-full h-[calc(100%-80px)] overflow-hidden">
//                   {graph.component}
//                 </div>
//               </div>
//             </Slider>
//           </div>
//         </div>
//       );
//     }

//     // Graph Gallery View
//     return (
//       <div className="w-full transition-all duration-300">
//         {/* Filter Tabs */}
//         {/* <div className="flex flex-wrap gap-2 mb-8 justify-center">
//           <button className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium">
//             All Graphs
//           </button>
//           {[...new Set(graphSections.map(g => g.category))].map(category => (
//             <button key={category} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
//               {category}
//             </button>
//           ))}
//         </div> */}

//         {/* Graph Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {graphSections.map(({ title, description, key, image, icon, category, color }, index) => {
//             const isVisible = isLoggedIn || index < MAX_VISIBLE_GRAPHS;
//             return (
//               <div
//                 key={key}
//                 className={`group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${!isVisible ? 'blur-sm' : ''
//                   }`}
//                 onClick={() => (isVisible ? handleGraphSelect({ title, key }, index) : navigate('/login', { state: { from: location.pathname, graphKey: key } }))}
//                 role="button"
//                 tabIndex={0}
//               >
//                 {/* Graph Image */}
//                 <div className="relative h-48 overflow-hidden">
//                   <img
//                     src={image}
//                     alt={title}
//                     className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//                   {/* Overlay Content */}
//                   <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <div className="flex items-center justify-between">
//                       <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getColorClasses(color)}`}>
//                         {category}
//                       </span>
//                       <div className="flex items-center gap-2 bg-black/50 rounded-full px-3 py-1">
//                         <FaPlay className="w-3 h-3" />
//                         <span className="text-xs">View Graph</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Graph Info */}
//                 <div className="p-5">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className={`p-2 rounded-lg bg-gradient-to-r ${getColorClasses(color)} bg-opacity-10`}>
//                       {icon}
//                     </div>
//                     <h3 className="font-semibold text-slate-800 dark:text-white line-clamp-2 leading-tight">
//                       {title}
//                     </h3>
//                   </div>
//                   <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
//                     {description}
//                   </p>

//                   <div className="flex items-center justify-between">
//                     <span className="text-xs text-slate-500 dark:text-slate-400">
//                       Click to explore
//                     </span>
//                     <FaChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
//                   </div>
//                 </div>

//                 {/* Lock Overlay for Premium Graphs */}
//                 {!isVisible && (
//                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-2xl z-10">
//                     <div className="text-center p-6">
//                       <FaUserLock className="w-12 h-12 text-white mb-3 mx-auto" />
//                       <span className="text-white font-semibold text-lg block">Premium Feature</span>
//                       <span className="text-slate-300 text-sm block mt-1">Login to unlock all graphs</span>
//                       <button className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200">
//                         Login Now
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   const renderCandlePatternTabContent = () => (
//     <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
//       <CandlePattern symbol={symbol} />
//     </div>
//   );

//   const renderFinanceTabContent = () => (
//     <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
//       <FinancialTab symbol={symbol} />
//     </div>
//   );

//   const renderShareHoldingTabContent = () => (
//     <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
//       <Shareholding symbol={symbol} />
//     </div>
//   );

//   const PublicTradingActivityTabContent = () => (
//     <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
//       <PublicTradingActivityPlot symbol={symbol} />
//     </div>
//   );

//   // Enhanced Tab Configuration
//   const tabs = [
//     {
//       id: 'graphs',
//       label: 'Data Analysis',
//       icon: <MdAnalytics className="w-5 h-5" />,
//       description: 'Interactive charts and visualizations'
//     },
//     {
//       id: 'candle_pattern',
//       label: 'Candle Patterns',
//       icon: <FaChartLine className="w-5 h-5" />,
//       description: 'Candlestick pattern analysis'
//     },
//     {
//       id: 'finance',
//       label: 'Financials',
//       icon: <MdAttachMoney className="w-5 h-5" />,
//       description: 'Financial statements & metrics'
//     },
//     {
//       id: 'Shareholding',
//       label: 'Shareholding',
//       icon: <FaUserTie className="w-5 h-5" />,
//       description: 'Ownership structure analysis'
//     },
//     {
//       id: 'PublicTradingActivityPlot',
//       label: 'Trading Activity',
//       icon: <MdSwapHoriz className="w-5 h-5" />,
//       description: 'Public trading insights'
//     }
//   ];

//   return (
//     <div className="font-sans w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
//       <div className="container mx-auto px-4 py-8">
//         {/* Enhanced Tab Navigation */}
//         <div className="flex flex-col items-center mb-8">
//           <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 text-center">
//             Advanced Stock Analysis
//           </h2>
//           <p className="text-slate-600 dark:text-slate-300 text-center mb-8 max-w-2xl">
//             Comprehensive tools and visualizations for in-depth market analysis of {symbol}
//           </p>

//           <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-2 border border-slate-200/50 dark:border-slate-700/50 shadow-xl w-full max-w-4xl">
//             <div className="flex flex-wrap justify-center gap-1">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   role="tab"
//                   aria-selected={activeTab === tab.id}
//                   aria-controls={`${tab.id}-tabpanel`}
//                   id={`${tab.id}-tab`}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`relative flex flex-col items-center px-6 py-4 rounded-xl transition-all duration-300 ease-in-out min-w-[120px] group ${activeTab === tab.id
//                     ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white  shadow-blue-500/25'
//                     : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
//                     }`}
//                 >
//                   <div className={`mb-2 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
//                     }`}>
//                     {tab.icon}
//                   </div>
//                   <span className="font-semibold text-sm mb-1">{tab.label}</span>
//                   <span className="text-xs opacity-80">{tab.description}</span>

//                   {activeTab === tab.id && (
//                     <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white rounded-full animate-pulse"></div>
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div
//           id={`${activeTab}-tabpanel`}
//           aria-labelledby={`${activeTab}-tab`}
//           role="tabpanel"
//           className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl transition-all duration-500 ease-in-out overflow-hidden"
//         >
//           <div className="p-6 animate-fade-in">
//             {activeTab === 'graphs' && renderGraphTabContent()}
//             {activeTab === 'candle_pattern' && renderCandlePatternTabContent()}
//             {activeTab === 'finance' && renderFinanceTabContent()}
//             {activeTab === 'Shareholding' && renderShareHoldingTabContent()}
//             {activeTab === 'PublicTradingActivityPlot' && PublicTradingActivityTabContent()}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GraphSlider;

// ------------------------------------------

// import React, { useEffect, useState, useRef } from 'react';
// import Slider from 'react-slick';
// import CandleBreach from './CandleBreach';
// import LastTraded from './LastTraded';
// import AvgBoxPlots from './AvgBoxPlots';
// import WormsPlots from './WormsPlots';
// import SensexStockCorrBar from './SensexVsStockCorrBar';
// import SensexVsStockCorr from './SensexVsStockCorr';
// import HeatMap from './HeatMap';
// import DelRate from './DelRate';
// import VoltyPlot from './VoltyPlot';
// import IndustryBubble from './IndustryBubble';
// import SensexCalculator from './SensexCalculator';
// import MacdPlot from './MacdPlot';
// import CandleSpread from './CandleSpreadDistribution';
// import PublicTradingActivityPlot from './PublicTradingActivityPlot';
// import CandlePattern from './CandlePattern';
// import Shareholding from './Shareholding';
// import FinancialTab from './FinancialTab';
// import PegyWormPlot from './PegyWormPlot';
// import toast from 'react-hot-toast';
// import {
//     FaArrowLeft,
//     FaArrowRight,
//     FaChartLine,
//     FaUserLock,
//     FaUserTie,
//     FaChevronRight,
//     FaPlay,
//     FaTimes,
//     FaExpand,
//     FaEye
// } from 'react-icons/fa';
// import {
//     MdAnalytics,
//     MdAttachMoney,
//     MdSwapHoriz,
//     MdGridView,
//     MdBarChart,
//     MdShowChart,
//     MdPieChart,
//     MdTableChart
// } from 'react-icons/md';
// import {
//     FiBarChart2,
//     FiTrendingUp,
//     FiPieChart,
//     FiMap
// } from 'react-icons/fi';
// import { useAuth } from '../AuthContext';
// import { useLocation, useNavigate } from 'react-router-dom';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// // Import graph thumbnails
// import candle_spread from '/public/equityhub_plot/candle_spread1.png';
// import Industry_Bubble from '/public/equityhub_plot/industry_bubble1.png';
// import Sensex_Calculator from '/public/equityhub_plot/sensex_calculator1.png';
// import Volty_Plot from '/public/assets/graph12.png';
// import Candle_Breach from '/public/equityhub_plot/Screenshot 2025-09-24 110817.png';
// import Del_Rate from '/public/equityhub_plot/delivery_rate1.png';
// import Heat_Map from '/public/equityhub_plot/heatmap1.png';
// import Sensex_VsStockCorr from '/public/equityhub_plot/sensex_analylis1.png';
// import Sensex_StockCorrBar from '/public/equityhub_plot/sensex_and_stock1.png';
// import Macd_Plot from '/public/equityhub_plot/macd_plot1.png';
// import Worms_Plots from '/public/equityhub_plot/weekly_tade_delivery1.png';
// import AvgBox_Plots from '/public/equityhub_plot/avgbox_plot1.png';
// import Last_Traded from '/public/equityhub_plot/box_plot1.png';
// import PegyPlot from '/public/equityhub_plot/pegyplot.png';
// // import FinancialRatingSystem from '../RatingFile /FinancialRatingSystem';
// import { useCallback } from 'react';
// import RatingSystem from '../RatingFile/RatingSystem';

// // Rating Stars Component
// const RatingStars = ({ rating, size = "sm" }) => {
//     let effectiveRating = rating;
//     if (isNaN(effectiveRating) || effectiveRating === null || effectiveRating === undefined) {
//         effectiveRating = 0;
//     }
//     effectiveRating = Math.max(0, Math.min(5, effectiveRating));

//     const fullStars = Math.floor(effectiveRating);
//     const hasHalfStar = effectiveRating % 1 >= 0.5;
//     const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

//     const sizeClasses = {
//         sm: "w-3 h-3",
//         md: "w-4 h-4",
//         lg: "w-5 h-5"
//     };

//     return (
//         <div className="flex items-center gap-0.5">
//             {/* Full stars */}
//             {[...Array(fullStars)].map((_, i) => (
//                 <div key={`full-${i}`} className={`${sizeClasses[size]} text-yellow-400 fill-current`}>
//                     ★
//                 </div>
//             ))}

//             {/* Half star */}
//             {hasHalfStar && (
//                 <div className={`${sizeClasses[size]} text-yellow-400 fill-current`}>
//                     ★
//                 </div>
//             )}

//             {/* Empty stars */}
//             {[...Array(emptyStars)].map((_, i) => (
//                 <div key={`empty-${i}`} className={`${sizeClasses[size]} text-gray-300 fill-current`}>
//                     ★
//                 </div>
//             ))}

//             <span className={`ml-1 font-medium ${size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
//                 } text-slate-600 dark:text-slate-300`}>
//                 {effectiveRating.toFixed(1)}
//             </span>
//         </div>
//     );
// };

// // const GraphSlider = ({ symbol, symbols, isFullWidth, timeRange = '1Y', normalize = false, overlay = false, tabContext = 'equityHub', getAuthToken }) => {
// //     const { isLoggedIn } = useAuth();
// //     const location = useLocation();
// //     const navigate = useNavigate();
// //     const [activeTab, setActiveTab] = useState(() => {
// //         const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
// //         const saved = localStorage.getItem(storageKey);
// //         return saved ? JSON.parse(saved).activeTab || 'graphs' : 'graphs';
// //     });
// //     const [selectedGraph, setSelectedGraph] = useState(() => {
// //         const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
// //         const saved = localStorage.getItem(storageKey);
// //         return saved ? JSON.parse(saved).selectedGraph || null : null;
// //     });
// //     const [plotData, setPlotData] = useState(() => {
// //         const saved = localStorage.getItem('plotData');
// //         return saved ? JSON.parse(saved) : {};
// //     });
// //     const [ratings, setRatings] = useState({});
// //     const [graphsLoaded, setGraphsLoaded] = useState(false);
// //     const [error, setError] = useState(null);
// //     const [isFullscreen, setIsFullscreen] = useState(false);
// //     const sliderRef = useRef(null);
// //     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
// //     const CACHE_TTL = 60 * 60 * 1000;
// //     const MAX_VISIBLE_GRAPHS = 5;

// //     // Restore selected graph from location.state.graphKey after login
// //     useEffect(() => {
// //         if (location.state?.graphKey && isLoggedIn) {
// //             const graph = graphSections.find((g) => g.key === location.state.graphKey);
// //             if (graph && selectedGraph?.key !== graph.key) {
// //                 setSelectedGraph({ key: graph.key, title: graph.title });
// //                 navigate(location.pathname, { replace: true, state: { from: location.state.from } });
// //             }
// //         }
// //     }, [location.state, isLoggedIn, symbol, symbols, overlay, navigate]);

// //     useEffect(() => {
// //         const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
// //         const serializableSelectedGraph = selectedGraph ? { key: selectedGraph.key, title: selectedGraph.title } : null;
// //         localStorage.setItem(storageKey, JSON.stringify({ activeTab, selectedGraph: serializableSelectedGraph }));
// //     }, [activeTab, selectedGraph, symbol, tabContext]);

// //     const getCachedData = (key) => {
// //         const cached = localStorage.getItem(key);
// //         if (!cached) return null;
// //         try {
// //             const { data, timestamp } = JSON.parse(cached);
// //             if (Date.now() - timestamp > CACHE_TTL) {
// //                 localStorage.removeItem(key);
// //                 return null;
// //             }
// //             return data;
// //         } catch (err) {
// //             console.error(`Failed to parse cached data for ${key}:`, err);
// //             localStorage.removeItem(key);
// //             return null;
// //         }
// //     };

// //     const setCachedData = (key, data) => {
// //         try {
// //             const serializedData = JSON.stringify({ data, timestamp: Date.now() });
// //             if (serializedData.length > 1024 * 1024) {
// //                 console.warn(`Data for ${key} exceeds 1MB, skipping cache.`);
// //                 return;
// //             }
// //             localStorage.setItem(key, serializedData);
// //         } catch (err) {
// //             console.error(`Failed to cache data for ${key}:`, err);
// //         }
// //     };

// //     const plotTypeMapping = {
// //         CandleSpread: 'candle_spread',
// //         PegyWormPlot: 'pegy_worm_plot',
// //         MacdPlot: 'macd_plot',
// //         SensexCalculator: 'sensex_calculator',
// //         DelRate: 'del_rate',
// //         CandleBreach: 'breach_busters',
// //         LastTraded: 'last_traded',
// //         AvgBoxPlots: 'price_trend', // Confirmed working
// //         WormsPlots: 'worms_plots',
// //         SensexStockCorrBar: 'sensex_stock_corr_bar',
// //         SensexVsStockCorr: 'sensex_vs_stock_corr',
// //         HeatMap: 'heat_map',
// //         IndustryBubble: 'industry_bubble' // To be verified
// //     };
// //     // Fetch average ratings for all graphs
// //     const fetchAverageRating = async (plotType) => {
// //         try {
// //             const cacheKey = `rating_${plotType}`;
// //             const cachedData = getCachedData(cacheKey);
// //             if (cachedData) return cachedData;

// //             const apiPlotType = plotTypeMapping[plotType] || plotType;
// //             console.log(`Fetching ratings for ${plotType} → API: ${apiPlotType}`); // ADD THIS

// //             const response = await fetch(`${API_BASE}/stocks/test/ratings/${apiPlotType}/average`);
// //             console.log(`Response status for ${apiPlotType}: ${response.status}`); // ADD THIS

// //             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

// //             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

// //             const responseText = await response.text();

// //             let data;
// //             try {
// //                 data = JSON.parse(responseText);
// //             } catch (jsonError) {
// //                 const averageRating = parseFloat(responseText);
// //                 data = {
// //                     plotType,
// //                     averageRating: isNaN(averageRating) ? 0 : averageRating,
// //                     totalRatings: 1,
// //                     ratingBreakdown: {
// //                         "5": 0,
// //                         "4": 0,
// //                         "3": 0,
// //                         "2": 0,
// //                         "1": 0
// //                     }
// //                 };
// //             }

// //             setCachedData(cacheKey, data);
// //             return data;
// //         } catch (error) {
// //             console.error(`Error fetching average rating for ${plotType} (API: ${plotTypeMapping[plotType] || plotType}):`, error);

// //             const defaultRating = {
// //                 plotType,
// //                 averageRating: 0,
// //                 totalRatings: 0,
// //                 ratingBreakdown: {
// //                     "5": 0,
// //                     "4": 0,
// //                     "3": 0,
// //                     "2": 0,
// //                     "1": 0
// //                 }
// //             };

// //             return defaultRating;
// //         }
// //     };

// //     // Fetch all ratings when component mounts
// //     useEffect(() => {
// //         const fetchAllRatings = async () => {
// //             const ratingsData = {};
// //             for (const graph of graphSections) {
// //                 const rating = await fetchAverageRating(graph.key);
// //                 ratingsData[graph.key] = rating;
// //             }
// //             setRatings(ratingsData);
// //         };

// //         fetchAllRatings();
// //     }, []);

// //     useEffect(() => {
// //         const fetchPlotData = async () => {
// //             if (!symbol) {
// //                 setGraphsLoaded(true);
// //                 return;
// //             }
// //             const cacheKey = `plot_${symbol}_${timeRange}_${normalize}`;
// //             const cachedData = getCachedData(cacheKey);
// //             if (cachedData) {
// //                 setPlotData((prev) => ({ ...prev, [symbol]: cachedData }));
// //                 setGraphsLoaded(true);
// //                 return;
// //             }

// //             try {
// //                 const response = await fetch(`${API_BASE}/stocks/test/candle_chronicle`, {
// //                     method: 'POST',
// //                     headers: {
// //                         'Content-Type': 'application/json',
// //                         ...(getAuthToken && { Authorization: `Bearer ${getAuthToken()}` }),
// //                     },
// //                     body: JSON.stringify({ symbol, timeRange, normalize }),
// //                 });

// //                 if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
// //                 const data = await response.json();
// //                 setPlotData((prev) => {
// //                     const updated = { ...prev, [symbol]: { ...prev[symbol], [timeRange]: { [normalize ? 'normalized' : 'raw']: data } } };
// //                     setCachedData(cacheKey, data);
// //                     return updated;
// //                 });
// //                 setGraphsLoaded(true);
// //             } catch (error) {
// //                 // toast.error(error.message || 'Error fetching plot data');
// //             }
// //         };

// //         fetchPlotData();
// //     }, [symbol, timeRange, normalize, API_BASE, getAuthToken]);

// //     // Enhanced graph sections with icons and categories
// //     const graphSections = [
// //         {
// //             title: "Candle Chronicles: Spread Patterns Over Time (TTM)",
// //             description: "Visualizes the distribution of candlestick spread patterns over the past year.",
// //             component: <CandleSpread symbol={symbol} />,
// //             key: "CandleSpread",
// //             image: candle_spread,
// //             icon: <MdShowChart className="text-blue-500" />,
// //             category: "Technical Analysis",
// //             color: "blue"
// //         },
// //         {
// //             title: "PEGY Worm Plot",
// //             description: "Visualizes PEGY ratio trends to assess stock valuation based on earnings growth and yield.",
// //             component: <PegyWormPlot symbol={symbol} />,
// //             key: "PegyWormPlot",
// //             image: PegyPlot,
// //             icon: <FiBarChart2 className="text-cyan-500" />,
// //             category: "Valuation Analysis",
// //             color: "teal"
// //         },
// //         {
// //             title: "MACD Analysis for TTM",
// //             description: "Plots the MACD indicator to identify momentum over the last year.",
// //             component: <MacdPlot symbol={symbol} />,
// //             key: "MacdPlot",
// //             image: Macd_Plot,
// //             icon: <MdGridView className="text-red-500" />,
// //             category: "Momentum",
// //             color: "red"
// //         },
// //         {
// //             title: "Sensex Calculator",
// //             description: "A tool to calculate Sensex-related metrics for analysis.",
// //             component: <SensexCalculator symbol={symbol} />,
// //             key: "SensexCalculator",
// //             image: Sensex_Calculator,
// //             icon: <MdAnalytics className="text-lime-500" />,
// //             category: "Tools",
// //             color: "lime"
// //         },
// //         {
// //             title: "Market Mood: Delivery Trends & Trading Sentiment",
// //             description: "Analyzes delivery trends and trading sentiment over time.",
// //             component: <DelRate symbol={symbol} />,
// //             key: "DelRate",
// //             image: Del_Rate,
// //             icon: <MdTableChart className="text-teal-500" />,
// //             category: "Sentiment Analysis",
// //             color: "teal"
// //         },
// //         {
// //             title: "Breach Busters: Analyzing High and Low Breaches",
// //             description: "Examines instances of high and low price breaches.",
// //             component: <CandleBreach symbol={symbol} />,
// //             key: "CandleBreach",
// //             image: Candle_Breach,
// //             icon: <FaChartLine className="text-amber-500" />,
// //             category: "Price Action",
// //             color: "amber"
// //         },
// //         {
// //             title: "Boxing Prices: TTM Box Plot for Trade Prices",
// //             description: "Shows a box plot of trade prices over the last year with key levels.",
// //             component: <LastTraded symbol={symbol} />,
// //             key: "LastTraded",
// //             image: Last_Traded,
// //             icon: <MdBarChart className="text-green-500" />,
// //             category: "Price Analysis",
// //             color: "green"
// //         },
// //         {
// //             title: "Price Trends in a Box: Monthly Ranges and Averages Explored (TTM)",
// //             description: "Displays monthly price ranges and averages over the past year.",
// //             component: <AvgBoxPlots symbol={symbol} />,
// //             key: "AvgBoxPlots",
// //             image: AvgBox_Plots,
// //             icon: <FiTrendingUp className="text-purple-500" />,
// //             category: "Trend Analysis",
// //             color: "purple"
// //         },
// //         {
// //             title: "Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends",
// //             description: "Analyzes weekly trade delivery patterns during market trends.",
// //             component: <WormsPlots symbol={symbol} />,
// //             key: "WormsPlots",
// //             image: Worms_Plots,
// //             icon: <FiMap className="text-orange-500" />,
// //             category: "Volume Analysis",
// //             color: "orange"
// //         },
// //         {
// //             title: "Sensex & Stock Fluctuations",
// //             description: "Compares monthly percentage changes between Sensex and the stock.",
// //             component: <SensexStockCorrBar symbol={symbol} />,
// //             key: "SensexStockCorrBar",
// //             image: Sensex_StockCorrBar,
// //             icon: <FiBarChart2 className="text-cyan-500" />,
// //             category: "Market Correlation",
// //             color: "cyan"
// //         },
// //         {
// //             title: "Sensex Symphony: Harmonizing Stock Correlation Trends (TTM)",
// //             description: "Visualizes correlation trends between Sensex and the stock.",
// //             component: <SensexVsStockCorr symbol={symbol} />,
// //             key: "SensexVsStockCorr",
// //             image: Sensex_VsStockCorr,
// //             icon: <MdPieChart className="text-indigo-500" />,
// //             category: "Correlation Analysis",
// //             color: "indigo"
// //         },
// //         {
// //             title: `Performance Heatmap: Nifty50 vs BSE vs ${symbol}`,
// //             description: "A heatmap comparing performance across Nifty50, BSE, and the stock.",
// //             component: <HeatMap symbol={symbol} />,
// //             key: "HeatMap",
// //             image: Heat_Map,
// //             icon: <FiPieChart className="text-pink-500" />,
// //             category: "Market Comparison",
// //             color: "pink"
// //         },
// //         {
// //             title: "PE vs EPS vs Book Value: Gladiators in the Industry Arena",
// //             description: "Compares PE, EPS, and Book Value within the industry context.",
// //             component: <IndustryBubble symbol={symbol} />,
// //             key: "IndustryBubble",
// //             image: Industry_Bubble,
// //             icon: <MdSwapHoriz className="text-emerald-500" />,
// //             category: "Fundamental Analysis",
// //             color: "emerald"
// //         },
// //     ];

// //     const handleGraphSelect = (graph, index) => {
// //         if (!isLoggedIn && !graphSections.slice(0, MAX_VISIBLE_GRAPHS).some((g) => g.key === graph.key)) {
// //             navigate('/login', { state: { from: location.pathname, graphKey: graph.key } });
// //             return;
// //         }
// //         if (selectedGraph && selectedGraph.key === graph.key) {
// //             setSelectedGraph(null);
// //         } else {
// //             setSelectedGraph({ key: graph.key, title: graph.title });
// //         }
// //     };

// //     const handleClearSelection = () => setSelectedGraph(null);

// //     const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

// //     // Enhanced Custom Arrows
// //     const PrevArrow = ({ onClick }) => (
// //         <button
// //             onClick={onClick}
// //             className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-white p-3 rounded-full hover:bg-white dark:hover:bg-slate-700  border border-slate-200 dark:border-slate-600 transition-all duration-300 hover:scale-110 z-20 backdrop-blur-sm"
// //             aria-label="Previous Graph"
// //         >
// //             <FaArrowLeft className="w-4 h-4" />
// //         </button>
// //     );

// //     const NextArrow = ({ onClick }) => (
// //         <button
// //             onClick={onClick}
// //             className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-white p-3 rounded-full hover:bg-white dark:hover:bg-slate-700  border border-slate-200 dark:border-slate-600 transition-all duration-300 hover:scale-110 z-20 backdrop-blur-sm"
// //             aria-label="Next Graph"
// //         >
// //             <FaArrowRight className="w-4 h-4" />
// //         </button>
// //     );

// //     const sliderSettings = {
// //         dots: false,
// //         infinite: false,
// //         speed: 500,
// //         slidesToShow: 1,
// //         slidesToScroll: 1,
// //         arrows: false,
// //         appendDots: dots => (
// //             <div className="bg-white/80 dark:bg-slate-800/80 rounded-full px-4 py-2 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
// //                 <ul className="flex space-x-2"> {dots} </ul>
// //             </div>
// //         ),
// //         customPaging: i => (
// //             <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full transition-all duration-300 hover:bg-slate-400 dark:hover:bg-slate-500" />
// //         )
// //     };

// //     const getColorClasses = (color) => {
// //         const colorMap = {
// //             blue: 'from-blue-200 to-blue-200',
// //             green: 'from-green-200 to-green-200',
// //             purple: 'from-purple-200 to-purple-200',
// //             orange: 'from-orange-200 to-orange-200',
// //             red: 'from-red-200 to-red-200',
// //             cyan: 'from-cyan-200 to-cyan-200',
// //             indigo: 'from-indigo-200 to-indigo-200',
// //             pink: 'from-pink-200 to-pink-200',
// //             teal: 'from-teal-200 to-teal-200',
// //             amber: 'from-amber-200 to-amber-200',
// //             lime: 'from-lime-200 to-lime-200',
// //             emerald: 'from-emerald-200 to-emerald-200'
// //         };
// //         return colorMap[color] || 'from-slate-200 to-slate-200';
// //     };

// //     const renderGraphTabContent = () => {
// //         if (selectedGraph) {
// //             const initialSlide = graphSections.findIndex((g) => g.key === selectedGraph.key);

// //             return (
// //                 <div
// //                     className={`${isFullWidth ? 'w-full' : 'w-auto'
// //                         } transition-all duration-300 p-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-900 p-0' : ''
// //                         }`}
// //                 >
// //                     {/* Graph Viewer Header */}
// //                     <div
// //                         className={`flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl ${isFullscreen ? 'rounded-none border-b border-slate-200 dark:border-slate-700' : ''
// //                             }`}
// //                     >
// //                         <div className="flex items-center gap-4">
// //                             <button
// //                                 onClick={handleClearSelection}
// //                                 className="flex items-center gap-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-white px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200 border border-slate-200 dark:border-slate-600"
// //                             >
// //                                 <FaArrowLeft className="w-4 h-4" />
// //                                 Back to Gallery
// //                             </button>

// //                         </div>

// //                     </div>

// //                     {/* Graph Slider */}
// //                     <div className={`${isFullscreen ? 'h-[calc(100vh-150px)]' : 'h-[800px] '} relative`}>
// //                         <Slider
// //                             {...sliderSettings}
// //                             ref={sliderRef}
// //                             initialSlide={initialSlide}
// //                             afterChange={(index) => {
// //                                 const newGraph = graphSections[index];
// //                                 setSelectedGraph({ key: newGraph.key, title: newGraph.title });
// //                             }}
// //                             prevArrow={<PrevArrow />}
// //                             nextArrow={<NextArrow />}
// //                             arrows={true}
// //                         >
// //                             {graphSections.map((graph) => (
// //                                 <div
// //                                     key={graph.key}
// //                                     className="relative dark:bg-slate-800  p-6 h-full"
// //                                 >
// //                                     <div className="flex items-center justify-between mb-6">
// //                                         <div>
// //                                             <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
// //                                                 {graph.title}
// //                                             </h2>
// //                                             {/* Add rating in slider view */}
// //                                             {ratings[graph.key] && (
// //                                                 <div className="flex items-center gap-2 mt-2">
// //                                                     <RatingStars rating={ratings[graph.key].averageRating} size="md" />
// //                                                     <span className="text-sm text-slate-600 dark:text-slate-400">
// //                                                         Based on {ratings[graph.key].totalRatings} user ratings
// //                                                     </span>
// //                                                 </div>
// //                                             )}
// //                                         </div>
// //                                         <span
// //                                             className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getColorClasses(
// //                                                 graph.color
// //                                             )} text-black`}
// //                                         >
// //                                             {graph.category}
// //                                         </span>
// //                                     </div>
// //                                     <div className="w-full h-[700px] overflow-auto">
// //                                         {graph.component}
// //                                     </div>
// //                                 </div>
// //                             ))}
// //                         </Slider>
// //                     </div>
// //                 </div>
// //             );
// //         }

// //         // Graph Gallery View
// //         return (
// //             <div className="w-full transition-all duration-300">
// //                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
// //                     {graphSections.map(({ title, description, key, image, icon, category, color }, index) => {
// //                         const isVisible = isLoggedIn || index < MAX_VISIBLE_GRAPHS;
// //                         return (
// //                             <div
// //                                 key={key}
// //                                 className={`group relative dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl`}
// //                                 onClick={() =>
// //                                     isVisible
// //                                         ? handleGraphSelect({ title, key }, index)
// //                                         : navigate('/login', { state: { from: location.pathname, graphKey: key } })
// //                                 }
// //                                 role="button"
// //                                 tabIndex={0}
// //                             >
// //                                 <div className="relative h-48 overflow-hidden">
// //                                     <img
// //                                         src={image}
// //                                         alt={title}
// //                                         className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
// //                                     />
// //                                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
// //                                     <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
// //                                         <div className="flex items-center justify-between">
// //                                             <span
// //                                                 className={`px-2 py-1 rounded text-xs font-medium text-black bg-gradient-to-r ${getColorClasses(
// //                                                     color
// //                                                 )}`}
// //                                             >
// //                                                 {category}
// //                                             </span>
// //                                             <div className="flex items-center gap-2 bg-black/50 rounded-full px-3 py-1">
// //                                                 <FaEye className="w-3 h-3" />
// //                                                 <span className="text-xs">View Graph</span>
// //                                             </div>
// //                                         </div>
// //                                     </div>
// //                                 </div>

// //                                 <div className="p-5">
// //                                     <div className="flex items-center gap-3 mb-3">
// //                                         <div
// //                                             className={`p-2 rounded-lg bg-gradient-to-r ${getColorClasses(
// //                                                 color
// //                                             )} bg-opacity-10 text-white`}
// //                                         >
// //                                             {icon}
// //                                         </div>
// //                                         <div className="flex-1">
// //                                             <h3 className="font-semibold text-slate-800 dark:text-white line-clamp-2 leading-tight">
// //                                                 {title}
// //                                             </h3>
// //                                             {/* Rating display */}
// //                                             {!ratings[key] ? (
// //                                                 <div className="flex items-center gap-2 mt-1">
// //                                                     <div className="flex gap-0.5">
// //                                                         {[...Array(5)].map((_, i) => (
// //                                                             <div key={i} className="w-3 h-3 bg-gray-200 rounded-sm animate-pulse" />
// //                                                         ))}
// //                                                     </div>
// //                                                     <div className="w-8 h-3 bg-gray-200 rounded animate-pulse" />
// //                                                 </div>
// //                                             ) : (
// //                                                 <div className="flex items-center gap-2 mt-1">
// //                                                     <RatingStars rating={ratings[key].averageRating} size="sm" />
// //                                                     <span className="text-xs text-slate-500 dark:text-slate-400">
// //                                                         ({ratings[key].totalRatings} ratings)
// //                                                     </span>
// //                                                 </div>
// //                                             )}
// //                                         </div>
// //                                     </div>
// //                                     <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
// //                                         {description}
// //                                     </p>
// //                                     <div className="flex items-center justify-between">
// //                                         <span className="text-xs text-slate-500 dark:text-slate-400">
// //                                             Click to explore
// //                                         </span>
// //                                         <FaChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
// //                                     </div>
// //                                 </div>

// //                                 {/* Overlay only if locked */}
// //                                 {!isVisible && (
// //                                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-2xl z-10">
// //                                         <div className="text-center p-6">
// //                                             <FaUserLock className="w-12 h-12 text-white mb-3 mx-auto drop-shadow-md" />
// //                                             <span className="text-white font-semibold text-lg block">
// //                                                 Premium Feature
// //                                             </span>
// //                                             <span className="text-slate-300 text-sm block mt-1">
// //                                                 Login to unlock all graphs
// //                                             </span>
// //                                             <button className="mt-4 px-6 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-full text-sm font-medium shadow-md hover:from-sky-500 hover:to-cyan-500 transition-all duration-200">
// //                                                 Login Now
// //                                             </button>
// //                                         </div>
// //                                     </div>
// //                                 )}
// //                             </div>
// //                         );
// //                     })}
// //                 </div>
// //             </div>
// //         );
// //     };

// //     const renderCandlePatternTabContent = () => (
// //         <div className="w-full dark:bg-slate-800 rounded-2xl p-6">
// //             <CandlePattern symbol={symbol} />
// //         </div>
// //     );

// //     const renderFinanceTabContent = () => (
// //         <div className="w-full dark:bg-slate-800 rounded-2xl p-6">
// //             <FinancialTab symbol={symbol} />
// //             <FinancialRatingSystem plotType={symbol} onRatingUpdate={(rating) => console.log(`Financial rating for ${symbol}: ${rating}`)} />
// //         </div>
// //     );

// //     const renderShareHoldingTabContent = () => (
// //         <div className="w-full dark:bg-slate-800 rounded-2xl p-6">
// //             <Shareholding symbol={symbol} />
// //         </div>
// //     );

// //     const PublicTradingActivityTabContent = () => (
// //         <div className="w-full dark:bg-slate-800 rounded-2xl p-6">
// //             <PublicTradingActivityPlot symbol={symbol} />
// //         </div>
// //     );

// //     // Enhanced Tab Configuration
// //     const tabs = [
// //         {
// //             id: 'graphs',
// //             label: 'Data Analysis',
// //             icon: <MdAnalytics className="w-5 h-5" />,
// //             description: 'Interactive charts and visualizations'
// //         },
// //         {
// //             id: 'candle_pattern',
// //             label: 'Candle Patterns',
// //             icon: <FaChartLine className="w-5 h-5" />,
// //             description: 'Candlestick pattern analysis'
// //         },
// //         {
// //             id: 'finance',
// //             label: 'Financials',
// //             icon: <MdAttachMoney className="w-5 h-5" />,
// //             description: 'Financial statements & metrics'
// //         },
// //         {
// //             id: 'Shareholding',
// //             label: 'Shareholding',
// //             icon: <FaUserTie className="w-5 h-5" />,
// //             description: 'Ownership structure analysis'
// //         },
// //         {
// //             id: 'PublicTradingActivityPlot',
// //             label: 'Trading Activity',
// //             icon: <MdSwapHoriz className="w-5 h-5" />,
// //             description: 'Public trading insights'
// //         }
// //     ];

// //     return (
// //         <div className="font-sans w-full dark:bg-slate-800 min-h-screen">
// //             <div className="container mx-auto px-4 py-8">
// //                 {/* Enhanced Tab Navigation */}
// //                 <div className="flex flex-col items-center mb-8">
// //                     <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 text-center">
// //                         Advanced Stock Analysis
// //                     </h2>
// //                     <p className="text-slate-600 dark:text-slate-300 text-center mb-8 max-w-2xl">
// //                         Comprehensive tools and visualizations for in-depth market analysis of {symbol}
// //                     </p>

// //                     <div className="dark:bg-slate-800/80 backdrop-blur-lg rounded-xl p-2 border border-slate-200/50 dark:border-slate-700/50 shadow-sm w-full max-w-6xl">
// //                         <div className="flex flex-wrap justify-center gap-1">
// //                             {tabs.map((tab) => (
// //                                 <button
// //                                     key={tab.id}
// //                                     role="tab"
// //                                     aria-selected={activeTab === tab.id}
// //                                     aria-controls={`${tab.id}-tabpanel`}
// //                                     id={`${tab.id}-tab`}
// //                                     onClick={() => setActiveTab(tab.id)}
// //                                     className={`relative flex flex-col items-center px-4 py-2 rounded-xl transition-all duration-300 ease-in-out min-w-[120px] group ${activeTab === tab.id
// //                                         ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-blue-500/25'
// //                                         : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
// //                                         }`}
// //                                 >
// //                                     <div
// //                                         className={`mb-2 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
// //                                             }`}
// //                                     >
// //                                         {tab.icon}
// //                                     </div>
// //                                     <span className="font-bold text-sm mb-1">{tab.label}</span>
// //                                     <span className="text-xs opacity-80">{tab.description}</span>

// //                                     {activeTab === tab.id && (
// //                                         <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full animate-pulse"></div>
// //                                     )}
// //                                 </button>
// //                             ))}
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* Tab Content */}
// //                 <div
// //                     id={`${activeTab}-tabpanel`}
// //                     aria-labelledby={`${activeTab}-tab`}
// //                     role="tabpanel"
// //                     className="dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 transition-all duration-500 ease-in-out overflow-hidden"
// //                 >
// //                     <div className="p-6 animate-fade-in">
// //                         {activeTab === 'graphs' && renderGraphTabContent()}
// //                         {activeTab === 'candle_pattern' && renderCandlePatternTabContent()}
// //                         {activeTab === 'finance' && renderFinanceTabContent()}
// //                         {activeTab === 'Shareholding' && renderShareHoldingTabContent()}
// //                         {activeTab === 'PublicTradingActivityPlot' && PublicTradingActivityTabContent()}
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// const GraphSlider = ({ symbol, symbols, isFullWidth, timeRange = '1Y', normalize = false, overlay = false, tabContext = 'equityHub', getAuthToken }) => {
//     const { isLoggedIn } = useAuth();
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState(() => {
//         const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//         const saved = localStorage.getItem(storageKey);
//         return saved ? JSON.parse(saved).activeTab || 'graphs' : 'graphs';
//     });
//     const [selectedGraph, setSelectedGraph] = useState(() => {
//         const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//         const saved = localStorage.getItem(storageKey);
//         return saved ? JSON.parse(saved).selectedGraph || null : null;
//     });
//     const [plotData, setPlotData] = useState(() => {
//         const saved = localStorage.getItem('plotData');
//         return saved ? JSON.parse(saved) : {};
//     });
//     const [ratings, setRatings] = useState({});
//     const [graphsLoaded, setGraphsLoaded] = useState(false);
//     const [error, setError] = useState(null);
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const sliderRef = useRef(null);
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//     const CACHE_TTL = 60 * 60 * 1000;
//     const MAX_VISIBLE_GRAPHS = 5;

//     // Rating update handler
//     const handleRatingUpdate = useCallback((plotType) => {
//         const fetchUpdatedRating = async () => {
//             const updatedRating = await fetchAverageRating(plotType);
//             setRatings(prev => ({ ...prev, [plotType]: updatedRating }));
//         };
//         fetchUpdatedRating();
//     }, []);
//     // Restore selected graph from location.state.graphKey after login
//     useEffect(() => {
//         if (location.state?.graphKey && isLoggedIn) {
//             const graph = graphSections.find((g) => g.key === location.state.graphKey);
//             if (graph && selectedGraph?.key !== graph.key) {
//                 setSelectedGraph({ key: graph.key, title: graph.title });
//                 navigate(location.pathname, { replace: true, state: { from: location.state.from } });
//             }
//         }
//     }, [location.state, isLoggedIn, symbol, symbols, overlay, navigate]);

//     useEffect(() => {
//         const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//         const serializableSelectedGraph = selectedGraph ? { key: selectedGraph.key, title: selectedGraph.title } : null;
//         localStorage.setItem(storageKey, JSON.stringify({ activeTab, selectedGraph: serializableSelectedGraph }));
//     }, [activeTab, selectedGraph, symbol, tabContext]);

//     const getCachedData = (key) => {
//         const cached = localStorage.getItem(key);
//         if (!cached) return null;
//         try {
//             const { data, timestamp } = JSON.parse(cached);
//             if (Date.now() - timestamp > CACHE_TTL) {
//                 localStorage.removeItem(key);
//                 return null;
//             }
//             return data;
//         } catch (err) {
//             console.error(`Failed to parse cached data for ${key}:`, err);
//             localStorage.removeItem(key);
//             return null;
//         }
//     };

//     const setCachedData = (key, data) => {
//         try {
//             const serializedData = JSON.stringify({ data, timestamp: Date.now() });
//             if (serializedData.length > 1024 * 1024) {
//                 console.warn(`Data for ${key} exceeds 1MB, skipping cache.`);
//                 return;
//             }
//             localStorage.setItem(key, serializedData);
//         } catch (err) {
//             console.error(`Failed to cache data for ${key}:`, err);
//         }
//     };

//     const plotTypeMapping = {
//         candle_chronicle: 'candle_chronicle',
//         pegy: 'pegy',
//         macd: 'macd',
//         sensex_movement_corr_calculator: 'sensex_movement_corr_calculator',
//         market_mood: 'market_mood',
//         breach_busters: 'breach_busters',
//         box_plot: 'box_plot',
//         price_trend: 'price_trend', // Confirmed working
//         trend_tapestry: 'trend_tapestry',
//         sensex_stock_fluctuations: 'sensex_stock_fluctuations',
//         sensex_symphony: 'sensex_symphony',
//         performance_heatmap: 'performance_heatmap',
//         pe_eps_book_value: 'pe_eps_book_value' // To be verified
//     };
//     // Fetch average ratings for all graphs
//     const fetchAverageRating = async (plotType) => {
//         try {
//             const cacheKey = `rating_${plotType}`;
//             const cachedData = getCachedData(cacheKey);
//             if (cachedData) return cachedData;

//             const apiPlotType = plotTypeMapping[plotType] || plotType;
//             console.log(`Fetching ratings for ${plotType} → API: ${apiPlotType}`); // ADD THIS

//             const response = await fetch(`${API_BASE}/stocks/test/ratings/${apiPlotType}/average`);
//             console.log(`Response status for ${apiPlotType}: ${response.status}`); // ADD THIS

//             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//             const responseText = await response.text();

//             let data;
//             try {
//                 data = JSON.parse(responseText);
//             } catch (jsonError) {
//                 const averageRating = parseFloat(responseText);
//                 data = {
//                     plotType,
//                     averageRating: isNaN(averageRating) ? 0 : averageRating,
//                     totalRatings: 1,
//                     ratingBreakdown: {
//                         "5": 0,
//                         "4": 0,
//                         "3": 0,
//                         "2": 0,
//                         "1": 0
//                     }
//                 };
//             }

//             setCachedData(cacheKey, data);
//             return data;
//         } catch (error) {
//             console.error(`Error fetching average rating for ${plotType} (API: ${plotTypeMapping[plotType] || plotType}):`, error);

//             const defaultRating = {
//                 plotType,
//                 averageRating: 0,
//                 totalRatings: 0,
//                 ratingBreakdown: {
//                     "5": 0,
//                     "4": 0,
//                     "3": 0,
//                     "2": 0,
//                     "1": 0
//                 }
//             };

//             return defaultRating;
//         }
//     };

//     // Fetch all ratings when component mounts
//     useEffect(() => {
//         const fetchAllRatings = async () => {
//             const ratingsData = {};
//             for (const graph of graphSections) {
//                 const rating = await fetchAverageRating(graph.key);
//                 ratingsData[graph.key] = rating;
//             }
//             setRatings(ratingsData);
//         };

//         fetchAllRatings();
//     }, []);

//     useEffect(() => {
//         const fetchPlotData = async () => {
//             if (!symbol) {
//                 setGraphsLoaded(true);
//                 return;
//             }
//             const cacheKey = `plot_${symbol}_${timeRange}_${normalize}`;
//             const cachedData = getCachedData(cacheKey);
//             if (cachedData) {
//                 setPlotData((prev) => ({ ...prev, [symbol]: cachedData }));
//                 setGraphsLoaded(true);
//                 return;
//             }

//             try {
//                 const response = await fetch(`${API_BASE}/stocks/test/candle_chronicle`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         ...(getAuthToken && { Authorization: `Bearer ${getAuthToken()}` }),
//                     },
//                     body: JSON.stringify({ symbol, timeRange, normalize }),
//                 });

//                 if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//                 const data = await response.json();
//                 setPlotData((prev) => {
//                     const updated = { ...prev, [symbol]: { ...prev[symbol], [timeRange]: { [normalize ? 'normalized' : 'raw']: data } } };
//                     setCachedData(cacheKey, data);
//                     return updated;
//                 });
//                 setGraphsLoaded(true);
//             } catch (error) {
//                 // toast.error(error.message || 'Error fetching plot data');
//             }
//         };

//         fetchPlotData();
//     }, [symbol, timeRange, normalize, API_BASE, getAuthToken]);

//     // Enhanced graph sections with icons and categories
//     const graphSections = [
//         {
//             title: "Candle Chronicles: Spread Patterns Over Time (TTM)",
//             description: "Visualizes the distribution of candlestick spread patterns over the past year.",
//             component: <CandleSpread symbol={symbol} />,
//             key: "CandleSpread",
//             image: candle_spread,
//             icon: <MdShowChart className="text-blue-500" />,
//             category: "Technical Analysis",
//             color: "blue"
//         },
//         {
//             title: "PEGY Worm Plot",
//             description: "Visualizes PEGY ratio trends to assess stock valuation based on earnings growth and yield.",
//             component: <PegyWormPlot symbol={symbol} />,
//             key: "PegyWormPlot",
//             image: PegyPlot,
//             icon: <FiBarChart2 className="text-cyan-500" />,
//             category: "Valuation Analysis",
//             color: "teal"
//         },
//         {
//             title: "MACD Analysis for TTM",
//             description: "Plots the MACD indicator to identify momentum over the last year.",
//             component: <MacdPlot symbol={symbol} />,
//             key: "MacdPlot",
//             image: Macd_Plot,
//             icon: <MdGridView className="text-red-500" />,
//             category: "Momentum",
//             color: "red"
//         },
//         {
//             title: "Sensex Calculator",
//             description: "A tool to calculate Sensex-related metrics for analysis.",
//             component: <SensexCalculator symbol={symbol} />,
//             key: "SensexCalculator",
//             image: Sensex_Calculator,
//             icon: <MdAnalytics className="text-lime-500" />,
//             category: "Tools",
//             color: "lime"
//         },
//         {
//             title: "Market Mood: Delivery Trends & Trading Sentiment",
//             description: "Analyzes delivery trends and trading sentiment over time.",
//             component: <DelRate symbol={symbol} />,
//             key: "DelRate",
//             image: Del_Rate,
//             icon: <MdTableChart className="text-teal-500" />,
//             category: "Sentiment Analysis",
//             color: "teal"
//         },
//         {
//             title: "Breach Busters: Analyzing High and Low Breaches",
//             description: "Examines instances of high and low price breaches.",
//             component: <CandleBreach symbol={symbol} />,
//             key: "CandleBreach",
//             image: Candle_Breach,
//             icon: <FaChartLine className="text-amber-500" />,
//             category: "Price Action",
//             color: "amber"
//         },
//         {
//             title: "Boxing Prices: TTM Box Plot for Trade Prices",
//             description: "Shows a box plot of trade prices over the last year with key levels.",
//             component: <LastTraded symbol={symbol} />,
//             key: "LastTraded",
//             image: Last_Traded,
//             icon: <MdBarChart className="text-green-500" />,
//             category: "Price Analysis",
//             color: "green"
//         },
//         {
//             title: "Price Trends in a Box: Monthly Ranges and Averages Explored (TTM)",
//             description: "Displays monthly price ranges and averages over the past year.",
//             component: <AvgBoxPlots symbol={symbol} />,
//             key: "AvgBoxPlots",
//             image: AvgBox_Plots,
//             icon: <FiTrendingUp className="text-purple-500" />,
//             category: "Trend Analysis",
//             color: "purple"
//         },
//         {
//             title: "Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends",
//             description: "Analyzes weekly trade delivery patterns during market trends.",
//             component: <WormsPlots symbol={symbol} />,
//             key: "WormsPlots",
//             image: Worms_Plots,
//             icon: <FiMap className="text-orange-500" />,
//             category: "Volume Analysis",
//             color: "orange"
//         },
//         {
//             title: "Sensex & Stock Fluctuations",
//             description: "Compares monthly percentage changes between Sensex and the stock.",
//             component: <SensexStockCorrBar symbol={symbol} />,
//             key: "SensexStockCorrBar",
//             image: Sensex_StockCorrBar,
//             icon: <FiBarChart2 className="text-cyan-500" />,
//             category: "Market Correlation",
//             color: "cyan"
//         },
//         {
//             title: "Sensex Symphony: Harmonizing Stock Correlation Trends (TTM)",
//             description: "Visualizes correlation trends between Sensex and the stock.",
//             component: <SensexVsStockCorr symbol={symbol} />,
//             key: "SensexVsStockCorr",
//             image: Sensex_VsStockCorr,
//             icon: <MdPieChart className="text-indigo-500" />,
//             category: "Correlation Analysis",
//             color: "indigo"
//         },
//         {
//             title: `Performance Heatmap: Nifty50 vs BSE vs ${symbol}`,
//             description: "A heatmap comparing performance across Nifty50, BSE, and the stock.",
//             component: <HeatMap symbol={symbol} />,
//             key: "HeatMap",
//             image: Heat_Map,
//             icon: <FiPieChart className="text-pink-500" />,
//             category: "Market Comparison",
//             color: "pink"
//         },
//         {
//             title: "PE vs EPS vs Book Value: Gladiators in the Industry Arena",
//             description: "Compares PE, EPS, and Book Value within the industry context.",
//             component: <IndustryBubble symbol={symbol} />,
//             key: "IndustryBubble",
//             image: Industry_Bubble,
//             icon: <MdSwapHoriz className="text-emerald-500" />,
//             category: "Fundamental Analysis",
//             color: "emerald"
//         },
//     ];

//     const handleGraphSelect = (graph, index) => {
//         if (!isLoggedIn && !graphSections.slice(0, MAX_VISIBLE_GRAPHS).some((g) => g.key === graph.key)) {
//             navigate('/login', { state: { from: location.pathname, graphKey: graph.key } });
//             return;
//         }
//         if (selectedGraph && selectedGraph.key === graph.key) {
//             setSelectedGraph(null);
//         } else {
//             setSelectedGraph({ key: graph.key, title: graph.title });
//         }
//     };

//     const handleClearSelection = () => setSelectedGraph(null);

//     const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

//     // Enhanced Custom Arrows
//     const PrevArrow = ({ onClick }) => (
//         <button
//             onClick={onClick}
//             className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-white p-3 rounded-full hover:bg-white dark:hover:bg-slate-700  border border-slate-200 dark:border-slate-600 transition-all duration-300 hover:scale-110 z-20 backdrop-blur-sm"
//             aria-label="Previous Graph"
//         >
//             <FaArrowLeft className="w-4 h-4" />
//         </button>
//     );

//     const NextArrow = ({ onClick }) => (
//         <button
//             onClick={onClick}
//             className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-white p-3 rounded-full hover:bg-white dark:hover:bg-slate-700  border border-slate-200 dark:border-slate-600 transition-all duration-300 hover:scale-110 z-20 backdrop-blur-sm"
//             aria-label="Next Graph"
//         >
//             <FaArrowRight className="w-4 h-4" />
//         </button>
//     );

//     const sliderSettings = {
//         dots: false,
//         infinite: false,
//         speed: 500,
//         slidesToShow: 1,
//         slidesToScroll: 1,
//         arrows: false,
//         appendDots: dots => (
//             <div className="bg-white/80 dark:bg-slate-800/80 rounded-full px-4 py-2 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
//                 <ul className="flex space-x-2"> {dots} </ul>
//             </div>
//         ),
//         customPaging: i => (
//             <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full transition-all duration-300 hover:bg-slate-400 dark:hover:bg-slate-500" />
//         )
//     };

//     const getColorClasses = (color) => {
//         const colorMap = {
//             blue: 'from-blue-200 to-blue-200',
//             green: 'from-green-200 to-green-200',
//             purple: 'from-purple-200 to-purple-200',
//             orange: 'from-orange-200 to-orange-200',
//             red: 'from-red-200 to-red-200',
//             cyan: 'from-cyan-200 to-cyan-200',
//             indigo: 'from-indigo-200 to-indigo-200',
//             pink: 'from-pink-200 to-pink-200',
//             teal: 'from-teal-200 to-teal-200',
//             amber: 'from-amber-200 to-amber-200',
//             lime: 'from-lime-200 to-lime-200',
//             emerald: 'from-emerald-200 to-emerald-200'
//         };
//         return colorMap[color] || 'from-slate-200 to-slate-200';
//     };

//     const renderGraphTabContent = () => {
//         if (selectedGraph) {
//             const initialSlide = graphSections.findIndex((g) => g.key === selectedGraph.key);

//             return (
//                 <div
//                     className={`${isFullWidth ? 'w-full' : 'w-auto'
//                         } transition-all duration-300 p-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-900 p-0' : ''
//                         }`}
//                 >
//                     {/* Graph Viewer Header */}
//                     <div
//                         className={`flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl ${isFullscreen ? 'rounded-none border-b border-slate-200 dark:border-slate-700' : ''
//                             }`}
//                     >
//                         <div className="flex items-center gap-4">
//                             <button
//                                 onClick={handleClearSelection}
//                                 className="flex items-center gap-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-white px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200 border border-slate-200 dark:border-slate-600"
//                             >
//                                 <FaArrowLeft className="w-4 h-4" />
//                                 Back to Gallery
//                             </button>

//                         </div>

//                     </div>

//                     {/* Graph Slider */}
//                     <div className={`${isFullscreen ? 'h-[calc(100vh-150px)]' : 'h-[800px] '} relative`}>
//                         <Slider
//                             {...sliderSettings}
//                             ref={sliderRef}
//                             initialSlide={initialSlide}
//                             afterChange={(index) => {
//                                 const newGraph = graphSections[index];
//                                 setSelectedGraph({ key: newGraph.key, title: newGraph.title });
//                             }}
//                             prevArrow={<PrevArrow />}
//                             nextArrow={<NextArrow />}
//                             arrows={true}
//                         >
//                             {graphSections.map((graph) => (
//                                 <div
//                                     key={graph.key}
//                                     className="relative dark:bg-slate-800  p-6 h-full"
//                                 >
//                                     <div className="flex items-center justify-between mb-6">
//                                         <div>
//                                             <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
//                                                 {graph.title}
//                                             </h2>
//                                             {/* Add rating in slider view */}
//                                             {ratings[graph.key] && (
//                                                 <div className="flex items-center gap-2 mt-2">
//                                                     <RatingStars rating={ratings[graph.key].averageRating} size="md" />
//                                                     <span className="text-sm text-slate-600 dark:text-slate-400">
//                                                         Based on {ratings[graph.key].totalRatings} user ratings
//                                                     </span>
//                                                     {/* <RatingSystem
//                                                         plotType={graph.key}
//                                                         onRatingUpdate={() => handleRatingUpdate(graph.key)}
//                                                     /> */}
//                                                 </div>
//                                             )}
//                                         </div>
//                                         <span
//                                             className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getColorClasses(
//                                                 graph.color
//                                             )} text-black`}
//                                         >
//                                             {graph.category}
//                                         </span>
//                                     </div>
//                                     <div className="w-full h-[700px] overflow-auto">
//                                         {graph.component}
//                                     </div>
//                                 </div>
//                             ))}
//                         </Slider>
//                     </div>
//                 </div>
//             );
//         }

//         // Graph Gallery View
//         return (
//             <div className="w-full transition-all duration-300">
//                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                     {graphSections.map(({ title, description, key, image, icon, category, color }, index) => {
//                         const isVisible = isLoggedIn || index < MAX_VISIBLE_GRAPHS;
//                         return (
//                             <div
//                                 key={key}
//                                 className={`group relative dark:bg-slate-800 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl`}
//                                 onClick={() =>
//                                     isVisible
//                                         ? handleGraphSelect({ title, key }, index)
//                                         : navigate('/login', { state: { from: location.pathname, graphKey: key } })
//                                 }
//                                 role="button"
//                                 tabIndex={0}
//                             >
//                                 <div className="relative h-48 overflow-hidden">
//                                     <img
//                                         src={image}
//                                         alt={title}
//                                         className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//                                     />
//                                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                                     <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                                         <div className="flex items-center justify-between">
//                                             <span
//                                                 className={`px-2 py-1 rounded text-xs font-medium text-black bg-gradient-to-r ${getColorClasses(
//                                                     color
//                                                 )}`}
//                                             >
//                                                 {category}
//                                             </span>
//                                             <div className="flex items-center gap-2 bg-black/50 rounded-full px-3 py-1">
//                                                 <FaEye className="w-3 h-3" />
//                                                 <span className="text-xs">View Graph</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="p-5">
//                                     <div className="flex items-center gap-3 mb-3">
//                                         <div
//                                             className={`p-2 rounded-lg bg-gradient-to-r ${getColorClasses(
//                                                 color
//                                             )} bg-opacity-10 text-white`}
//                                         >
//                                             {icon}
//                                         </div>
//                                         <div className="flex-1">
//                                             <h3 className="font-semibold text-slate-800 dark:text-white line-clamp-2 leading-tight">
//                                                 {title}
//                                             </h3>
//                                             {/* Rating display */}
//                                             {!ratings[key] ? (
//                                                 <div className="flex items-center gap-2 mt-1">
//                                                     <div className="flex gap-0.5">
//                                                         {[...Array(5)].map((_, i) => (
//                                                             <div key={i} className="w-3 h-3 bg-gray-200 rounded-sm animate-pulse" />
//                                                         ))}
//                                                     </div>
//                                                     <div className="w-8 h-3 bg-gray-200 rounded animate-pulse" />
//                                                 </div>
//                                             ) : (
//                                                 <div className="flex items-center gap-2 mt-1">
//                                                     <RatingStars rating={ratings[key].averageRating} size="sm" />
//                                                     <span className="text-xs text-slate-500 dark:text-slate-400">
//                                                         ({ratings[key].totalRatings} ratings)
//                                                     </span>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                     <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
//                                         {description}
//                                     </p>
//                                     <div className="flex items-center justify-between">
//                                         <span className="text-xs text-slate-500 dark:text-slate-400">
//                                             Click to explore
//                                         </span>
//                                         <FaChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
//                                     </div>
//                                 </div>

//                                 {/* Overlay only if locked */}
//                                 {!isVisible && (
//                                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-2xl z-10">
//                                         <div className="text-center p-6">
//                                             <FaUserLock className="w-12 h-12 text-white mb-3 mx-auto drop-shadow-md" />
//                                             <span className="text-white font-semibold text-lg block">
//                                                 Premium Feature
//                                             </span>
//                                             <span className="text-slate-300 text-sm block mt-1">
//                                                 Login to unlock all graphs
//                                             </span>
//                                             <button className="mt-4 px-6 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-full text-sm font-medium shadow-md hover:from-sky-500 hover:to-cyan-500 transition-all duration-200">
//                                                 Login Now
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         );
//     };

//     const renderCandlePatternTabContent = () => (
//         <div className="w-full dark:bg-slate-800 rounded-2xl p-6">
//             <CandlePattern symbol={symbol} />
//         </div>
//     );

//     const renderFinanceTabContent = () => (
//         <div className="w-full dark:bg-slate-800 rounded-2xl p-6">
//             <FinancialTab symbol={symbol} />
//             {/* <FinancialRatingSystem plotType={symbol} onRatingUpdate={(rating) => console.log(`Financial rating for ${symbol}: ${rating}`)} /> */}
//         </div>
//     );

//     const renderShareHoldingTabContent = () => (
//         <div className="w-full dark:bg-slate-800 rounded-2xl p-6">
//             <Shareholding symbol={symbol} />
//         </div>
//     );

//     const PublicTradingActivityTabContent = () => (
//         <div className="w-full dark:bg-slate-800 rounded-2xl p-6">
//             <PublicTradingActivityPlot symbol={symbol} />
//         </div>
//     );

//     // Enhanced Tab Configuration
//     const tabs = [
//         {
//             id: 'graphs',
//             label: 'Data Analysis',
//             icon: <MdAnalytics className="w-5 h-5" />,
//             description: 'Interactive charts and visualizations'
//         },
//         {
//             id: 'candle_pattern',
//             label: 'Candle Patterns',
//             icon: <FaChartLine className="w-5 h-5" />,
//             description: 'Candlestick pattern analysis'
//         },
//         {
//             id: 'finance',
//             label: 'Financials',
//             icon: <MdAttachMoney className="w-5 h-5" />,
//             description: 'Financial statements & metrics'
//         },
//         {
//             id: 'Shareholding',
//             label: 'Shareholding',
//             icon: <FaUserTie className="w-5 h-5" />,
//             description: 'Ownership structure analysis'
//         },
//         {
//             id: 'PublicTradingActivityPlot',
//             label: 'Trading Activity',
//             icon: <MdSwapHoriz className="w-5 h-5" />,
//             description: 'Public trading insights'
//         }
//     ];

//     return (
//         <div className="font-sans w-full dark:bg-slate-800 min-h-screen">
//             <div className="container mx-auto px-4 py-8">
//                 {/* Enhanced Tab Navigation */}
//                 <div className="flex flex-col items-center mb-8">
//                     <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 text-center">
//                         Advanced Stock Analysis
//                     </h2>
//                     <p className="text-slate-600 dark:text-slate-300 text-center mb-8 max-w-2xl">
//                         Comprehensive tools and visualizations for in-depth market analysis of {symbol}
//                     </p>

//                     <div className="dark:bg-slate-800/80 backdrop-blur-lg rounded-xl p-2 border border-slate-200/50 dark:border-slate-700/50 shadow-sm w-full max-w-6xl">
//                         <div className="flex flex-wrap justify-center gap-1">
//                             {tabs.map((tab) => (
//                                 <button
//                                     key={tab.id}
//                                     role="tab"
//                                     aria-selected={activeTab === tab.id}
//                                     aria-controls={`${tab.id}-tabpanel`}
//                                     id={`${tab.id}-tab`}
//                                     onClick={() => setActiveTab(tab.id)}
//                                     className={`relative flex flex-col items-center px-4 py-2 rounded-xl transition-all duration-300 ease-in-out min-w-[120px] group ${activeTab === tab.id
//                                         ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-blue-500/25'
//                                         : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
//                                         }`}
//                                 >
//                                     <div
//                                         className={`mb-2 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
//                                             }`}
//                                     >
//                                         {tab.icon}
//                                     </div>
//                                     <span className="font-bold text-sm mb-1">{tab.label}</span>
//                                     <span className="text-xs opacity-80">{tab.description}</span>

//                                     {activeTab === tab.id && (
//                                         <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full animate-pulse"></div>
//                                     )}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Tab Content */}
//                 <div
//                     id={`${activeTab}-tabpanel`}
//                     aria-labelledby={`${activeTab}-tab`}
//                     role="tabpanel"
//                     className="dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 transition-all duration-500 ease-in-out overflow-hidden"
//                 >
//                     <div className="p-6 animate-fade-in">
//                         {activeTab === 'graphs' && renderGraphTabContent()}
//                         {activeTab === 'candle_pattern' && renderCandlePatternTabContent()}
//                         {activeTab === 'finance' && renderFinanceTabContent()}
//                         {activeTab === 'Shareholding' && renderShareHoldingTabContent()}
//                         {activeTab === 'PublicTradingActivityPlot' && PublicTradingActivityTabContent()}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default GraphSlider;

// ---------------------working code rating system integration-----------------------
// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import Slider from 'react-slick';
// import CandleBreach from './CandleBreach';
// import LastTraded from './LastTraded';
// import AvgBoxPlots from './AvgBoxPlots';
// import WormsPlots from './WormsPlots';
// import SensexStockCorrBar from './SensexVsStockCorrBar';
// import SensexVsStockCorr from './SensexVsStockCorr';
// import HeatMap from './HeatMap';
// import DelRate from './DelRate';
// import VoltyPlot from './VoltyPlot';
// import IndustryBubble from './IndustryBubble';
// import SensexCalculator from './SensexCalculator';
// import MacdPlot from './MacdPlot';
// import CandleSpread from './CandleSpreadDistribution';
// import PublicTradingActivityPlot from './PublicTradingActivityPlot';
// import CandlePattern from './CandlePattern';
// import Shareholding from './Shareholding';
// import FinancialTab from './FinancialTab';
// import PegyWormPlot from './PegyWormPlot';
// import toast from 'react-hot-toast';
// import {
//     FaArrowLeft,
//     FaArrowRight,
//     FaChartLine,
//     FaUserLock,
//     FaUserTie,
//     FaChevronRight,
//     FaPlay,
//     FaTimes,
//     FaExpand,
//     FaEye
// } from 'react-icons/fa';
// import {
//     MdAnalytics,
//     MdAttachMoney,
//     MdSwapHoriz,
//     MdGridView,
//     MdBarChart,
//     MdShowChart,
//     MdPieChart,
//     MdTableChart,
//     MdOutlineStarHalf
// } from 'react-icons/md';
// import {
//     FiBarChart2,
//     FiTrendingUp,
//     FiPieChart,
//     FiMap
// } from 'react-icons/fi';
// import { useAuth } from '../AuthContext';
// import { useLocation, useNavigate } from 'react-router-dom';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// // Import graph thumbnails
// import candle_spread from '/public/equityhub_plot/candle_spread1.png';
// import Industry_Bubble from '/public/equityhub_plot/industry_bubble1.png';
// import Sensex_Calculator from '/public/equityhub_plot/sensex_calculator1.png';
// import Volty_Plot from '/public/assets/graph12.png';
// import Candle_Breach from '/public/equityhub_plot/Screenshot 2025-09-24 110817.png';
// import Del_Rate from '/public/equityhub_plot/delivery_rate1.png';
// import Heat_Map from '/public/equityhub_plot/heatmap1.png';
// import Sensex_VsStockCorr from '/public/equityhub_plot/sensex_analylis1.png';
// import Sensex_StockCorrBar from '/public/equityhub_plot/sensex_and_stock1.png';
// import Macd_Plot from '/public/equityhub_plot/macd_plot1.png';
// import Worms_Plots from '/public/equityhub_plot/weekly_tade_delivery1.png';
// import AvgBox_Plots from '/public/equityhub_plot/avgbox_plot1.png';
// import Last_Traded from '/public/equityhub_plot/box_plot1.png';
// import PegyPlot from '/public/equityhub_plot/pegyplot.png';
// import PublicTrading_Activity from '/public/equityhub_plot/PublicTrading_Activity.png';
// // import FinancialRatingSystem from '../RatingFile /FinancialRatingSystem';

// import { MdStar, MdStarHalf, MdStarOutline } from 'react-icons/md';

// const RatingStars = ({ rating, size = "lg" }) => {
//     let effectiveRating = rating;
//     if (isNaN(effectiveRating) || effectiveRating === null || effectiveRating === undefined) {
//         effectiveRating = 0;
//     }
//     effectiveRating = Math.max(0, Math.min(5, effectiveRating));

//     const fullStars = Math.floor(effectiveRating);
//     const hasHalfStar = effectiveRating % 1 >= 0.25 && effectiveRating % 1 < 0.75;
//     const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

//     // Check if rating is a whole number (no decimal)
//     const isWholeNumber = effectiveRating % 1 === 0;

//     // Size classes for different icon sizes
//     const sizeClasses = {
//         sm: "text-base",
//         md: "text-xl",
//         lg: "text-2xl"
//     };

//     const textSizes = {
//         sm: "text-xs",
//         md: "text-sm",
//         lg: "text-base"
//     };

//     return (
//         <div className="flex items-center gap-1">
//             {/* Full stars */}
//             {[...Array(fullStars)].map((_, i) => (
//                 <MdStar
//                     key={`full-${i}`}
//                     className={`${sizeClasses[size]} text-yellow-400`}
//                 />
//             ))}

//             {/* Half star */}
//             {hasHalfStar && (
//                 <MdStarHalf className={`${sizeClasses[size]} text-yellow-400`} />
//             )}

//             {/* Empty stars */}
//             {[...Array(emptyStars)].map((_, i) => (
//                 <MdStarOutline
//                     key={`empty-${i}`}
//                     className={`${sizeClasses[size]} text-gray-300`}
//                 />
//             ))}

//             {/* Rating number */}
//             <span className={`ml-2 font-semibold ${textSizes[size]} text-slate-700 dark:text-slate-300`}>
//                 {isWholeNumber ? effectiveRating.toFixed(0) : effectiveRating.toFixed(1)}
//             </span>
//         </div>
//     );
// };

// const GraphSlider = ({ symbol, symbols, isFullWidth, timeRange = '1Y', normalize = false, overlay = false, tabContext = 'equityHub', getAuthToken }) => {
//     const { isLoggedIn } = useAuth();
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState(() => {
//         const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//         const saved = localStorage.getItem(storageKey);
//         return saved ? JSON.parse(saved).activeTab || 'graphs' : 'graphs';
//     });
//     const [selectedGraph, setSelectedGraph] = useState(() => {
//         const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//         const saved = localStorage.getItem(storageKey);
//         return saved ? JSON.parse(saved).selectedGraph || null : null;
//     });
//     const [plotData, setPlotData] = useState(() => {
//         const saved = localStorage.getItem('plotData');
//         return saved ? JSON.parse(saved) : {};
//     });
//     const [ratings, setRatings] = useState({});
//     const [graphsLoaded, setGraphsLoaded] = useState(false);
//     const [error, setError] = useState(null);
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const sliderRef = useRef(null);
//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//     const CACHE_TTL = 60 * 60 * 1000;
//     const MAX_VISIBLE_GRAPHS = 5;

//     // Rating update handler
//     const handleRatingUpdate = useCallback((plotType) => {
//         const fetchUpdatedRating = async () => {
//             const updatedRating = await fetchAverageRating(plotType);
//             setRatings(prev => ({ ...prev, [plotType]: updatedRating }));
//         };
//         fetchUpdatedRating();
//     }, []);
//     // Restore selected graph from location.state.graphKey after login
//     useEffect(() => {
//         if (location.state?.graphKey && isLoggedIn) {
//             const graph = graphSections.find((g) => g.key === location.state.graphKey);
//             if (graph && selectedGraph?.key !== graph.key) {
//                 setSelectedGraph({ key: graph.key, title: graph.title });
//                 navigate(location.pathname, { replace: true, state: { from: location.state.from } });
//             }
//         }
//     }, [location.state, isLoggedIn, symbol, symbols, overlay, navigate]);

//     useEffect(() => {
//         const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//         const serializableSelectedGraph = selectedGraph ? { key: selectedGraph.key, title: selectedGraph.title } : null;
//         localStorage.setItem(storageKey, JSON.stringify({ activeTab, selectedGraph: serializableSelectedGraph }));
//     }, [activeTab, selectedGraph, symbol, tabContext]);

//     const getCachedData = (key) => {
//         const cached = localStorage.getItem(key);
//         if (!cached) return null;
//         try {
//             const { data, timestamp } = JSON.parse(cached);
//             if (Date.now() - timestamp > CACHE_TTL) {
//                 localStorage.removeItem(key);
//                 return null;
//             }
//             return data;
//         } catch (err) {
//             console.error(`Failed to parse cached data for ${key}:`, err);
//             localStorage.removeItem(key);
//             return null;
//         }
//     };

//     const setCachedData = (key, data) => {
//         try {
//             const serializedData = JSON.stringify({ data, timestamp: Date.now() });
//             if (serializedData.length > 1024 * 1024) {
//                 console.warn(`Data for ${key} exceeds 1MB, skipping cache.`);
//                 return;
//             }
//             localStorage.setItem(key, serializedData);
//         } catch (err) {
//             console.error(`Failed to cache data for ${key}:`, err);
//         }
//     };

//     const plotTypeMapping = {
//         'CandleSpread': 'candle_chronicle',
//         'PegyWormPlot': 'pegy', // Added for PegyWormPlot
//         'MacdPlot': 'macd',
//         'SensexCalculator': 'sensex_movement_corr_calculator',
//         'DelRate': 'market_mood',
//         'CandleBreach': 'breach_busters',
//         'LastTraded': 'box_plot',
//         'AvgBoxPlots': 'price_trend',
//         'WormsPlots': 'trend_tapestry',
//         'SensexStockCorrBar': 'sensex_stock_fluctuations',
//         'SensexVsStockCorr': 'sensex_symphony',
//         'HeatMap': 'performance_heatmap',
//         'IndustryBubble': 'pe_eps_book_value',
//         'PublicTradingActivityPlot': 'compute_public_trading_activity'
//     };

//     // Fetch average ratings for all graphs
//     const fetchAverageRating = async (plotType) => {
//         try {
//             const cacheKey = `rating_${plotType}`;
//             const cachedData = getCachedData(cacheKey);
//             if (cachedData) return cachedData;

//             const apiPlotType = plotTypeMapping[plotType] || plotType;
//             const fullUrl = `${API_BASE}/stocks/test/ratings/${apiPlotType}/average`;
//             console.log(`Fetching ratings for ${plotType} → API: ${apiPlotType}, URL: ${fullUrl}`);

//             const response = await fetch(fullUrl, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
//             console.log(`Response status for ${apiPlotType}: ${response.status}`);
//             if (!response.ok) {
//                 const errorText = await response.text();
//                 console.error(`Response body for ${apiPlotType}: ${errorText}`);
//                 if (errorText.includes('average_rating')) {
//                     console.warn(`API returned 400 with valid data for ${apiPlotType}: ${errorText}`);
//                     const data = JSON.parse(errorText);
//                     const processedData = {
//                         plotType,
//                         averageRating: data.average_rating || 0,
//                         totalRatings: data.total_ratings || 1,
//                         ratingBreakdown: data.rating_breakdown || { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
//                     };
//                     setCachedData(cacheKey, processedData);
//                     return processedData;
//                 }
//                 throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//             }

//             const data = await response.json();
//             const processedData = {
//                 plotType,
//                 averageRating: data.average_rating || 0,
//                 totalRatings: data.total_ratings || 1,
//                 ratingBreakdown: data.rating_breakdown || { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
//             };

//             setCachedData(cacheKey, processedData);
//             return processedData;
//         } catch (error) {
//             console.error(`Error fetching average rating for ${plotType} (API: ${plotTypeMapping[plotType] || plotType}):`, error);
//             return {
//                 plotType,
//                 averageRating: 0,
//                 totalRatings: 0,
//                 ratingBreakdown: { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
//             };
//         }
//     };

//     // Fetch all ratings when component mounts
//     useEffect(() => {
//         const fetchAllRatings = async () => {
//             const ratingsData = {};
//             for (const graph of graphSections) {
//                 const rating = await fetchAverageRating(graph.key);
//                 ratingsData[graph.key] = rating;
//             }
//             setRatings(ratingsData);
//         };

//         fetchAllRatings();
//     }, []);
//     useEffect(() => {
//         const fetchPlotData = async () => {
//             if (!symbol) {
//                 setGraphsLoaded(true);
//                 return;
//             }
//             const cacheKey = `plot_${symbol}_${timeRange}_${normalize}`;
//             const cachedData = getCachedData(cacheKey);
//             if (cachedData) {
//                 setPlotData((prev) => ({ ...prev, [symbol]: cachedData }));
//                 setGraphsLoaded(true);
//                 return;
//             }

//             try {
//                 const response = await fetch(`${API_BASE}/stocks/test/candle_chronicle`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         ...(getAuthToken && { Authorization: `Bearer ${getAuthToken()}` }),
//                     },
//                     body: JSON.stringify({ symbol, timeRange, normalize }),
//                 });

//                 if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//                 const data = await response.json();
//                 setPlotData((prev) => {
//                     const updated = { ...prev, [symbol]: { ...prev[symbol], [timeRange]: { [normalize ? 'normalized' : 'raw']: data } } };
//                     setCachedData(cacheKey, data);
//                     return updated;
//                 });
//                 setGraphsLoaded(true);
//             } catch (error) {
//                 // toast.error(error.message || 'Error fetching plot data');
//             }
//         };

//         fetchPlotData();
//     }, [symbol, timeRange, normalize, API_BASE, getAuthToken]);

//     // Enhanced graph sections with icons and categories
//     const graphSections = [
//         {
//             // title: "Candle Chronicles: Spread Patterns Over Time (TTM)",
//             title: "Price Spread Over Time",
//             description: "Visualizes the distribution of candlestick spread patterns over the past year.",
//             component: <CandleSpread symbol={symbol} />,
//             key: "CandleSpread",
//             image: candle_spread,
//             icon: <MdShowChart className="text-blue-500" />,
//             category: "Technical Analysis",
//             color: "blue"
//         },
//         {
//             title: "PEGY Worm Plot",
//             description: "Visualizes PEGY ratio trends to assess stock valuation based on earnings growth and yield.",
//             component: <PegyWormPlot symbol={symbol} />,
//             key: "PegyWormPlot",
//             image: PegyPlot,
//             icon: <FiBarChart2 className="text-cyan-500" />,
//             category: "Valuation Analysis",
//             color: "teal"
//         },
//         {
//             title: "MACD Analysis for TTM",
//             description: "Plots the MACD indicator to identify momentum over the last year.",
//             component: <MacdPlot symbol={symbol} />,
//             key: "MacdPlot",
//             image: Macd_Plot,
//             icon: <MdGridView className="text-red-500" />,
//             category: "Momentum",
//             color: "red"
//         },
//         {
//             title: "Sensex Calculator",
//             description: "A tool to calculate Sensex-related metrics for analysis.",
//             component: <SensexCalculator symbol={symbol} />,
//             key: "SensexCalculator",
//             image: Sensex_Calculator,
//             icon: <MdAnalytics className="text-lime-500" />,
//             category: "Tools",
//             color: "lime"
//         },
//         {
//             title: "Market Mood: Delivery Trends & Trading Sentiment",
//             description: "Analyzes delivery trends and trading sentiment over time.",
//             component: <DelRate symbol={symbol} />,
//             key: "DelRate",
//             image: Del_Rate,
//             icon: <MdTableChart className="text-teal-500" />,
//             category: "Sentiment Analysis",
//             color: "teal"
//         },
//         {
//             title: "Breach Busters: Analyzing High and Low Breaches",
//             description: "Examines instances of high and low price breaches.",
//             component: <CandleBreach symbol={symbol} />,
//             key: "CandleBreach",
//             image: Candle_Breach,
//             icon: <FaChartLine className="text-amber-500" />,
//             category: "Price Action",
//             color: "amber"
//         },
//         {
//             title: "Boxing Prices: TTM Box Plot for Trade Prices",
//             description: "Shows a box plot of trade prices over the last year with key levels.",
//             component: <LastTraded symbol={symbol} />,
//             key: "LastTraded",
//             image: Last_Traded,
//             icon: <MdBarChart className="text-green-500" />,
//             category: "Price Analysis",
//             color: "green"
//         },
//         {
//             title: "Price Trends in a Box: Monthly Ranges and Averages Explored (TTM)",
//             description: "Displays monthly price ranges and averages over the past year.",
//             component: <AvgBoxPlots symbol={symbol} />,
//             key: "AvgBoxPlots",
//             image: AvgBox_Plots,
//             icon: <FiTrendingUp className="text-purple-500" />,
//             category: "Trend Analysis",
//             color: "purple"
//         },
//         {
//             title: "Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends",
//             description: "Analyzes weekly trade delivery patterns during market trends.",
//             component: <WormsPlots symbol={symbol} />,
//             key: "WormsPlots",
//             image: Worms_Plots,
//             icon: <FiMap className="text-orange-500" />,
//             category: "Volume Analysis",
//             color: "orange"
//         },
//         {
//             title: "Sensex & Stock Fluctuations",
//             description: "Compares monthly percentage changes between Sensex and the stock.",
//             component: <SensexStockCorrBar symbol={symbol} />,
//             key: "SensexStockCorrBar",
//             image: Sensex_StockCorrBar,
//             icon: <FiBarChart2 className="text-cyan-500" />,
//             category: "Market Correlation",
//             color: "cyan"
//         },
//         {
//             title: "Sensex Symphony: Harmonizing Stock Correlation Trends (TTM)",
//             description: "Visualizes correlation trends between Sensex and the stock.",
//             component: <SensexVsStockCorr symbol={symbol} />,
//             key: "SensexVsStockCorr",
//             image: Sensex_VsStockCorr,
//             icon: <MdPieChart className="text-indigo-500" />,
//             category: "Correlation Analysis",
//             color: "indigo"
//         },
//         {
//             title: `Performance Heatmap: Nifty50 vs BSE vs ${symbol}`,
//             description: "A heatmap comparing performance across Nifty50, BSE, and the stock.",
//             component: <HeatMap symbol={symbol} />,
//             key: "HeatMap",
//             image: Heat_Map,
//             icon: <FiPieChart className="text-pink-500" />,
//             category: "Market Comparison",
//             color: "pink"
//         },
//         {
//             title: "PE vs EPS vs Book Value: Gladiators in the Industry Arena",
//             description: "Compares PE, EPS, and Book Value within the industry context.",
//             component: <IndustryBubble symbol={symbol} />,
//             key: "IndustryBubble",
//             image: Industry_Bubble,
//             icon: <MdSwapHoriz className="text-emerald-500" />,
//             category: "Fundamental Analysis",
//             color: "emerald"
//         },
//         {
//             title: "Public Trading Activity: Market Pulse in Action",
//             description: "Visualizes live trading dynamics, showing price movements, trading volume, and overall market activity for the selected stock.",
//             component: <PublicTradingActivityPlot symbol={symbol} />,
//             key: "PublicTradingActivityPlot",
//             image: PublicTrading_Activity, // update to a relevant image if available
//             icon: <MdShowChart className="text-emerald-500" />, // chart-like icon fits better
//             category: "Market Analysis",
//             color: "emerald",
//         },
//     ];

//     const handleGraphSelect = (graph, index) => {
//         if (!isLoggedIn && !graphSections.slice(0, MAX_VISIBLE_GRAPHS).some((g) => g.key === graph.key)) {
//             navigate('/login', { state: { from: location.pathname, graphKey: graph.key } });
//             return;
//         }
//         if (selectedGraph && selectedGraph.key === graph.key) {
//             setSelectedGraph(null);
//         } else {
//             setSelectedGraph({ key: graph.key, title: graph.title });
//         }
//     };

//     const handleClearSelection = () => setSelectedGraph(null);

//     const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

//     // Enhanced Custom Arrows
//     const PrevArrow = ({ onClick }) => (
//         <button
//             onClick={onClick}
//             className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-white p-3 rounded-full hover:bg-white dark:hover:bg-slate-700  border border-slate-200 dark:border-slate-600 transition-all duration-300 hover:scale-110 z-20 backdrop-blur-sm"
//             aria-label="Previous Graph"
//         >
//             <FaArrowLeft className="w-4 h-4" />
//         </button>
//     );

//     const NextArrow = ({ onClick }) => (
//         <button
//             onClick={onClick}
//             className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-white p-3 rounded-full hover:bg-white dark:hover:bg-slate-700  border border-slate-200 dark:border-slate-600 transition-all duration-300 hover:scale-110 z-20 backdrop-blur-sm"
//             aria-label="Next Graph"
//         >
//             <FaArrowRight className="w-4 h-4" />
//         </button>
//     );

//     const sliderSettings = {
//         dots: false,
//         infinite: false,
//         speed: 500,
//         slidesToShow: 1,
//         slidesToScroll: 1,
//         arrows: false,
//         appendDots: dots => (
//             <div className="bg-white/80 dark:bg-slate-800/80 rounded-full px-4 py-2 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
//                 <ul className="flex space-x-2"> {dots} </ul>
//             </div>
//         ),
//         customPaging: i => (
//             <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full transition-all duration-300 hover:bg-slate-400 dark:hover:bg-slate-500" />
//         )
//     };

//     const getColorClasses = (color) => {
//         const colorMap = {
//             blue: 'from-blue-200 to-blue-200',
//             green: 'from-green-200 to-green-200',
//             purple: 'from-purple-200 to-purple-200',
//             orange: 'from-orange-200 to-orange-200',
//             red: 'from-red-200 to-red-200',
//             cyan: 'from-cyan-200 to-cyan-200',
//             indigo: 'from-indigo-200 to-indigo-200',
//             pink: 'from-pink-200 to-pink-200',
//             teal: 'from-teal-200 to-teal-200',
//             amber: 'from-amber-200 to-amber-200',
//             lime: 'from-lime-200 to-lime-200',
//             emerald: 'from-emerald-200 to-emerald-200'
//         };
//         return colorMap[color] || 'from-slate-200 to-slate-200';
//     };

//     const renderGraphTabContent = () => {
//         if (selectedGraph) {
//             const initialSlide = graphSections.findIndex((g) => g.key === selectedGraph.key);

//             return (
//                 <div
//                     className={`${isFullWidth ? 'w-full' : 'w-auto'
//                         } transition-all duration-300 p-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-900 p-0' : ''
//                         }`}
//                 >
//                     {/* Graph Viewer Header */}
//                     <div
//                         className={`flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl ${isFullscreen ? 'rounded-none border-b border-slate-200 dark:border-slate-700' : ''
//                             }`}
//                     >
//                         <div className="flex items-center gap-4">
//                             <button
//                                 onClick={handleClearSelection}
//                                 className="flex items-center gap-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-white px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200 border border-slate-200 dark:border-slate-600"
//                             >
//                                 <FaArrowLeft className="w-4 h-4" />
//                                 Back to Gallery
//                             </button>

//                         </div>

//                     </div>

//                     {/* Graph Slider */}
//                     <div className={`${isFullscreen ? 'h-[calc(100vh-250px)]' : 'h-[900px] '} relative`}>
//                         <Slider
//                             {...sliderSettings}
//                             ref={sliderRef}
//                             initialSlide={initialSlide}
//                             afterChange={(index) => {
//                                 const newGraph = graphSections[index];
//                                 setSelectedGraph({ key: newGraph.key, title: newGraph.title });
//                             }}
//                             prevArrow={<PrevArrow />}
//                             nextArrow={<NextArrow />}
//                             arrows={true}
//                         >
//                             {graphSections.map((graph) => (
//                                 <div
//                                     key={graph.key}
//                                     className="relative dark:bg-slate-800  p-6 h-full"
//                                 >
//                                     <div className="flex items-center justify-between mb-6">
//                                         <div>
//                                             <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
//                                                 {graph.title}
//                                             </h2>
//                                             {/* Add rating in slider view */}
//                                             {ratings[graph.key] && (
//                                                 <div className="flex items-center gap-2 mt-2">
//                                                     <RatingStars rating={ratings[graph.key].averageRating} size="lg" />

//                                                 </div>
//                                             )}
//                                         </div>
//                                         <span
//                                             className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getColorClasses(
//                                                 graph.color
//                                             )} text-black`}
//                                         >
//                                             {graph.category}
//                                         </span>
//                                     </div>
//                                     <div className="w-full h-[700px]">
//                                         {graph.component}
//                                     </div>
//                                 </div>
//                             ))}
//                         </Slider>
//                     </div>
//                 </div>
//             );
//         }

//         return (
//             <div className="w-full transition-all duration-300">
//                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
//                     {graphSections.map(({ title, description, key, image, icon, category, color }, index) => {
//                         const isVisible = isLoggedIn || index < MAX_VISIBLE_GRAPHS;

//                         return (
//                             <div
//                                 key={key}
//                                 className={`group relative bg-zinc-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${!isVisible ? 'opacity-80' : ''
//                                     }`}
//                                 onClick={() =>
//                                     isVisible
//                                         ? handleGraphSelect({ title, key }, index)
//                                         : navigate('/login', { state: { from: location.pathname, graphKey: key } })
//                                 }
//                                 role="button"
//                                 tabIndex={0}
//                                 onKeyDown={(e) => e.key === 'Enter' &&
//                                     (isVisible
//                                         ? handleGraphSelect({ title, key }, index)
//                                         : navigate('/login', { state: { from: location.pathname, graphKey: key } }))
//                                 }
//                             >
//                                 {/* Image Header */}
//                                 <div className="relative h-40 overflow-hidden">
//                                     <img
//                                         src={image}
//                                         alt={title}
//                                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                                     />
//                                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

//                                     {/* Category Badge */}
//                                     <div className="absolute top-3 left-3">
//                                         <span className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-black/60 backdrop-blur-sm border border-white/20`}>
//                                             {category}
//                                         </span>
//                                     </div>

//                                     {/* Hover Action */}
//                                     <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
//                                         <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
//                                             <FaEye className="w-3 h-3 text-slate-700 dark:text-slate-300" />
//                                             <span className="text-xs font-medium text-slate-700 dark:text-slate-300">View Graph</span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Content */}
//                                 <div className="p-5">
//                                     <div className="flex items-start gap-3 mb-3">
//                                         {/* Icon */}
//                                         <div className={`p-2.5 rounded-xl bg-gradient-to-br ${getColorClasses(color)} shadow-lg flex-shrink-0`}>
//                                             <div className="text-white text-lg">
//                                                 {icon}
//                                             </div>
//                                         </div>

//                                         {/* Title & Rating */}
//                                         <div className="flex-1 min-w-0">
//                                             <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-2 line-clamp-2">
//                                                 {title}
//                                             </h3>

//                                             {/* Rating Section */}
//                                             {ratings[key] && (
//                                                 <div className="flex items-center gap-3 mt-2">
//                                                     <div className="flex items-center gap-1.5">
//                                                         <div className="flex items-center">
//                                                             <RatingStars
//                                                                 rating={ratings[key].averageRating}
//                                                                 size="lg"
//                                                             />
//                                                         </div>

//                                                     </div>
//                                                     <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
//                                                     <span className="text-xs text-slate-600 dark:text-slate-400">
//                                                         Based on user ratings
//                                                     </span>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     {/* Description */}
//                                     <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
//                                         {description}
//                                     </p>

//                                     {/* Footer */}
//                                     <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
//                                         <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
//                                             Explore Insights
//                                         </span>
//                                         <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
//                                             <span className="text-xs font-medium">View</span>
//                                             <FaChevronRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Premium Overlay */}
//                                 {!isVisible && (
//                                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm rounded-xl z-10 p-6">
//                                         <div className="text-center">
//                                             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
//                                                 <FaUserLock className="w-6 h-6 text-white" />
//                                             </div>
//                                             <h4 className="text-white font-bold text-lg mb-2">
//                                                 Premium Feature
//                                             </h4>
//                                             <p className="text-slate-300 text-sm mb-4 leading-relaxed">
//                                                 Unlock advanced analytics and insights by logging in
//                                             </p>
//                                             <button className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-full text-sm font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95">
//                                                 Login to Unlock
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         );
//     };

//     const renderCandlePatternTabContent = () => (
//         <div className="w-full dark:bg-slate-800 rounded-2xl p-6">
//             <CandlePattern symbol={symbol} />
//         </div>
//     );

//     const renderFinanceTabContent = () => (
//         <div className="w-full dark:bg-slate-800 rounded-2xl ">
//             <FinancialTab symbol={symbol} />
//             {/* <FinancialRatingSystem plotType={symbol} onRatingUpdate={(rating) => console.log(`Financial rating for ${symbol}: ${rating}`)} /> */}
//         </div>
//     );

//     const renderShareHoldingTabContent = () => (
//         <div className="w-full dark:bg-slate-800 rounded-2xl p-6">
//             <Shareholding symbol={symbol} />
//         </div>
//     );

//     // const PublicTradingActivityTabContent = () => (
//     //     <div className="w-full dark:bg-slate-800 rounded-2xl p-6">
//     //         <PublicTradingActivityPlot symbol={symbol} />
//     //     </div>
//     // );

//     // Enhanced Tab Configuration
//     const tabs = [
//         {
//             id: 'graphs',
//             label: 'Data Analysis',
//             icon: <MdAnalytics className="w-5 h-5" />,
//             description: 'Interactive charts and visualizations'
//         },
//         {
//             id: 'candle_pattern',
//             label: 'Candle Patterns',
//             icon: <FaChartLine className="w-5 h-5" />,
//             description: 'Candlestick pattern analysis'
//         },
//         {
//             id: 'finance',
//             label: 'Financials',
//             icon: <MdAttachMoney className="w-5 h-5" />,
//             description: 'Financial statements & metrics'
//         },
//         {
//             id: 'Shareholding',
//             label: 'Shareholding',
//             icon: <FaUserTie className="w-5 h-5" />,
//             description: 'Ownership structure analysis'
//         },
//         // {
//         //     id: 'PublicTradingActivityPlot',
//         //     label: 'Trading Activity',
//         //     icon: <MdSwapHoriz className="w-5 h-5" />,
//         //     description: 'Public trading insights'
//         // }
//     ];

//     return (
//         <div className="font-sans w-full dark:bg-slate-800">
//             <div className="container mx-auto px-4 py-8">
//                 {/* Enhanced Tab Navigation */}
//                 <div className="flex flex-col items-center mb-8">
//                     <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 text-center">
//                         Advanced Stock Analysis
//                     </h2>
//                     <p className="text-slate-600 dark:text-slate-300 text-center mb-8 max-w-2xl">
//                         Comprehensive tools and visualizations for in-depth market analysis of {symbol}
//                     </p>

//                     <div className="dark:bg-slate-800/80 backdrop-blur-lg rounded-xl p-2 border border-slate-200/50 dark:border-slate-700/50 shadow-sm w-full max-w-6xl">
//                         <div className="flex flex-wrap justify-center gap-1">
//                             {tabs.map((tab) => (
//                                 <button
//                                     key={tab.id}
//                                     role="tab"
//                                     aria-selected={activeTab === tab.id}
//                                     aria-controls={`${tab.id}-tabpanel`}
//                                     id={`${tab.id}-tab`}
//                                     onClick={() => setActiveTab(tab.id)}
//                                     className={`relative flex flex-col items-center px-4 py-2 rounded-xl transition-all duration-300 ease-in-out min-w-[120px] group ${activeTab === tab.id
//                                         ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-blue-500/25'
//                                         : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
//                                         }`}
//                                 >
//                                     <div
//                                         className={`mb-2 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
//                                             }`}
//                                     >
//                                         {tab.icon}
//                                     </div>
//                                     <span className="font-bold text-sm mb-1">{tab.label}</span>
//                                     <span className="text-xs opacity-80">{tab.description}</span>

//                                     {activeTab === tab.id && (
//                                         <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full animate-pulse"></div>
//                                     )}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Tab Content */}
//                 <div
//                     id={`${activeTab}-tabpanel`}
//                     aria-labelledby={`${activeTab}-tab`}
//                     role="tabpanel"
//                     className="dark:bg-slate-900/95 backdrop-blur-md transition-all duration-500 ease-in-out overflow-hidden"
//                 >
//                     <div className="p-3 animate-fade-in">
//                         {activeTab === 'graphs' && renderGraphTabContent()}
//                         {activeTab === 'candle_pattern' && renderCandlePatternTabContent()}
//                         {activeTab === 'finance' && renderFinanceTabContent()}
//                         {activeTab === 'Shareholding' && renderShareHoldingTabContent()}
//                         {/* {activeTab === 'PublicTradingActivityPlot' && PublicTradingActivityTabContent()} */}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default GraphSlider;

// import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
// import Slider from 'react-slick';
// import CandleBreach from './CandleBreach';
// import LastTraded from './LastTraded';
// import AvgBoxPlots from './AvgBoxPlots';
// import WormsPlots from './WormsPlots';
// import SensexStockCorrBar from './SensexVsStockCorrBar';
// import SensexVsStockCorr from './SensexVsStockCorr';
// import HeatMap from './HeatMap';
// import DelRate from './DelRate';
// import VoltyPlot from './VoltyPlot';
// import IndustryBubble from './IndustryBubble';
// import SensexCalculator from './SensexCalculator';
// import MacdPlot from './MacdPlot';
// import CandleSpread from './CandleSpreadDistribution';
// import PublicTradingActivityPlot from './PublicTradingActivityPlot';
// import CandlePattern from './CandlePattern';
// import Shareholding from './Shareholding';
// import FinancialTab from './FinancialTab';
// import PegyWormPlot from './PegyWormPlot';
// import toast from 'react-hot-toast';
// import {
//     FaArrowLeft,
//     FaArrowRight,
//     FaChartLine,
//     FaUserLock,
//     FaUserTie,
//     FaChevronRight,
//     FaPlay,
//     FaTimes,
//     FaExpand,
//     FaEye,
//     FaComment
// } from 'react-icons/fa';
// import {
//     MdAnalytics,
//     MdAttachMoney,
//     MdSwapHoriz,
//     MdGridView,
//     MdBarChart,
//     MdShowChart,
//     MdPieChart,
//     MdTableChart,
//     MdOutlineStarHalf
// } from 'react-icons/md';
// import {
//     FiBarChart2,
//     FiTrendingUp,
//     FiPieChart,
//     FiMap
// } from 'react-icons/fi';
// import { useAuth } from '../AuthContext';
// import { useLocation, useNavigate } from 'react-router-dom';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// // Import graph thumbnails
// import candle_spread from '/public/equityhub_plot/candle_spread1.png';
// import Industry_Bubble from '/public/equityhub_plot/industry_bubble1.png';
// import Sensex_Calculator from '/public/equityhub_plot/sensex_calculator1.png';
// import Volty_Plot from '/public/assets/graph12.png';
// import Candle_Breach from '/public/equityhub_plot/Screenshot 2025-09-24 110817.png';
// import Del_Rate from '/public/equityhub_plot/delivery_rate1.png';
// import Heat_Map from '/public/equityhub_plot/heatmap1.png';
// import Sensex_VsStockCorr from '/public/equityhub_plot/sensex_analylis1.png';
// import Sensex_StockCorrBar from '/public/equityhub_plot/sensex_and_stock1.png';
// import Macd_Plot from '/public/equityhub_plot/macd_plot1.png';
// import Worms_Plots from '/public/equityhub_plot/weekly_tade_delivery1.png';
// import AvgBox_Plots from '/public/equityhub_plot/avgbox_plot1.png';
// import Last_Traded from '/public/equityhub_plot/box_plot1.png';
// import PegyPlot from '/public/equityhub_plot/pegyplot.png';
// import PublicTrading_Activity from '/public/equityhub_plot/PublicTrading_Activity.png';

// import { MdStar, MdStarHalf, MdStarOutline } from 'react-icons/md';
// import Review from './Review';

// // Memoized RatingStars component
// const RatingStars = React.memo(({ rating, size = "lg" }) => {
//     const effectiveRating = useMemo(() => {
//         let ratingValue = rating;
//         if (isNaN(ratingValue) || ratingValue === null || ratingValue === undefined) {
//             ratingValue = 0;
//         }
//         return Math.max(0, Math.min(5, ratingValue));
//     }, [rating]);

//     const { fullStars, hasHalfStar, emptyStars, isWholeNumber } = useMemo(() => {
//         const fullStars = Math.floor(effectiveRating);
//         const hasHalfStar = effectiveRating % 1 >= 0.25 && effectiveRating % 1 < 0.75;
//         const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
//         const isWholeNumber = effectiveRating % 1 === 0;

//         return { fullStars, hasHalfStar, emptyStars, isWholeNumber };
//     }, [effectiveRating]);

//     const sizeClasses = useMemo(() => ({
//         sm: "text-base",
//         md: "text-xl",
//         lg: "text-2xl"
//     }), []);

//     const textSizes = useMemo(() => ({
//         sm: "text-xs",
//         md: "text-sm",
//         lg: "text-base"
//     }), []);

//     return (
//         <div className="flex items-center gap-1">
//             {[...Array(fullStars)].map((_, i) => (
//                 <MdStar
//                     key={`full-${i}`}
//                     className={`${sizeClasses[size]} text-yellow-400`}
//                 />
//             ))}

//             {hasHalfStar && (
//                 <MdStarHalf className={`${sizeClasses[size]} text-yellow-400`} />
//             )}

//             {[...Array(emptyStars)].map((_, i) => (
//                 <MdStarOutline
//                     key={`empty-${i}`}
//                     className={`${sizeClasses[size]} text-gray-300`}
//                 />
//             ))}

//             <span className={`ml-2 font-semibold ${textSizes[size]} text-slate-700 dark:text-slate-300`}>
//                 {isWholeNumber ? effectiveRating.toFixed(0) : effectiveRating.toFixed(1)}
//             </span>
//         </div>
//     );
// });

// RatingStars.displayName = 'RatingStars';

// const GraphSlider = ({ symbol, symbols, isFullWidth, timeRange = '1Y', normalize = false, overlay = false, tabContext = 'equityHub', getAuthToken }) => {
//     const { isLoggedIn } = useAuth();
//     const location = useLocation();
//     const navigate = useNavigate();

//     // State initialization with useMemo for derived values
//     const [activeTab, setActiveTab] = useState(() => {
//         const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//         const saved = localStorage.getItem(storageKey);
//         return saved ? JSON.parse(saved).activeTab || 'graphs' : 'graphs';
//     });

//     const [selectedGraph, setSelectedGraph] = useState(() => {
//         const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//         const saved = localStorage.getItem(storageKey);
//         return saved ? JSON.parse(saved).selectedGraph || null : null;
//     });

//     const [plotData, setPlotData] = useState(() => {
//         const saved = localStorage.getItem('plotData');
//         return saved ? JSON.parse(saved) : {};
//     });

//     const [ratings, setRatings] = useState({});
//     const [graphsLoaded, setGraphsLoaded] = useState(false);
//     const [error, setError] = useState(null);
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const sliderRef = useRef(null);

//     const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//     const CACHE_TTL = 60 * 60 * 1000;
//     const MAX_VISIBLE_GRAPHS = 5;

//     // Memoized constants
//     const plotTypeMapping = useMemo(() => ({
//         'CandleSpread': 'candle_chronicle',
//         'PegyWormPlot': 'pegy',
//         'MacdPlot': 'macd',
//         'SensexCalculator': 'sensex_movement_corr_calculator',
//         'DelRate': 'market_mood',
//         'CandleBreach': 'breach_busters',
//         'LastTraded': 'box_plot',
//         'AvgBoxPlots': 'price_trend',
//         'WormsPlots': 'trend_tapestry',
//         'SensexStockCorrBar': 'sensex_stock_fluctuations',
//         'SensexVsStockCorr': 'sensex_symphony',
//         'HeatMap': 'performance_heatmap',
//         'IndustryBubble': 'pe_eps_book_value',
//         'PublicTradingActivityPlot': 'compute_public_trading_activity'
//     }), []);

//     // Cache utilities with useCallback
//     const getCachedData = useCallback((key) => {
//         const cached = localStorage.getItem(key);
//         if (!cached) return null;
//         try {
//             const { data, timestamp } = JSON.parse(cached);
//             if (Date.now() - timestamp > CACHE_TTL) {
//                 localStorage.removeItem(key);
//                 return null;
//             }
//             return data;
//         } catch (err) {
//             console.error(`Failed to parse cached data for ${key}:`, err);
//             localStorage.removeItem(key);
//             return null;
//         }
//     }, []);

//     const setCachedData = useCallback((key, data) => {
//         try {
//             const serializedData = JSON.stringify({ data, timestamp: Date.now() });
//             if (serializedData.length > 1024 * 1024) {
//                 console.warn(`Data for ${key} exceeds 1MB, skipping cache.`);
//                 return;
//             }
//             localStorage.setItem(key, serializedData);
//         } catch (err) {
//             console.error(`Failed to cache data for ${key}:`, err);
//         }
//     }, []);

//     // Rating update handler with useCallback
//     const handleRatingUpdate = useCallback((plotType) => {
//         const fetchUpdatedRating = async () => {
//             const updatedRating = await fetchAverageRating(plotType);
//             setRatings(prev => ({ ...prev, [plotType]: updatedRating }));
//         };
//         fetchUpdatedRating();
//     }, []);

//     // Fetch average ratings with useCallback
//     const fetchAverageRating = useCallback(async (plotType) => {
//         try {
//             const cacheKey = `rating_${plotType}`;
//             const cachedData = getCachedData(cacheKey);
//             if (cachedData) return cachedData;

//             const apiPlotType = plotTypeMapping[plotType] || plotType;
//             const fullUrl = `${API_BASE}/stocks/test/ratings/${apiPlotType}/average`;

//             const response = await fetch(fullUrl, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 const errorText = await response.text();
//                 if (errorText.includes('average_rating')) {
//                     const data = JSON.parse(errorText);
//                     const processedData = {
//                         plotType,
//                         averageRating: data.average_rating || 0,
//                         totalRatings: data.total_ratings || 1,
//                         ratingBreakdown: data.rating_breakdown || { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
//                     };
//                     setCachedData(cacheKey, processedData);
//                     return processedData;
//                 }
//                 throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//             }

//             const data = await response.json();
//             const processedData = {
//                 plotType,
//                 averageRating: data.average_rating || 0,
//                 totalRatings: data.total_ratings || 1,
//                 ratingBreakdown: data.rating_breakdown || { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
//             };

//             setCachedData(cacheKey, processedData);
//             return processedData;
//         } catch (error) {
//             console.error(`Error fetching average rating for ${plotType}:`, error);
//             return {
//                 plotType,
//                 averageRating: 0,
//                 totalRatings: 0,
//                 ratingBreakdown: { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
//             };
//         }
//     }, [API_BASE, getCachedData, setCachedData, plotTypeMapping]);

//     // Fetch all ratings when component mounts or when login status changes
//     useEffect(() => {
//         const fetchAllRatings = async () => {
//             const ratingsData = {};
//             for (const graph of graphSections) {
//                 const rating = await fetchAverageRating(graph.key);
//                 ratingsData[graph.key] = rating;
//             }
//             setRatings(ratingsData);
//         };

//         fetchAllRatings();
//     }, [fetchAverageRating, isLoggedIn]); // Added isLoggedIn dependency

//     // Fetch plot data with dependency optimization
//     useEffect(() => {
//         const fetchPlotData = async () => {
//             if (!symbol) {
//                 setGraphsLoaded(true);
//                 return;
//             }

//             const cacheKey = `plot_${symbol}_${timeRange}_${normalize}`;
//             const cachedData = getCachedData(cacheKey);

//             if (cachedData) {
//                 setPlotData((prev) => ({ ...prev, [symbol]: cachedData }));
//                 setGraphsLoaded(true);
//                 return;
//             }

//             try {
//                 const response = await fetch(`${API_BASE}/stocks/test/candle_chronicle`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         ...(getAuthToken && { Authorization: `Bearer ${getAuthToken()}` }),
//                     },
//                     body: JSON.stringify({ symbol, timeRange, normalize }),
//                 });

//                 if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//                 const data = await response.json();

//                 setPlotData((prev) => {
//                     const updated = {
//                         ...prev,
//                         [symbol]: {
//                             ...prev[symbol],
//                             [timeRange]: {
//                                 [normalize ? 'normalized' : 'raw']: data
//                             }
//                         }
//                     };
//                     setCachedData(cacheKey, data);
//                     return updated;
//                 });
//                 setGraphsLoaded(true);
//             } catch (error) {
//                 console.error('Error fetching plot data:', error);
//                 setGraphsLoaded(true);
//             }
//         };

//         fetchPlotData();
//     }, [symbol, timeRange, normalize, API_BASE, getAuthToken, getCachedData, setCachedData]);

//     // Restore selected graph from location.state after login
//     useEffect(() => {
//         if (location.state?.graphKey && isLoggedIn) {
//             const graph = graphSections.find((g) => g.key === location.state.graphKey);
//             if (graph && selectedGraph?.key !== graph.key) {
//                 setSelectedGraph({ key: graph.key, title: graph.title });
//                 navigate(location.pathname, {
//                     replace: true,
//                     state: { from: location.state.from }
//                 });
//             }
//         }
//     }, [location.state, isLoggedIn, symbol, navigate]);

//     // Persist state to localStorage
//     useEffect(() => {
//         const storageKey = tabContext === 'equityHub' ? 'equityHubLastGraph' : `mySearchLastGraph_${symbol}`;
//         const serializableSelectedGraph = selectedGraph ? {
//             key: selectedGraph.key,
//             title: selectedGraph.title
//         } : null;

//         localStorage.setItem(storageKey, JSON.stringify({
//             activeTab,
//             selectedGraph: serializableSelectedGraph
//         }));
//     }, [activeTab, selectedGraph, symbol, tabContext]);

//     // Memoized graph sections configuration
//     const graphSections = useMemo(() => [
//         {
//             title: "Price Spread Over Time",
//             description: "Visualizes the distribution of candlestick spread patterns over the past year.",
//             component: <CandleSpread symbol={symbol} key="candle-spread" />,
//             key: "CandleSpread",
//             image: candle_spread,
//             icon: <MdShowChart className="text-blue-500" />,
//             category: "Technical Analysis",
//             color: "blue"
//         },
//         {
//             title: "PEGY Worm Plot",
//             description: "Visualizes PEGY ratio trends to assess stock valuation based on earnings growth and yield.",
//             component: <PegyWormPlot symbol={symbol} key="pegy-worm" />,
//             key: "PegyWormPlot",
//             image: PegyPlot,
//             icon: <FiBarChart2 className="text-cyan-500" />,
//             category: "Valuation Analysis",
//             color: "teal"
//         },
//         {
//             title: "MACD Analysis for TTM",
//             description: "Plots the MACD indicator to identify momentum over the last year.",
//             component: <MacdPlot symbol={symbol} key="macd-plot" />,
//             key: "MacdPlot",
//             image: Macd_Plot,
//             icon: <MdGridView className="text-red-500" />,
//             category: "Momentum",
//             color: "red"
//         },
//         {
//             title: "Sensex Calculator",
//             description: "A tool to calculate Sensex-related metrics for analysis.",
//             component: <SensexCalculator symbol={symbol} key="sensex-calc" />,
//             key: "SensexCalculator",
//             image: Sensex_Calculator,
//             icon: <MdAnalytics className="text-lime-500" />,
//             category: "Tools",
//             color: "lime"
//         },
//         {
//             title: "Market Mood: Delivery Trends & Trading Sentiment",
//             description: "Analyzes delivery trends and trading sentiment over time.",
//             component: <DelRate symbol={symbol} key="del-rate" />,
//             key: "DelRate",
//             image: Del_Rate,
//             icon: <MdTableChart className="text-teal-500" />,
//             category: "Sentiment Analysis",
//             color: "teal"
//         },
//         {
//             title: "Breach Busters: Analyzing High and Low Breaches",
//             description: "Examines instances of high and low price breaches.",
//             component: <CandleBreach symbol={symbol} key="candle-breach" />,
//             key: "CandleBreach",
//             image: Candle_Breach,
//             icon: <FaChartLine className="text-amber-500" />,
//             category: "Price Action",
//             color: "amber"
//         },
//         {
//             title: "Boxing Prices: TTM Box Plot for Trade Prices",
//             description: "Shows a box plot of trade prices over the last year with key levels.",
//             component: <LastTraded symbol={symbol} key="last-traded" />,
//             key: "LastTraded",
//             image: Last_Traded,
//             icon: <MdBarChart className="text-green-500" />,
//             category: "Price Analysis",
//             color: "green"
//         },
//         {
//             title: "Price Trends in a Box: Monthly Ranges and Averages Explored (TTM)",
//             description: "Displays monthly price ranges and averages over the past year.",
//             component: <AvgBoxPlots symbol={symbol} key="avg-box" />,
//             key: "AvgBoxPlots",
//             image: AvgBox_Plots,
//             icon: <FiTrendingUp className="text-purple-500" />,
//             category: "Trend Analysis",
//             color: "purple"
//         },
//         {
//             title: "Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends",
//             description: "Analyzes weekly trade delivery patterns during market trends.",
//             component: <WormsPlots symbol={symbol} key="worms-plot" />,
//             key: "WormsPlots",
//             image: Worms_Plots,
//             icon: <FiMap className="text-orange-500" />,
//             category: "Volume Analysis",
//             color: "orange"
//         },
//         {
//             title: "Sensex & Stock Fluctuations",
//             description: "Compares monthly percentage changes between Sensex and the stock.",
//             component: <SensexStockCorrBar symbol={symbol} key="sensex-corr-bar" />,
//             key: "SensexStockCorrBar",
//             image: Sensex_StockCorrBar,
//             icon: <FiBarChart2 className="text-cyan-500" />,
//             category: "Market Correlation",
//             color: "cyan"
//         },
//         {
//             title: "Sensex Symphony: Harmonizing Stock Correlation Trends (TTM)",
//             description: "Visualizes correlation trends between Sensex and the stock.",
//             component: <SensexVsStockCorr symbol={symbol} key="sensex-vs-stock" />,
//             key: "SensexVsStockCorr",
//             image: Sensex_VsStockCorr,
//             icon: <MdPieChart className="text-indigo-500" />,
//             category: "Correlation Analysis",
//             color: "indigo"
//         },
//         {
//             title: `Performance Heatmap: Nifty50 vs BSE vs ${symbol}`,
//             description: "A heatmap comparing performance across Nifty50, BSE, and the stock.",
//             component: <HeatMap symbol={symbol} key="heatmap" />,
//             key: "HeatMap",
//             image: Heat_Map,
//             icon: <FiPieChart className="text-pink-500" />,
//             category: "Market Comparison",
//             color: "pink"
//         },
//         {
//             title: "PE vs EPS vs Book Value: Gladiators in the Industry Arena",
//             description: "Compares PE, EPS, and Book Value within the industry context.",
//             component: <IndustryBubble symbol={symbol} key="industry-bubble" />,
//             key: "IndustryBubble",
//             image: Industry_Bubble,
//             icon: <MdSwapHoriz className="text-emerald-500" />,
//             category: "Fundamental Analysis",
//             color: "emerald"
//         },
//         {
//             title: "Public Trading Activity: Market Pulse in Action",
//             description: "Visualizes live trading dynamics, showing price movements, trading volume, and overall market activity for the selected stock.",
//             component: <PublicTradingActivityPlot symbol={symbol} key="public-trading" />,
//             key: "PublicTradingActivityPlot",
//             image: PublicTrading_Activity,
//             icon: <MdShowChart className="text-emerald-500" />,
//             category: "Market Analysis",
//             color: "emerald",
//         },
//     ], [symbol]);

//     // Memoized event handlers
//     const handleGraphSelect = useCallback((graph, index) => {
//         if (!isLoggedIn && !graphSections.slice(0, MAX_VISIBLE_GRAPHS).some((g) => g.key === graph.key)) {
//             navigate('/login', { state: { from: location.pathname, graphKey: graph.key } });
//             return;
//         }
//         if (selectedGraph && selectedGraph.key === graph.key) {
//             setSelectedGraph(null);
//         } else {
//             setSelectedGraph({ key: graph.key, title: graph.title });
//         }
//     }, [isLoggedIn, graphSections, selectedGraph, navigate, location.pathname]);

//     const handleClearSelection = useCallback(() => setSelectedGraph(null), []);
//     const toggleFullscreen = useCallback(() => setIsFullscreen(prev => !prev), []);

//     // Memoized slider arrows
//     const PrevArrow = useCallback(({ onClick }) => (
//         <button
//             onClick={onClick}
//             className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-white p-3 rounded-full hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-all duration-300 hover:scale-110 z-20 backdrop-blur-sm"
//             aria-label="Previous Graph"
//         >
//             <FaArrowLeft className="w-4 h-4" />
//         </button>
//     ), []);

//     const NextArrow = useCallback(({ onClick }) => (
//         <button
//             onClick={onClick}
//             className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-white p-3 rounded-full hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-all duration-300 hover:scale-110 z-20 backdrop-blur-sm"
//             aria-label="Next Graph"
//         >
//             <FaArrowRight className="w-4 h-4" />
//         </button>
//     ), []);

//     // Memoized slider settings
//     const sliderSettings = useMemo(() => ({
//         dots: false,
//         infinite: false,
//         speed: 500,
//         slidesToShow: 1,
//         slidesToScroll: 1,
//         arrows: false,
//         appendDots: dots => (
//             <div className="bg-white/80 dark:bg-slate-800/80 rounded-full px-4 py-2 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
//                 <ul className="flex space-x-2"> {dots} </ul>
//             </div>
//         ),
//         customPaging: i => (
//             <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full transition-all duration-300 hover:bg-slate-400 dark:hover:bg-slate-500" />
//         )
//     }), []);

//     // Memoized color classes utility
//     const getColorClasses = useCallback((color) => {
//         const colorMap = {
//             blue: 'from-blue-200 to-blue-200',
//             green: 'from-green-200 to-green-200',
//             purple: 'from-purple-200 to-purple-200',
//             orange: 'from-orange-200 to-orange-200',
//             red: 'from-red-200 to-red-200',
//             cyan: 'from-cyan-200 to-cyan-200',
//             indigo: 'from-indigo-200 to-indigo-200',
//             pink: 'from-pink-200 to-pink-200',
//             teal: 'from-teal-200 to-teal-200',
//             amber: 'from-amber-200 to-amber-200',
//             lime: 'from-lime-200 to-lime-200',
//             emerald: 'from-emerald-200 to-emerald-200'
//         };
//         return colorMap[color] || 'from-slate-200 to-slate-200';
//     }, []);

//     // Memoized tab configuration
//     const tabs = useMemo(() => [
//         {
//             id: 'graphs',
//             label: 'Data Analysis',
//             icon: <MdAnalytics className="w-5 h-5" />,
//             description: 'Interactive charts and visualizations'
//         },
//         {
//             id: 'candle_pattern',
//             label: 'Candle Patterns',
//             icon: <FaChartLine className="w-5 h-5" />,
//             description: 'Candlestick pattern analysis'
//         },
//         {
//             id: 'finance',
//             label: 'Financials',
//             icon: <MdAttachMoney className="w-5 h-5" />,
//             description: 'Financial statements & metrics'
//         },
//         {
//             id: 'Shareholding',
//             label: 'Shareholding',
//             icon: <FaUserTie className="w-5 h-5" />,
//             description: 'Ownership structure analysis'
//         },
//            {
//             id: 'Reviews',
//             label: 'Reviews',
//             icon: <FaComment className="w-5 h-5" />,
//             description: 'What are People Saying?'
//         },
//     ], []);

//     // Memoized tab content renderers
//     const renderGraphTabContent = useMemo(() => {
//         if (selectedGraph) {
//             const initialSlide = graphSections.findIndex((g) => g.key === selectedGraph.key);

//             return (
//                 <div
//                     className={`${isFullWidth ? 'w-full' : 'w-auto'} transition-all duration-300 p-4 ${
//                         isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-900 p-0' : ''
//                     }`}
//                 >
//                     <div
//                         className={`flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl ${
//                             isFullscreen ? 'rounded-none border-b border-slate-200 dark:border-slate-700' : ''
//                         }`}
//                     >
//                         <div className="flex items-center gap-4">
//                             <button
//                                 onClick={handleClearSelection}
//                                 className="flex items-center gap-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-white px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200 border border-slate-200 dark:border-slate-600"
//                             >
//                                 <FaArrowLeft className="w-4 h-4" />
//                                 Back to Gallery
//                             </button>
//                         </div>
//                     </div>

//                     <div className={`${isFullscreen ? 'h-[calc(100vh-250px)]' : 'h-[900px]'} relative`}>
//                         <Slider
//                             {...sliderSettings}
//                             ref={sliderRef}
//                             initialSlide={initialSlide}
//                             afterChange={(index) => {
//                                 const newGraph = graphSections[index];
//                                 setSelectedGraph({ key: newGraph.key, title: newGraph.title });
//                             }}
//                             prevArrow={<PrevArrow />}
//                             nextArrow={<NextArrow />}
//                             arrows={true}
//                         >
//                             {graphSections.map((graph) => (
//                                 <div
//                                     key={graph.key}
//                                     className="relative dark:bg-slate-800 p-6 h-full"
//                                 >
//                                     <div className="flex items-center justify-between mb-6">
//                                         <div>
//                                             <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
//                                                 {graph.title}
//                                             </h2>
//                                             {ratings[graph.key] && (
//                                                 <div className="flex items-center gap-2 mt-2">
//                                                     <RatingStars
//                                                         rating={ratings[graph.key].averageRating}
//                                                         size="lg"
//                                                     />
//                                                 </div>
//                                             )}
//                                         </div>
//                                         <span
//                                             className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getColorClasses(
//                                                 graph.color
//                                             )} text-black`}
//                                         >
//                                             {graph.category}
//                                         </span>
//                                     </div>
//                                     <div className="w-full h-[700px]">
//                                         {graph.component}
//                                     </div>
//                                 </div>
//                             ))}
//                         </Slider>
//                     </div>
//                 </div>
//             );
//         }

//         return (
//             <div className="w-full transition-all duration-300">
//                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
//                     {graphSections.map(({ title, description, key, image, icon, category, color }, index) => {
//                         const isVisible = isLoggedIn || index < MAX_VISIBLE_GRAPHS;

//                         return (
//                             <div
//                                 key={key}
//                                 className={`group relative bg-zinc-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
//                                     !isVisible ? 'opacity-80' : ''
//                                 }`}
//                                 onClick={() =>
//                                     isVisible
//                                         ? handleGraphSelect({ title, key }, index)
//                                         : navigate('/login', { state: { from: location.pathname, graphKey: key } })
//                                 }
//                                 role="button"
//                                 tabIndex={0}
//                                 onKeyDown={(e) => e.key === 'Enter' &&
//                                     (isVisible
//                                         ? handleGraphSelect({ title, key }, index)
//                                         : navigate('/login', { state: { from: location.pathname, graphKey: key } }))
//                                 }
//                             >
//                                 <div className="relative h-40 overflow-hidden">
//                                     <img
//                                         src={image}
//                                         alt={title}
//                                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                                     />
//                                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

//                                     <div className="absolute top-3 left-3">
//                                         <span className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-black/60 backdrop-blur-sm border border-white/20`}>
//                                             {category}
//                                         </span>
//                                     </div>

//                                     <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
//                                         <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
//                                             <FaEye className="w-3 h-3 text-slate-700 dark:text-slate-300" />
//                                             <span className="text-xs font-medium text-slate-700 dark:text-slate-300">View Graph</span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="p-5">
//                                     <div className="flex items-start gap-3 mb-3">
//                                         <div className={`p-2.5 rounded-xl bg-gradient-to-br ${getColorClasses(color)} shadow-lg flex-shrink-0`}>
//                                             <div className="text-white text-lg">
//                                                 {icon}
//                                             </div>
//                                         </div>

//                                         <div className="flex-1 min-w-0">
//                                             <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-2 line-clamp-2">
//                                                 {title}
//                                             </h3>

//                                             {ratings[key] && (
//                                                 <div className="flex items-center gap-3 mt-2">
//                                                     <div className="flex items-center gap-1.5">
//                                                         <div className="flex items-center">
//                                                             <RatingStars
//                                                                 rating={ratings[key].averageRating}
//                                                                 size="lg"
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                     <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
//                                                     <span className="text-xs text-slate-600 dark:text-slate-400">
//                                                         Based on user ratings
//                                                     </span>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
//                                         {description}
//                                     </p>

//                                     <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
//                                         <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
//                                             Explore Insights
//                                         </span>
//                                         <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
//                                             <span className="text-xs font-medium">View</span>
//                                             <FaChevronRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {!isVisible && (
//                                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm rounded-xl z-10 p-6">
//                                         <div className="text-center">
//                                             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
//                                                 <FaUserLock className="w-6 h-6 text-white" />
//                                             </div>
//                                             <h4 className="text-white font-bold text-lg mb-2">
//                                                 Premium Feature
//                                             </h4>
//                                             <p className="text-slate-300 text-sm mb-4 leading-relaxed">
//                                                 Unlock advanced analytics and insights by logging in
//                                             </p>
//                                             <button className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-full text-sm font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95">
//                                                 Login to Unlock
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         );
//     }, [
//         selectedGraph,
//         isFullWidth,
//         isFullscreen,
//         graphSections,
//         ratings,
//         isLoggedIn,
//         handleGraphSelect,
//         handleClearSelection,
//         sliderSettings,
//         PrevArrow,
//         NextArrow,
//         getColorClasses,
//         navigate,
//         location.pathname
//     ]);

//     // Memoized tab content components
//     const renderCandlePatternTabContent = useMemo(() => (
//         <div className="w-full dark:bg-slate-800 rounded-2xl p-6">
//             <CandlePattern symbol={symbol} />
//         </div>
//     ), [symbol]);

//     const renderFinanceTabContent = useMemo(() => (
//         <div className="w-full dark:bg-slate-800 rounded-2xl">
//             <FinancialTab symbol={symbol} />
//         </div>
//     ), [symbol]);

//     const renderShareHoldingTabContent = useMemo(() => (
//         <div className="w-full dark:bg-slate-800 rounded-2xl p-6">
//             <Shareholding symbol={symbol} />
//         </div>
//     ), [symbol]);

//       const renderReviewTabContent = useMemo(() => (
//         <div className="w-full dark:bg-slate-800 rounded-2xl p-6">
//             <Review symbol={symbol} />
//         </div>
//     ), [symbol]);

//     // Main render with memoized tab content
//     const tabContent = useMemo(() => {
//         switch (activeTab) {
//             case 'graphs':
//                 return renderGraphTabContent;
//             case 'candle_pattern':
//                 return renderCandlePatternTabContent;
//             case 'finance':
//                 return renderFinanceTabContent;
//             case 'Shareholding':
//                 return renderShareHoldingTabContent;
//             case 'Reviews':
//                 return renderReviewTabContent;
//             default:
//                 return renderGraphTabContent;
//         }
//     }, [
//         activeTab,
//         renderGraphTabContent,
//         renderCandlePatternTabContent,
//         renderFinanceTabContent,
//         renderShareHoldingTabContent
//     ]);

//     return (
//         <div className="font-sans w-full dark:bg-slate-800">
//             <div className="container mx-auto px-4 py-8">
//                 <div className="flex flex-col items-center mb-8">
//                     <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 text-center">
//                         Advanced Stock Analysis
//                     </h2>
//                     <p className="text-slate-600 dark:text-slate-300 text-center mb-8 max-w-2xl">
//                         Comprehensive tools and visualizations for in-depth market analysis of {symbol}
//                     </p>

//                     <div className="dark:bg-slate-800/80 backdrop-blur-lg rounded-xl p-2 border border-slate-200/50 dark:border-slate-700/50 shadow-sm w-full max-w-6xl">
//                         <div className="flex flex-wrap justify-center gap-1">
//                             {tabs.map((tab) => (
//                                 <button
//                                     key={tab.id}
//                                     role="tab"
//                                     aria-selected={activeTab === tab.id}
//                                     aria-controls={`${tab.id}-tabpanel`}
//                                     id={`${tab.id}-tab`}
//                                     onClick={() => setActiveTab(tab.id)}
//                                     className={`relative flex flex-col items-center px-4 py-2 rounded-xl transition-all duration-300 ease-in-out min-w-[120px] group ${
//                                         activeTab === tab.id
//                                             ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-blue-500/25'
//                                             : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
//                                     }`}
//                                 >
//                                     <div
//                                         className={`mb-2 transition-transform duration-300 ${
//                                             activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
//                                         }`}
//                                     >
//                                         {tab.icon}
//                                     </div>
//                                     <span className="font-bold text-sm mb-1">{tab.label}</span>
//                                     <span className="text-xs opacity-80">{tab.description}</span>

//                                     {activeTab === tab.id && (
//                                         <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full animate-pulse"></div>
//                                     )}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 <div
//                     id={`${activeTab}-tabpanel`}
//                     aria-labelledby={`${activeTab}-tab`}
//                     role="tabpanel"
//                     className="dark:bg-slate-900/95 backdrop-blur-md transition-all duration-500 ease-in-out overflow-hidden"
//                 >
//                     <div className="p-3 animate-fade-in">
//                         {tabContent}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default React.memo(GraphSlider);

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Slider from "react-slick";
import CandleBreach from "./CandleBreach";
import LastTraded from "./LastTraded";
import AvgBoxPlots from "./AvgBoxPlots";
import WormsPlots from "./WormsPlots";
import SensexStockCorrBar from "./SensexVsStockCorrBar";
import SensexVsStockCorr from "./SensexVsStockCorr";
import HeatMap from "./HeatMap";
import DelRate from "./DelRate";
import VoltyPlot from "./VoltyPlot";
import IndustryBubble from "./IndustryBubble";
import SensexCalculator from "./SensexCalculator";
import MacdPlot from "./MacdPlot";
import CandleSpread from "./CandleSpreadDistribution";
import PublicTradingActivityPlot from "./PublicTradingActivityPlot";
import CandlePattern from "./CandlePattern";
import Shareholding from "./Shareholding";
import FinancialTab from "./FinancialTab";
import PegyWormPlot from "./PegyWormPlot";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaArrowRight,
  FaChartLine,
  FaUserLock,
  FaUserTie,
  FaChevronRight,
  FaPlay,
  FaTimes,
  FaExpand,
  FaEye,
  FaComment,
  FaBullhorn,
} from "react-icons/fa";
import {
  MdAnalytics,
  MdAttachMoney,
  MdSwapHoriz,
  MdGridView,
  MdBarChart,
  MdShowChart,
  MdPieChart,
  MdTableChart,
  MdOutlineStarHalf,
} from "react-icons/md";
import { FiBarChart2, FiTrendingUp, FiPieChart, FiMap } from "react-icons/fi";
import { useAuth } from "../AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { equityInsightsApi } from "../../services/equityInsightsApi";

// Import graph thumbnails
import candle_spread from "/public/equityhub_plot/candle_spread1.png";
import Industry_Bubble from "/public/equityhub_plot/industry_bubble1.png";
import Sensex_Calculator from "/public/equityhub_plot/sensex_calculator1.png";
import Volty_Plot from "/public/assets/graph12.png";
import Candle_Breach from "/public/equityhub_plot/Screenshot 2025-09-24 110817.png";
import Del_Rate from "/public/equityhub_plot/delivery_rate1.png";
import Heat_Map from "/public/equityhub_plot/heatmap1.png";
import Sensex_VsStockCorr from "/public/equityhub_plot/sensex_analylis1.png";
import Sensex_StockCorrBar from "/public/equityhub_plot/sensex_and_stock1.png";
import Macd_Plot from "/public/equityhub_plot/macd_plot1.png";
import Worms_Plots from "/public/equityhub_plot/weekly_tade_delivery1.png";
import AvgBox_Plots from "/public/equityhub_plot/avgbox_plot1.png";
import Last_Traded from "/public/equityhub_plot/box_plot1.png";
import PegyPlot from "/public/equityhub_plot/pegyplot.png";
import PublicTrading_Activity from "/public/equityhub_plot/PublicTrading_Activity.png";

import { MdStar, MdStarHalf, MdStarOutline } from "react-icons/md";
import JwtUtil from "../../services/JwtUtil";
import SocialMediaReview from "./Media/SocialMediaReview";
import AnnouncementsPanel from "./AnnouncementsPanel";
// import Review from './Review';

// Memoized RatingStars component
const RatingStars = React.memo(({ rating, size = "lg" }) => {
  const effectiveRating = useMemo(() => {
    let ratingValue = rating;
    if (
      isNaN(ratingValue) ||
      ratingValue === null ||
      ratingValue === undefined
    ) {
      ratingValue = 0;
    }
    return Math.max(0, Math.min(5, ratingValue));
  }, [rating]);

  const { fullStars, hasHalfStar, emptyStars, isWholeNumber } = useMemo(() => {
    const fullStars = Math.floor(effectiveRating);
    const hasHalfStar =
      effectiveRating % 1 >= 0.25 && effectiveRating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const isWholeNumber = effectiveRating % 1 === 0;

    return { fullStars, hasHalfStar, emptyStars, isWholeNumber };
  }, [effectiveRating]);

  const sizeClasses = useMemo(
    () => ({
      sm: "text-base",
      md: "text-xl",
      lg: "text-2xl",
    }),
    [],
  );

  const textSizes = useMemo(
    () => ({
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    }),
    [],
  );

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <MdStar
          key={`full-${i}`}
          className={`${sizeClasses[size]} text-yellow-400`}
        />
      ))}

      {hasHalfStar && (
        <MdStarHalf className={`${sizeClasses[size]} text-yellow-400`} />
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <MdStarOutline
          key={`empty-${i}`}
          className={`${sizeClasses[size]} text-gray-300`}
        />
      ))}

      <span
        className={`ml-2 font-semibold ${textSizes[size]} text-slate-700 dark:text-slate-300`}
      >
        {isWholeNumber
          ? effectiveRating.toFixed(0)
          : effectiveRating.toFixed(1)}
      </span>
    </div>
  );
});

RatingStars.displayName = "RatingStars";

const GraphSlider = ({
  symbol,
  fincode,
  symbols,
  isFullWidth,
  timeRange = "1Y",
  normalize = false,
  overlay = false,
  tabContext = "equityHub",
  getAuthToken,
}) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // State initialization with useMemo for derived values
  const [activeTab, setActiveTab] = useState(() => {
    const storageKey =
      tabContext === "equityHub"
        ? "equityHubLastGraph"
        : `mySearchLastGraph_${symbol}`;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved).activeTab || "graphs" : "graphs";
  });

  const [selectedGraph, setSelectedGraph] = useState(() => {
    const storageKey =
      tabContext === "equityHub"
        ? "equityHubLastGraph"
        : `mySearchLastGraph_${symbol}`;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved).selectedGraph || null : null;
  });

  const [plotData, setPlotData] = useState(() => {
    const saved = localStorage.getItem("plotData");
    return saved ? JSON.parse(saved) : {};
  });

  const [ratings, setRatings] = useState({});
  const [graphsLoaded, setGraphsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const searchOptionsRef = useRef(null);
  const sliderRef = useRef(null);

  // Use explicit backend default to ensure API calls go to backend at :8080
  const API_BASE = import.meta.env.VITE_URL || "http://localhost:8080/api";
  const CACHE_TTL = 60 * 60 * 1000;
  const MAX_VISIBLE_GRAPHS = 5;

  // Memoized constants
  const plotTypeMapping = useMemo(
    () => ({
      CandleSpread: "candle_chronicle",
      PegyWormPlot: "pegy",
      MacdPlot: "macd",
      SensexCalculator: "sensex_movement_corr_calculator",
      DelRate: "market_mood",
      CandleBreach: "breach_busters",
      LastTraded: "box_plot",
      AvgBoxPlots: "price_trend",
      WormsPlots: "trend_tapestry",
      SensexStockCorrBar: "sensex_stock_fluctuations",
      SensexVsStockCorr: "sensex_symphony",
      HeatMap: "performance_heatmap",
      IndustryBubble: "pe_eps_book_value",
      PublicTradingActivityPlot: "compute_public_trading_activity",
    }),
    [],
  );

  // Cache utilities with useCallback
  const getCachedData = useCallback((key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_TTL) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch (err) {
      console.error(`Failed to parse cached data for ${key}:`, err);
      localStorage.removeItem(key);
      return null;
    }
  }, []);

  const setCachedData = useCallback((key, data) => {
    try {
      const serializedData = JSON.stringify({ data, timestamp: Date.now() });
      if (serializedData.length > 1024 * 1024) {
        console.warn(`Data for ${key} exceeds 1MB, skipping cache.`);
        return;
      }
      localStorage.setItem(key, serializedData);
    } catch (err) {
      if (
        err.name === "QuotaExceededError" ||
        err.name === "NS_ERROR_DOM_QUOTA_REACHED"
      ) {
        console.warn("Storage quota exceeded, clearing old plot cache...");
        try {
          // Clear all keys starting with plot_ or rating_ to make room
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (
              k &&
              (k.startsWith("plot_") ||
                k.startsWith("rating_") ||
                k.startsWith("mySearchLastGraph_"))
            ) {
              keysToRemove.push(k);
            }
          }
          keysToRemove.forEach((k) => localStorage.removeItem(k));

          // Try setting it again once after clearing
          const serializedData = JSON.stringify({
            data,
            timestamp: Date.now(),
          });
          localStorage.setItem(key, serializedData);
        } catch (retryErr) {
          console.error(
            "Failed to set item even after clearing cache:",
            retryErr,
          );
        }
      } else {
        console.error(`Failed to cache data for ${key}:`, err);
      }
    }
  }, []);

  // Rating update handler with useCallback
  const handleRatingUpdate = useCallback((plotType) => {
    const fetchUpdatedRating = async () => {
      const updatedRating = await fetchAverageRating(plotType);
      setRatings((prev) => ({ ...prev, [plotType]: updatedRating }));
    };
    fetchUpdatedRating();
  }, []);

  // Fetch average ratings with useCallback
  const fetchAverageRating = useCallback(
    async (plotType) => {
      try {
        const cacheKey = `rating_${plotType}`;
        const cachedData = getCachedData(cacheKey);
        if (cachedData) return cachedData;

        const apiPlotType = plotTypeMapping[plotType] || plotType;
        const fullUrl = `${API_BASE}/stocks/test/ratings/${apiPlotType}/average`;

        const response = await fetch(fullUrl, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          if (errorText.includes("average_rating")) {
            const data = JSON.parse(errorText);
            const processedData = {
              plotType,
              averageRating: data.average_rating || 0,
              totalRatings: data.total_ratings || 1,
              ratingBreakdown: data.rating_breakdown || {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0,
              },
            };
            setCachedData(cacheKey, processedData);
            return processedData;
          }
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`,
          );
        }

        const data = await response.json();
        const processedData = {
          plotType,
          averageRating: data.average_rating || 0,
          totalRatings: data.total_ratings || 1,
          ratingBreakdown: data.rating_breakdown || {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
          },
        };

        setCachedData(cacheKey, processedData);
        return processedData;
      } catch (error) {
        console.error(`Error fetching average rating for ${plotType}:`, error);
        return {
          plotType,
          averageRating: 0,
          totalRatings: 0,
          ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        };
      }
    },
    [API_BASE, getCachedData, setCachedData, plotTypeMapping],
  );

  // Fetch all ratings when component mounts or when login status changes
  useEffect(() => {
    const fetchAllRatings = async () => {
      const ratingsData = {};
      for (const graph of graphSections) {
        const rating = await fetchAverageRating(graph.key);
        ratingsData[graph.key] = rating;
      }
      setRatings(ratingsData);
    };

    fetchAllRatings();
  }, [fetchAverageRating, isLoggedIn]);

  // Fetch plot data with dependency optimization
  useEffect(() => {
    const fetchPlotData = async () => {
      if (!symbol) {
        setGraphsLoaded(true);
        return;
      }

      const cacheKey = `plot_${symbol}_${timeRange}_${normalize}`;
      const cachedData = getCachedData(cacheKey);

      if (cachedData) {
        setPlotData((prev) => ({ ...prev, [symbol]: cachedData }));
        setGraphsLoaded(true);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE}/stocks/test/candle_chronicle`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(getAuthToken && {
                Authorization: `Bearer ${getAuthToken()}`,
              }),
            },
            body: JSON.stringify({ symbol, timeRange, normalize }),
          },
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        setPlotData((prev) => {
          const updated = {
            ...prev,
            [symbol]: {
              ...prev[symbol],
              [timeRange]: {
                [normalize ? "normalized" : "raw"]: data,
              },
            },
          };
          setCachedData(cacheKey, data);
          return updated;
        });
        setGraphsLoaded(true);
      } catch (error) {
        console.error("Error fetching plot data:", error);
        setGraphsLoaded(true);
      }
    };

    fetchPlotData();
  }, [
    symbol,
    timeRange,
    normalize,
    API_BASE,
    getAuthToken,
    getCachedData,
    setCachedData,
  ]);

  // Auto-resolve fincode when only `symbol` is provided (so ResearchChart can use fincode)
  useEffect(() => {
    let mounted = true;
    if (selectedCompany && selectedCompany.fincode) return; // already have fincode
    if (!symbol) return;

    const tryResolve = async () => {
      try {
        // Use cached options if available, otherwise call Python API
        if (!searchOptionsRef.current) {
          const options = await equityInsightsApi.getSearchOptions();
          searchOptionsRef.current = options;
        }

        const opts = searchOptionsRef.current;
        if (!opts || !opts.Symbol) return;

        const idx = opts.Symbol.findIndex(
          (s) => String(s).toLowerCase() === String(symbol).toLowerCase(),
        );
        if (idx === -1) return;

        const company = {
          symbol: opts.Symbol[idx],
          companyName:
            opts.Company_ShortName?.[idx] ||
            opts.Company_Name?.[idx] ||
            opts.CompanyName?.[idx] ||
            symbol,
          fincode: opts.FINCODE?.[idx] || opts.Fincode?.[idx] || null,
        };

        if (mounted && company.fincode) setSelectedCompany(company);
      } catch (err) {
        // fail silently
      }
    };

    tryResolve();
    return () => {
      mounted = false;
    };
  }, [symbol, selectedCompany]);

  // Restore selected graph from location.state after login
  useEffect(() => {
    if (location.state?.graphKey && isLoggedIn) {
      const graph = graphSections.find(
        (g) => g.key === location.state.graphKey,
      );
      if (graph && selectedGraph?.key !== graph.key) {
        setSelectedGraph({ key: graph.key, title: graph.title });
        navigate(location.pathname, {
          replace: true,
          state: { from: location.state.from },
        });
      }
    }
  }, [location.state, isLoggedIn, symbol, navigate]);

  // Persist state to localStorage
  useEffect(() => {
    const storageKey =
      tabContext === "equityHub"
        ? "equityHubLastGraph"
        : `mySearchLastGraph_${symbol}`;
    const serializableSelectedGraph = selectedGraph
      ? {
          key: selectedGraph.key,
          title: selectedGraph.title,
        }
      : null;

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        activeTab,
        selectedGraph: serializableSelectedGraph,
      }),
    );
  }, [activeTab, selectedGraph, symbol, tabContext]);

  // Memoized graph sections configuration
  const graphSections = useMemo(
    () => [
      {
        title: "Price Spread Over Time",
        description:
          "Visualizes the distribution of candlestick spread patterns over the past year.",
        component: <CandleSpread symbol={symbol} key="candle-spread" />,
        key: "CandleSpread",
        image: candle_spread,
        icon: <MdShowChart className="text-blue-500" />,
        category: "Technical Analysis",
        color: "blue",
      },
      {
        title: "PEGY Worm Plot",
        description:
          "Visualizes PEGY ratio trends to assess stock valuation based on earnings growth and yield.",
        component: <PegyWormPlot symbol={symbol} key="pegy-worm" />,
        key: "PegyWormPlot",
        image: PegyPlot,
        icon: <FiBarChart2 className="text-cyan-500" />,
        category: "Valuation Analysis",
        color: "teal",
      },
      {
        title: "MACD Analysis for TTM",
        description:
          "Plots the MACD indicator to identify momentum over the last year.",
        component: <MacdPlot symbol={symbol} key="macd-plot" />,
        key: "MacdPlot",
        image: Macd_Plot,
        icon: <MdGridView className="text-red-500" />,
        category: "Momentum",
        color: "red",
      },
      {
        title: "Sensex Calculator",
        description: "A tool to calculate Sensex-related metrics for analysis.",
        component: <SensexCalculator symbol={symbol} key="sensex-calc" />,
        key: "SensexCalculator",
        image: Sensex_Calculator,
        icon: <MdAnalytics className="text-lime-500" />,
        category: "Tools",
        color: "lime",
      },
      {
        title: "Market Mood: Delivery Trends & Trading Sentiment",
        description:
          "Analyzes delivery trends and trading sentiment over time.",
        component: <DelRate symbol={symbol} key="del-rate" />,
        key: "DelRate",
        image: Del_Rate,
        icon: <MdTableChart className="text-teal-500" />,
        category: "Sentiment Analysis",
        color: "teal",
      },
      {
        title: "Breach Busters: Analyzing High and Low Breaches",
        description: "Examines instances of high and low price breaches.",
        component: <CandleBreach symbol={symbol} key="candle-breach" />,
        key: "CandleBreach",
        image: Candle_Breach,
        icon: <FaChartLine className="text-amber-500" />,
        category: "Price Action",
        color: "amber",
      },
      {
        title: "Boxing Prices: TTM Box Plot for Trade Prices",
        description:
          "Shows a box plot of trade prices over the last year with key levels.",
        component: <LastTraded symbol={symbol} key="last-traded" />,
        key: "LastTraded",
        image: Last_Traded,
        icon: <MdBarChart className="text-green-500" />,
        category: "Price Analysis",
        color: "green",
      },
      {
        title:
          "Price Trends in a Box: Monthly Ranges and Averages Explored (TTM)",
        description:
          "Displays monthly price ranges and averages over the past year.",
        component: <AvgBoxPlots symbol={symbol} key="avg-box" />,
        key: "AvgBoxPlots",
        image: AvgBox_Plots,
        icon: <FiTrendingUp className="text-purple-500" />,
        category: "Trend Analysis",
        color: "purple",
      },
      {
        title: "Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends",
        description:
          "Analyzes weekly trade delivery patterns during market trends.",
        component: <WormsPlots symbol={symbol} key="worms-plot" />,
        key: "WormsPlots",
        image: Worms_Plots,
        icon: <FiMap className="text-orange-500" />,
        category: "Volume Analysis",
        color: "orange",
      },
      {
        title: "Sensex & Stock Fluctuations",
        description:
          "Compares monthly percentage changes between Sensex and the stock.",
        component: <SensexStockCorrBar symbol={symbol} key="sensex-corr-bar" />,
        key: "SensexStockCorrBar",
        image: Sensex_StockCorrBar,
        icon: <FiBarChart2 className="text-cyan-500" />,
        category: "Market Correlation",
        color: "cyan",
      },
      {
        title: "Sensex Symphony: Harmonizing Stock Correlation Trends (TTM)",
        description:
          "Visualizes correlation trends between Sensex and the stock.",
        component: <SensexVsStockCorr symbol={symbol} key="sensex-vs-stock" />,
        key: "SensexVsStockCorr",
        image: Sensex_VsStockCorr,
        icon: <MdPieChart className="text-indigo-500" />,
        category: "Correlation Analysis",
        color: "indigo",
      },
      {
        title: `Performance Heatmap: Nifty50 vs BSE vs ${symbol}`,
        description:
          "A heatmap comparing performance across Nifty50, BSE, and the stock.",
        component: <HeatMap symbol={symbol} key="heatmap" />,
        key: "HeatMap",
        image: Heat_Map,
        icon: <FiPieChart className="text-pink-500" />,
        category: "Market Comparison",
        color: "pink",
      },
      {
        title: "PE vs EPS vs Book Value: Gladiators in the Industry Arena",
        description:
          "Compares PE, EPS, and Book Value within the industry context.",
        component: <IndustryBubble symbol={symbol} key="industry-bubble" />,
        key: "IndustryBubble",
        image: Industry_Bubble,
        icon: <MdSwapHoriz className="text-emerald-500" />,
        category: "Fundamental Analysis",
        color: "emerald",
      },
      {
        title: "Public Trading Activity: Market Pulse in Action",
        description:
          "Visualizes live trading dynamics, showing price movements, trading volume, and overall market activity for the selected stock.",
        component: (
          <PublicTradingActivityPlot symbol={symbol} key="public-trading" />
        ),
        key: "PublicTradingActivityPlot",
        image: PublicTrading_Activity,
        icon: <MdShowChart className="text-emerald-500" />,
        category: "Market Analysis",
        color: "emerald",
      },
    ],
    [symbol],
  );

  // FIXED: Memoized event handlers without stale closure issues
  const handleGraphSelect = useCallback(
    (graph, index) => {
      // Direct auth check - no stale closure issues
      const token = localStorage.getItem("authToken");
      const isUserLoggedIn = !!token && !JwtUtil.isTokenExpired(token);

      // Use current graphSections
      const isGraphVisible = graphSections
        .slice(0, MAX_VISIBLE_GRAPHS)
        .some((g) => g.key === graph.key);

      if (!isUserLoggedIn && !isGraphVisible) {
        navigate("/login", {
          state: { from: location.pathname, graphKey: graph.key },
        });
        return;
      }

      // Functional update for selectedGraph
      setSelectedGraph((prev) =>
        prev && prev.key === graph.key
          ? null
          : { key: graph.key, title: graph.title },
      );
    },
    [graphSections, navigate, location.pathname],
  );

  const handleClearSelection = useCallback(() => setSelectedGraph(null), []);
  const toggleFullscreen = useCallback(
    () => setIsFullscreen((prev) => !prev),
    [],
  );

  // Memoized slider arrows
  const PrevArrow = useCallback(
    ({ onClick }) => (
      <button
        onClick={onClick}
        className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-white p-3 rounded-full hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-all duration-300 hover:scale-110 z-20 backdrop-blur-sm"
        aria-label="Previous Graph"
      >
        <FaArrowLeft className="w-4 h-4" />
      </button>
    ),
    [],
  );

  const NextArrow = useCallback(
    ({ onClick }) => (
      <button
        onClick={onClick}
        className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-white p-3 rounded-full hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-all duration-300 hover:scale-110 z-20 backdrop-blur-sm"
        aria-label="Next Graph"
      >
        <FaArrowRight className="w-4 h-4" />
      </button>
    ),
    [],
  );

  // Memoized slider settings
  const sliderSettings = useMemo(
    () => ({
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      appendDots: (dots) => (
        <div className="bg-white/80 dark:bg-slate-800/80 rounded-full px-4 py-2 backdrop-blur-sm border border-slate-200 dark:border-slate-600">
          <ul className="flex space-x-2"> {dots} </ul>
        </div>
      ),
      customPaging: (i) => (
        <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full transition-all duration-300 hover:bg-slate-400 dark:hover:bg-slate-500" />
      ),
    }),
    [],
  );

  // Memoized color classes utility
  const getColorClasses = useCallback((color) => {
    const colorMap = {
      blue: "from-blue-200 to-blue-200",
      green: "from-green-200 to-green-200",
      purple: "from-purple-200 to-purple-200",
      orange: "from-orange-200 to-orange-200",
      red: "from-red-200 to-red-200",
      cyan: "from-cyan-200 to-cyan-200",
      indigo: "from-indigo-200 to-indigo-200",
      pink: "from-pink-200 to-pink-200",
      teal: "from-teal-200 to-teal-200",
      amber: "from-amber-200 to-amber-200",
      lime: "from-lime-200 to-lime-200",
      emerald: "from-emerald-200 to-emerald-200",
    };
    return colorMap[color] || "from-slate-200 to-slate-200";
  }, []);

  // Memoized tab configuration
  const tabs = useMemo(
    () => [
      {
        id: "graphs",
        label: "Data Analysis",
        icon: <MdAnalytics className="w-5 h-5" />,
        description: "Interactive charts and visualizations",
      },
      {
        id: "finance",
        label: "Financials",
        icon: <MdAttachMoney className="w-5 h-5" />,
        description: "Financial statements & metrics",
      },
      {
        id: "Shareholding",
        label: "Shareholding",
        icon: <FaUserTie className="w-5 h-5" />,
        description: "Ownership structure analysis",
      },
      {
        id: "Media",
        label: "Media",
        icon: <FaComment className="w-5 h-5" />,
        description: "What are People Saying?",
      },
      {
        id: "announcements",
        label: "Announcements",
        icon: <FaBullhorn className="w-5 h-5" />,
        description: "Dividends, splits & results",
      },
    ],
    [],
  );

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab("graphs");
    }
  }, [activeTab, tabs]);

  // Memoized tab content renderers
  const renderGraphTabContent = useMemo(() => {
    if (selectedGraph) {
      const initialSlide = graphSections.findIndex(
        (g) => g.key === selectedGraph.key,
      );

      return (
        <div
          className={`${isFullWidth ? "w-full" : "w-auto"} transition-all duration-300 p-4 ${
            isFullscreen
              ? "fixed inset-0 z-50 bg-white dark:bg-slate-900 p-0"
              : ""
          }`}
        >
          <div
            className={`flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl ${
              isFullscreen
                ? "rounded-none border-b border-slate-200 dark:border-slate-700"
                : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={handleClearSelection}
                className="flex items-center gap-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-white px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200 border border-slate-200 dark:border-slate-600"
              >
                <FaArrowLeft className="w-4 h-4" />
                Back to Gallery
              </button>
            </div>
          </div>

          <div
            className={`${isFullscreen ? "h-[calc(100vh-250px)]" : "h-[900px]"} relative`}
          >
            <Slider
              {...sliderSettings}
              ref={sliderRef}
              initialSlide={initialSlide}
              afterChange={(index) => {
                const newGraph = graphSections[index];
                setSelectedGraph({ key: newGraph.key, title: newGraph.title });
              }}
              prevArrow={<PrevArrow />}
              nextArrow={<NextArrow />}
              arrows={true}
            >
              {graphSections.map((graph) => (
                <div
                  key={graph.key}
                  className="relative dark:bg-slate-800 p-6 h-full"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        {graph.title}
                      </h2>
                      {ratings[graph.key] && (
                        <div className="flex items-center gap-2 mt-2">
                          <RatingStars
                            rating={ratings[graph.key].averageRating}
                            size="lg"
                          />
                        </div>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getColorClasses(
                        graph.color,
                      )} text-black`}
                    >
                      {graph.category}
                    </span>
                  </div>
                  <div className="w-full h-[700px]">{graph.component}</div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {graphSections.map(
            (
              { title, description, key, image, icon, category, color },
              index,
            ) => {
              // Direct auth check for visibility - no stale closure
              const token = localStorage.getItem("authToken");
              const isUserLoggedIn = !!token && !JwtUtil.isTokenExpired(token);
              const isVisible = isUserLoggedIn || index < MAX_VISIBLE_GRAPHS;

              return (
                <div
                  key={key}
                  className={`group relative bg-zinc-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                    !isVisible ? "opacity-80" : ""
                  }`}
                  onClick={() =>
                    isVisible
                      ? handleGraphSelect({ title, key }, index)
                      : navigate("/login", {
                          state: { from: location.pathname, graphKey: key },
                        })
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (isVisible
                      ? handleGraphSelect({ title, key }, index)
                      : navigate("/login", {
                          state: { from: location.pathname, graphKey: key },
                        }))
                  }
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-black/60 backdrop-blur-sm border border-white/20`}
                      >
                        {category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
                        <FaEye className="w-3 h-3 text-slate-700 dark:text-slate-300" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          View Graph
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`p-2.5 rounded-xl bg-gradient-to-br ${getColorClasses(color)} shadow-lg flex-shrink-0`}
                      >
                        <div className="text-white text-lg">{icon}</div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-2 line-clamp-2">
                          {title}
                        </h3>

                        {ratings[key] && (
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center">
                                <RatingStars
                                  rating={ratings[key].averageRating}
                                  size="lg"
                                />
                              </div>
                            </div>
                            <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              Based on user ratings
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                      {description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Explore Insights
                      </span>
                      <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                        <span className="text-xs font-medium">View</span>
                        <FaChevronRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {!isVisible && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm rounded-xl z-10 p-6">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
                          <FaUserLock className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-white font-bold text-lg mb-2">
                          Premium Feature
                        </h4>
                        <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                          Unlock advanced analytics and insights by logging in
                        </p>
                        <button className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-full text-sm font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95">
                          Login to Unlock
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            },
          )}
        </div>
      </div>
    );
  }, [
    selectedGraph,
    isFullWidth,
    isFullscreen,
    graphSections,
    ratings,
    handleGraphSelect,
    handleClearSelection,
    sliderSettings,
    PrevArrow,
    NextArrow,
    getColorClasses,
    navigate,
    location.pathname,
  ]);

  // Memoized tab content components

  const renderFinanceTabContent = useMemo(
    () => (
      <div className="w-full dark:bg-slate-800 rounded-2xl">
        <FinancialTab symbol={symbol} />
      </div>
    ),
    [symbol],
  );

  const renderShareHoldingTabContent = useMemo(
    () => (
      <div className="w-full dark:bg-slate-800 rounded-2xl p-6">
        <Shareholding symbol={symbol} />
      </div>
    ),
    [symbol],
  );
  const renderMediaTabContent = useMemo(
    () => (
      <div className="w-full dark:bg-slate-800 rounded-2xl p-6 ">
        <SocialMediaReview symbol={symbol} />
      </div>
    ),
    [symbol],
  );
  const renderAnnouncementsTabContent = useMemo(
    () => (
      <div className="w-full dark:bg-slate-800 rounded-2xl p-6">
        <AnnouncementsPanel fincode={fincode || selectedCompany?.fincode} />
      </div>
    ),
    [fincode, selectedCompany],
  );

  // Main render with memoized tab content
  const tabContent = useMemo(() => {
    switch (activeTab) {
      case "graphs":
        return renderGraphTabContent;
      case "finance":
        return renderFinanceTabContent;
      case "Shareholding":
        return renderShareHoldingTabContent;
      case "Media":
        return renderMediaTabContent;
      case "announcements":
        return renderAnnouncementsTabContent;
      default:
        return renderGraphTabContent;
    }
  }, [
    activeTab,
    renderGraphTabContent,
    renderFinanceTabContent,
    renderShareHoldingTabContent,
    renderAnnouncementsTabContent,
  ]);

  return (
    <div className="font-sans w-full dark:bg-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <div className="dark:bg-slate-800/80 backdrop-blur-lg rounded-xl p-2 border border-slate-200/50 dark:border-slate-700/50 shadow-sm w-full max-w-6xl">
            <div className="flex flex-wrap justify-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`${tab.id}-tabpanel`}
                  id={`${tab.id}-tab`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center px-4 py-2 rounded-xl transition-all duration-300 ease-in-out min-w-[120px] group ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-blue-500/25"
                      : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <div
                    className={`mb-2 transition-transform duration-300 ${
                      activeTab === tab.id
                        ? "scale-110"
                        : "group-hover:scale-105"
                    }`}
                  >
                    {tab.icon}
                  </div>
                  <span className="font-bold text-sm mb-1">{tab.label}</span>
                  <span className="text-xs opacity-80">{tab.description}</span>

                  {activeTab === tab.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          id={`${activeTab}-tabpanel`}
          aria-labelledby={`${activeTab}-tab`}
          role="tabpanel"
          className="dark:bg-slate-900/95 backdrop-blur-md transition-all duration-500 ease-in-out overflow-hidden"
        >
          <div className="p-3 animate-fade-in">{tabContent}</div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(GraphSlider);

