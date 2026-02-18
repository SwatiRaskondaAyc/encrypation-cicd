// import React, { useEffect, useRef, useState, useMemo, useCallback, Suspense } from "react";
// import Slider from "react-slick";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import PortLogin from "./PortLogin";
// import { useYearFilter } from "./context/YearFilterContext";

// // Lazy-load components
// const TopTenScript = React.lazy(() => import("./TopTenScript"));
// const StockDepAmtOverTime = React.lazy(() => import("./StockDepAmtOverTime"));
// const CombinedBox = React.lazy(() => import("./CombinedBox"));
// const CreatePNL = React.lazy(() => import("./CreatePNL"));
// const SwotPlot = React.lazy(() => import("./SwotPlot"));
// const IndSunburst = React.lazy(() => import("./IndSunburst"));
// const UserSunburstDrop = React.lazy(() => import("./UserSunburstDrop"));
// const ComBubChart = React.lazy(() => import("./ComBubChart"));
// const InvAmtPlot = React.lazy(() => import("./InvAmtPlot"));
// const BestTradePlot = React.lazy(() => import("./BestTradePlot"));
// const ClassifyStockRisk = React.lazy(() => import("./ClassifyStockRisk"));
// const EpsBvQuaterly = React.lazy(() => import("./EpsBvQuaterly"));
// const PortfolioResults = React.lazy(() => import("./PortfolioResults"));
// const LatestInsights = React.lazy(() => import("./LatestInsight"));
// const ShortNseTable = React.lazy(() => import("./ShortNseTable"));
// const PortfMatrics = React.lazy(() => import("./PortfMatrics"));

// const GraphSlider = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const sliderRef = useRef(null);
//   const { selectedYear, setSelectedYear } = useYearFilter();
//   const [availableYears, setAvailableYears] = useState(["All"]);

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     setIsLoggedIn(!!token);
//     setAvailableYears(["All", 2021, 2022, 2023, 2024, 2025]);
//   }, []);

//   const handleLogin = useCallback(() => {
//     setIsLoggedIn(true);
//     setShowLogin(false);
//   }, []);

//   const handleYearChange = useCallback((e) => {
//     setSelectedYear(e.target.value);
//   }, [setSelectedYear]);

//   const CustomPrevArrow = useCallback((props) => {
//     const { className, onClick } = props;
//     return (
//       <FaChevronLeft
//         className={`${className} !text-black dark:!text-white text-4xl absolute right-[-20px] z-[1000] cursor-pointer`}
//         onClick={onClick}
//       />
//     );
//   }, []);

//   const CustomNextArrow = useCallback((props) => {
//     const { className, onClick } = props;
//     return (
//       <FaChevronRight
//         className={`${className} !text-black dark:!text-white text-4xl absolute right-[-20px] z-[1000] cursor-pointer`}
//         onClick={onClick}
//       />
//     );
//   }, []);

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

//   const graphComponents = useMemo(() => [
//     { title: "Top Ten Script", Component: TopTenScript },
//     { title: "Stock Dep Amt Over Time", Component: StockDepAmtOverTime },
//     { title: "Combined Box", Component: CombinedBox },
//     { title: "Create PNL", Component: CreatePNL },
//     { title: "Swot Plot", Component: SwotPlot },
//     { title: "Ind Sunburst", Component: IndSunburst },
//     { title: "User Sunburst Drop", Component: UserSunburstDrop },
//     { title: "ComBub Chart", Component: ComBubChart },
//     { title: "Inv Amt Plot", Component: InvAmtPlot },
//     { title: "Best Trade Plot", Component: BestTradePlot },
//     { title: "Classify Stock Risk", Component: ClassifyStockRisk },
//     { title: "EpsBvQuaterly", Component: EpsBvQuaterly },
//   ], []);

//   return (
//     <div className="w-full p-6 flex flex-col items-center">
//       {/* Year Filter */}
//       {/* <select
//         value={selectedYear}
//         onChange={handleYearChange}
//         className="mb-4 px-4 py-2 border rounded shadow"
//       >
//         {availableYears.map((year) => (
//           <option key={year} value={year}>{year}</option>
//         ))}
//       </select> */}

//       {/* Static Graphs */}
//       <Suspense fallback={<div className="text-center">Loading Latest Insights...</div>}>
//         <LatestInsights />
//       </Suspense>
//       <Suspense fallback={<div className="text-center">Loading Short NSE Table...</div>}>
//         <ShortNseTable />
//       </Suspense>
//       <Suspense fallback={<div className="text-center">Loading Portfolio Results...</div>}>
//         <PortfolioResults />
//       </Suspense>
//       <Suspense fallback={<div className="text-center">Loading Portfolio Metrics...</div>}>
//         <PortfMatrics />
//       </Suspense>

//       {/* Slider with Graphs */}
//       <Slider {...settings} ref={sliderRef} key="graph-slider" className="w-full max-w-4xl">
//         {graphComponents.map(({ title, Component }, index) => (
//           <div key={index} className="p-4 relative">
//             <h2 className="text-2xl font-bold text-center mb-3">{title}</h2>

//             <div
//               className={`relative border border-gray-300 rounded-xl shadow-xl p-4 ${
//                 index === 0 || isLoggedIn ? "opacity-100" : "blur-sm opacity-50"
//               } transition-all duration-500`}
//             >
//               <Suspense fallback={<div className="text-center">Loading {title}...</div>}>
//                 <Component />
//               </Suspense>
//             </div>

//             {!isLoggedIn && index !== 0 && (
//               <div className="absolute inset-0 bg-white bg-opacity-40 flex flex-col justify-center items-center rounded-xl">
//                 <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">🔒 Access Denied</h1>
//                 <button onClick={() => setShowLogin(true)}>
//                   <PortLogin onSuccess={handleLogin} />
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </Slider>

//       {/* Login Popup */}
//       {/* {showLogin && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="relative bg-white p-4 rounded shadow-xl">
//             <button
//               className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
//               onClick={() => setShowLogin(false)}
//             >
//               ✖
//             </button>
//             <PortLogin onSuccess={handleLogin} />
//           </div>
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default GraphSlider;


// import React, { useRef } from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import TopTenScript from "./TopTenScript";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import StockDepAmt from "./StockDepAmtOverTime";
// import CombinedBox from "./CombinedBox";
// import CreatePNL from "./CreatePNL";
// import SwotPlot from "./SwotPlot";
// import IndSunburst from "./IndSunburst";
// import UserSunburstDrop from "./UserSunburstDrop";
// import ComBubChart from "./ComBubChart";
// import InvAmtPlot from "./InvAmtPlot";
// import StockDepAmtOverTime from "./StockDepAmtOverTime";
// import BestTradePlot from "./BestTradePlot";
// import ClassifyStockRisk from "./ClassifyStockRisk";
// import PortfolioResults from "./PortfolioResults";
// import LatestInsights from "./LatestInsight";

// const GraphSlider = () => {
//     const sliderRef = useRef(null);

//     const CustomPrevArrow = (props) => (
//         <FaChevronLeft className={props.className} style={{ display: "block", color: "black", fontSize: "24px", left: "-40px", zIndex: 1000 }} onClick={props.onClick} />
//     );

//     const CustomNextArrow = (props) => (
//         <FaChevronRight className={props.className} style={{ display: "block", color: "black", fontSize: "24px", right: "-40px", zIndex: 1000 }} onClick={props.onClick} />
//     );

//     const settings = {
//         fade: true,
//         infinite: true,
//         autoplaySpeed: 5000,
//         slidesToShow: 1,
//         slidesToScroll: 1,
//         swipeToSlide: true,
//         arrows: true,
//         prevArrow: <CustomPrevArrow />, 
//         nextArrow: <CustomNextArrow />, 
//     };

//     return (
//         <div className="w-full p-6">
//                  <section className="w-full flex justify-center items-center border border-gray-300 rounded-box shadow-xl">
//                     <h2 className="text-2xl text-center font-bold mb-3">PortfolioResults</h2>
//                     <PortfolioResults />
//                 </section>

//                 <section className="w-full flex justify-center items-center border border-gray-300 rounded-box shadow-xl">
//                     <h2 className="text-2xl text-center font-bold mb-3">PortfolioResults</h2>
//                     <LatestInsights />
//                 </section>
//             <Slider ref={sliderRef} {...settings}>
//                 <section className="w-full flex justify-center items-center border border-gray-300 rounded-box shadow-xl">
//                     <h2 className="text-2xl text-center font-bold mb-3">Top Ten Script Graph</h2>
//                     <TopTenScript />
//                 </section>
//             </Slider>


//             <section className="w-full flex justify-center items-center border border-gray-300 rounded-box shadow-xl">
//                     <h2 className="text-2xl text-center font-bold mb-3">Stock Dep Amt Over Time</h2>
//                     <StockDepAmtOverTime />
//             </section>

//             <section className="w-full flex justify-center items-center border border-gray-300 rounded-box shadow-xl">
//                     <h2 className="text-2xl text-center font-bold mb-3">CombinedBox</h2>
//                     <CombinedBox />
//             </section>

//             <section className="w-full flex justify-center items-center border border-gray-300 rounded-box shadow-xl">
//                     <h2 className="text-2xl text-center font-bold mb-3">CreatePNL</h2>
//                     <CreatePNL />
//             </section>

//             <section className="w-full flex justify-center items-center border border-gray-300 rounded-box shadow-xl">
//                     <h2 className="text-2xl text-center font-bold mb-3">SwotPlot</h2>
//                     <SwotPlot />
//             </section>

//             <section className="w-full flex justify-center items-center border border-gray-300 rounded-box shadow-xl">
//                     <h2 className="text-2xl text-center font-bold mb-3">IndSunburst</h2>
//                     <IndSunburst />
//             </section>

//             <section className="w-full flex justify-center items-center border border-gray-300 rounded-box shadow-xl">
//                     <h2 className="text-2xl text-center font-bold mb-3">UserSunburstDrop</h2>
//                     <UserSunburstDrop />
//             </section>

//             {/* <section className="w-full flex justify-center items-center border border-gray-300 rounded-box shadow-xl">
//                     <h2 className="text-2xl text-center font-bold mb-3"></h2>
//                     <CombinedBox />
//             </section> */}

//             <section className="w-full flex justify-center items-center border border-gray-300 rounded-box shadow-xl">
//                     <h2 className="text-2xl text-center font-bold mb-3">ComBubChart</h2>
//                     <ComBubChart />
//             </section>

            
//             <section className="w-full flex justify-center items-center border border-gray-300 rounded-box shadow-xl">
//                     <h2 className="text-2xl text-center font-bold mb-3">InvAmtPlot</h2>
//                     <InvAmtPlot />
//             </section>

//             <section className="w-full flex justify-center items-center border border-gray-300 rounded-box shadow-xl">
//                     <h2 className="text-2xl text-center font-bold mb-3">BestTradePlot</h2>
//                     <BestTradePlot />
//             </section>

//             <section className="w-full flex justify-center items-center border border-gray-300 rounded-box shadow-xl">
//                     <h2 className="text-2xl text-center font-bold mb-3">ClassifyStockRisk</h2>
//                     <ClassifyStockRisk />
//             </section>

            
//         </div>
//     );
// };

// export default GraphSlider;



// import React, { useEffect, useState } from "react";
// import { FaLock, FaTimes } from "react-icons/fa";
// import JwtUtil from "../../services/JwtUtil"; 

// // Import all graph components
// import TopTenScript from "./TopTenScript";
// import StockDepAmtOverTime from "./StockDepAmtOverTime";
// import CombinedBox from "./CombinedBox";
// import CreatePNL from "./CreatePNL";
// import SwotPlot from "./SwotPlot";
// import IndSunburst from "./IndSunburst";
// import UserSunburstDrop from "./UserSunburstDrop";
// import ComBubChart from "./ComBubChart";
// import InvAmtPlot from "./InvAmtPlot";
// import BestTradePlot from "./BestTradePlot";
// import ClassifyStockRisk from "./ClassifyStockRisk";
// import PortfolioResults from "./PortfolioResults";
// import LatestInsights from "./LatestInsight";
// import Login from "../Login";

// const GraphSlider = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [showLogin, setShowLogin] = useState(false);

//     // Simulated login function
//     const handleLogin = () => {
//         setIsLoggedIn(true);
//         setShowLogin(false);
//     };

//     const token = localStorage.getItem("authToken");
    
//       useEffect(() => {
//         if (!token) {
//           setIsLoggedIn(false);
//         } else {
//           setIsLoggedIn(true);
//         //   fetchUserDetails();
//         }
//       }, []);

      

//     return (
//         <div className="w-full p-6 flex flex-col items-center">
//                 <section className="w-full flex justify-center items-center border border-gray-300 rounded-box shadow-xl">
//                      <h2 className="text-2xl text-center font-bold mb-3">Top Ten Script Graph</h2>
//                      <TopTenScript />
//                  </section>

//                  <section className="mt-10 w-full flex justify-center items-center border border-gray-300 rounded-box shadow-xl">
//                      <h2 className="text-2xl text-center font-bold mb-3">Stock Dep Amt Over Time</h2>
//                      <StockDepAmtOverTime />
//              </section>
//             {/* Login Popup */}
//             {showLogin && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//                     <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
//                         <button
//                             className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
//                         //     onClick={() => document.getElementById("my_modal_3").showModal()}
//                         >
//                             <FaTimes size={20} />
//                         </button>
                       
//                         <Login/>
//                     </div>
//                 </div>
//             )}

//             {/* Graphs Container */}
//             <div className="w-full flex flex-col items-center gap-6">
//                 {[
//                 //     { title: "Top Ten Script", Component: TopTenScript },
//                     { title: "Portfolio Results", Component: PortfolioResults },
//                     { title: "Latest Insights", Component: LatestInsights },
//                 //     { title: "Stock Dep Amt Over Time", Component: StockDepAmtOverTime },
//                     { title: "Combined Box", Component: CombinedBox },
//                     { title: "Create PNL", Component: CreatePNL },
//                     { title: "Swot Plot", Component: SwotPlot },
//                     { title: "Ind Sunburst", Component: IndSunburst },
//                     { title: "User Sunburst Drop", Component: UserSunburstDrop },
//                     { title: "ComBub Chart", Component: ComBubChart },
//                     { title: "Inv Amt Plot", Component: InvAmtPlot },
//                     { title: "Best Trade Plot", Component: BestTradePlot },
//                     { title: "Classify Stock Risk", Component: ClassifyStockRisk },
//                 ].map(({ title, Component }, index) => (
//                     <div key={index} className="relative w-full max-w-3xl">
//                         {/* Graph Title */}
//                         <h2 className="text-2xl font-bold text-center mb-3">{title}</h2>
                        
//                         {/* Graph with Blur Effect */}
//                         <div
//                             className={`relative w-full border border-gray-300 rounded-xl shadow-xl p-4 ${
//                                 !isLoggedIn ? "blur-sm opacity-50" : "blur-0 opacity-100"
//                             } transition-all duration-500`}
//                         >
//                             <Component />
//                         </div>

//                         {/* Lock Overlay */}
//                         {!isLoggedIn && (
//                             <div className="absolute inset-0 bg-white bg-opacity-40 flex flex-col justify-center items-center rounded-xl">
                               
//                                  <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">🔒 Access Denied</h1>
                                    
//                                     <button
//                                       onClick={() => document.getElementById("my_modal_3").showModal()}
                                     
//                                     >
                                     
//                                     </button>
                                   
//                                     <Login/>
                                
//                             </div>

                       
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default GraphSlider;



// import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import { FaChevronLeft, FaChevronRight, FaLock, FaTimes } from "react-icons/fa";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Login from "../Login";
// // Import all graph components
// import TopTenScript from "./TopTenScript";
// import StockDepAmtOverTime from "./StockDepAmtOverTime";
// import CombinedBox from "./CombinedBox";
// import CreatePNL from "./CreatePNL";
// import SwotPlot from "./SwotPlot";
// import IndSunburst from "./IndSunburst";
// import UserSunburstDrop from "./UserSunburstDrop";
// import ComBubChart from "./ComBubChart";
// import InvAmtPlot from "./InvAmtPlot";
// import BestTradePlot from "./BestTradePlot";
// import ClassifyStockRisk from "./ClassifyStockRisk";
// import PortfolioResults from "./PortfolioResults";
// import LatestInsights from "./LatestInsight";


// const GraphSlider = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [showLogin, setShowLogin] = useState(false);

//     const token = localStorage.getItem("authToken");

//     useEffect(() => {
//         setIsLoggedIn(!!token);
//     }, []);

//     // React Slick settings
//    const CustomPrevArrow = (props) => {
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


//     const graphComponents = [
//         { title: "Top Ten Script", Component: TopTenScript },
//         { title: "Portfolio Results", Component: PortfolioResults },
//         { title: "Latest Insights", Component: LatestInsights },
//         { title: "Stock Dep Amt Over Time", Component: StockDepAmtOverTime },
//         { title: "Combined Box", Component: CombinedBox },
//         { title: "Create PNL", Component: CreatePNL },
//         { title: "Swot Plot", Component: SwotPlot },
//         { title: "Ind Sunburst", Component: IndSunburst },
//         { title: "User Sunburst Drop", Component: UserSunburstDrop },
//         { title: "ComBub Chart", Component: ComBubChart },
//         { title: "Inv Amt Plot", Component: InvAmtPlot },
//         { title: "Best Trade Plot", Component: BestTradePlot },
//         { title: "Classify Stock Risk", Component: ClassifyStockRisk },
//     ];

//     return (
//         <div className="w-full p-6 flex flex-col items-center">
//             {/* Graphs Slider */}
//             <Slider {...settings} className="w-full max-w-4xl">
//                 {graphComponents.map(({ title, Component }, index) => (
//                     <div key={index} className="p-4">
//                         {/* Graph Title */}
//                         <h2 className="text-2xl font-bold text-center mb-3">{title}</h2>
//                         <TopTenScript/>
//                         {/* Graph with Blur Effect */}
//                         <div
//                             className={`relative border border-gray-300 rounded-xl shadow-xl p-4 ${
//                                 !isLoggedIn ? "blur-sm opacity-50" : "blur-0 opacity-100"
//                             } transition-all duration-500`}
//                         >
//                             <Component />
//                         </div>

//                         {/* Lock Overlay */}
//                         {!isLoggedIn && (
//                             <div className="absolute inset-0 bg-white bg-opacity-40 flex flex-col justify-center items-center rounded-xl">
//                                 <h1 className="text-3xl font-bold mb-4 text-gray-900">
//                                     🔒 Access Denied
//                                 </h1>
//                                 <button
//                                     onClick={() => setShowLogin(true)}
//                                     className="bg-blue-500 text-white px-4 py-2 rounded-md"
//                                 >
//                                     Login to View
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </Slider>

//             {/* Login Popup */}
//             {showLogin && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//                     <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
//                         <button
//                             className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
//                             onClick={() => setShowLogin(false)}
//                         >
//                             <FaTimes size={20} />
//                         </button>
//                         <Login />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default GraphSlider;

// import React, { useEffect, useRef, useState } from "react";
// import Slider from "react-slick";
// import { FaChevronLeft, FaChevronRight, FaLock, FaTimes } from "react-icons/fa";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Login from "../Login";

// // Import all graph components
// import TopTenScript from "./TopTenScript";
// import StockDepAmtOverTime from "./StockDepAmtOverTime";
// import CombinedBox from "./CombinedBox";
// import CreatePNL from "./CreatePNL";
// import SwotPlot from "./SwotPlot";
// import IndSunburst from "./IndSunburst";
// import UserSunburstDrop from "./UserSunburstDrop";
// import ComBubChart from "./ComBubChart";
// import InvAmtPlot from "./InvAmtPlot";
// import BestTradePlot from "./BestTradePlot";
// import ClassifyStockRisk from "./ClassifyStockRisk";
// import PortfolioResults from "./PortfolioResults";
// import LatestInsights from "./LatestInsight";
// import PortLogin from "./PortLogin";
// import ShortNseTable from "./ShortNseTable";
// import PortfMatrics from "./PortfMatrics";
// import { useYearFilter } from "./context/YearFilterContext";
// import EpsBvQuaterly from "./EpsBvQuaterly";
// import PortfolioChart from "./PortfolioChart";
// import TimeSeriesChart from "./TimeChart";


// // const GraphSlider = () => {
// //     const [isLoggedIn, setIsLoggedIn] = useState(false);
// //     const [showLogin, setShowLogin] = useState(false);
// //     const sliderRef=useRef(null)

// const GraphSlider = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [showLogin, setShowLogin] = useState(false);
//     const sliderRef = useRef(null);
//     const { selectedYear, setSelectedYear } = useYearFilter();
//     const [availableYears, setAvailableYears] = useState(["All"]);
    
  
//     useEffect(() => {
//       setAvailableYears(["All", 2021, 2022, 2023, 2024, 2025]);
//     }, []);
  
  

   
    
//     useEffect(() => {
//         const token = localStorage.getItem("authToken");
//         setIsLoggedIn(!!token)
//     }, []);


//     const handleLogin = () => {
//         setIsLoggedIn(true);
//         setShowLogin(false);
//     };

   

//     // React Slick settings
//     const CustomPrevArrow = (props) => {
//             const { className, onClick } = props;
//             return (
//               <FaChevronLeft
//                   className={`${className} !text-black dark:!text-white text-8xl absolute right-[-20px] z-[1000] cursor-pointer`}
//               onClick={onClick}
//               />
//             );
//           };
          
//           const CustomNextArrow = (props) => {
//             const { className, onClick } = props;
//             return (
//               <FaChevronRight
//               className={`${className} !text-black dark:!text-white text-8xl absolute right-[-20px] z-[1000] cursor-pointer`}
//               onClick={onClick}
//               />
//             );
//           };
        
//           const settings = {
//             // dots: true,
//             fade: true,
//             infinite: true,
//             autoplaySpeed: 5000,
//             slidesToShow: 1,
//             slidesToScroll: 1,
//             swipeToSlide: true,
//             arrows:true,
//             lazyLoad: "ondemand", // load only when needed
//             prevArrow: <CustomPrevArrow/>,
//             nextArrow: <CustomNextArrow/>,
//           };

//     // Graph Components List
//     const graphComponents = [

//         // { title: "Portfolio", Component: PortfolioChart }, //TimeSeriesChart
//         // { title: "Portfolio", Component: TimeSeriesChart },
      
//        { title: "Top Ten Script", Component: TopTenScript },

//         // { title: "Portfolio Results", Component: PortfolioResults },
//         // { title: "Latest Insights", Component: LatestInsights },

//         { title: "Stock Dep Amt Over Time", Component: StockDepAmtOverTime },
//          { title: "Combined Box", Component: CombinedBox },
//          { title: "Create PNL", Component: CreatePNL },
//         { title: "Swot Plot", Component: SwotPlot },
//          { title: "Ind Sunburst", Component: IndSunburst },
//         { title: "User Sunburst Drop", Component: UserSunburstDrop },
//         { title: "ComBub Chart", Component: ComBubChart  },
//         { title: "Inv Amt Plot", Component: InvAmtPlot },
//         { title: "Best Trade Plot", Component: BestTradePlot },
//         { title: "Classify Stock Risk", Component: ClassifyStockRisk },
//         { title: "EpsBvQuaterly", Component: EpsBvQuaterly },

 

//         // { title: "Short Qty Table", Component: ShortNseTable },
//     ];

//     return (
//         <div className="w-full p-6 flex flex-col items-center">
//             {/* Graphs Slider */}

          
//               <LatestInsights/>
//             <ShortNseTable/>
//             <PortfolioResults/>
//             <PortfMatrics/>  
//             {/* Year Filter */}
//       <select
//         value={selectedYear}
//         onChange={(e) => setSelectedYear(e.target.value)}
//         className="mb-4 px-4 py-2 border rounded shadow"
//       >
//         {availableYears.map((year) => (
//           <option key={year} value={year}>
//             {year}
//           </option>
//         ))}
//       </select>
      
           
            
//             <Slider {...settings} ref={sliderRef} key="graph-slider" className="w-full max-w-4xl">
//                 {graphComponents.map(({ title, Component }, index) => (
//                     <div key={index} className="p-4 relative">
//                         {/* Graph Title */}
//                         <h2 className="text-2xl font-bold text-center mb-3">{title}</h2>

//                         {/* Graph with Lock Effect */}
//                         <div
//                             className={`relative border border-gray-300 rounded-xl shadow-xl p-4 ${
//                                 index === 0 || isLoggedIn ? "opacity-100" : "blur-sm opacity-50"
//                             } transition-all duration-500`}
//                         >
//                             <Component />
//                         </div>

//                         {/* Lock Overlay (Except for First Graph) */}
//                         {/* {!isLoggedIn && index !== 0 && (
//                             <div className="absolute inset-0 bg-white bg-opacity-40 flex flex-col justify-center items-center rounded-xl">
//                                 <h1 className="text-3xl font-bold mb-4 text-gray-900">
//                                     🔒 Locked
//                                 </h1>
//                                 <button
//                                     onClick={() => setShowLogin(true)}
//                                     className="bg-blue-500 text-white px-4 py-2 rounded-md"
//                                 >
//                                     Login to View
//                                 </button>
//                             </div>
//                         )} */}
//                          {!isLoggedIn && index !== 0 && (
//                             <div className="absolute inset-0 bg-white bg-opacity-40 flex flex-col justify-center items-center rounded-xl">
                               
//                                  <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">🔒 Access Denied</h1>
                                    
//                                     <button
//                                       onClick={() => setShowLogin(true)}
//                                     > 
//                                     <PortLogin onSuccess={handleLogin} />
//                                     </button>
//                             </div>

                       
//                         )}
//                     </div>
//                 ))}
//             </Slider>

//             {/* Login Popup */}
//             {showLogin && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//                     <div>
//                         <button
//                             className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
//                             onClick={() =>setShowLogin(false)}
//                         >
//                             ✖
//                         </button>
//                         <PortLogin onSuccess={handleLogin} />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default GraphSlider;

// import React, { useEffect, useRef, useState, useMemo, useCallback, Suspense } from "react";
// import Slider from "react-slick";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import PortLogin from "./PortLogin";
// import { useYearFilter } from "./context/YearFilterContext";

// // Lazy-load components
// const TopTenScript = React.lazy(() => import("./TopTenScript"));
// const StockDepAmtOverTime = React.lazy(() => import("./StockDepAmtOverTime"));
// const CombinedBox = React.lazy(() => import("./CombinedBox"));
// const CreatePNL = React.lazy(() => import("./CreatePNL"));
// const SwotPlot = React.lazy(() => import("./SwotPlot"));
// const IndSunburst = React.lazy(() => import("./IndSunburst"));
// const UserSunburstDrop = React.lazy(() => import("./UserSunburstDrop"));
// const ComBubChart = React.lazy(() => import("./ComBubChart"));
// const InvAmtPlot = React.lazy(() => import("./InvAmtPlot"));
// const BestTradePlot = React.lazy(() => import("./BestTradePlot"));
// const ClassifyStockRisk = React.lazy(() => import("./ClassifyStockRisk"));
// const EpsBvQuaterly = React.lazy(() => import("./EpsBvQuaterly"));
// const PortfolioResults = React.lazy(() => import("./PortfolioResults"));
// const LatestInsights = React.lazy(() => import("./LatestInsight"));
// const ShortNseTable = React.lazy(() => import("./ShortNseTable"));
// const PortfMatrics = React.lazy(() => import("./PortfMatrics"));

// const GraphSlider = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const sliderRef = useRef(null);
//   const { selectedYear, setSelectedYear } = useYearFilter();
//   const [availableYears, setAvailableYears] = useState(["All"]);

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     setIsLoggedIn(!!token);
//     setAvailableYears(["All", 2021, 2022, 2023, 2024, 2025]);
//   }, []);

//   const handleLogin = useCallback(() => {
//     setIsLoggedIn(true);
//     setShowLogin(false);
//   }, []);

//   const handleYearChange = useCallback((e) => {
//     setSelectedYear(e.target.value);
//   }, [setSelectedYear]);

//   const CustomPrevArrow = useCallback((props) => {
//     const { className, onClick } = props;
//     return (
//       <FaChevronLeft
//         className={`${className} !text-black dark:!text-white text-4xl absolute right-[-20px] z-[1000] cursor-pointer`}
//         onClick={onClick}
//       />
//     );
//   }, []);

//   const CustomNextArrow = useCallback((props) => {
//     const { className, onClick } = props;
//     return (
//       <FaChevronRight
//         className={`${className} !text-black dark:!text-white text-4xl absolute right-[-20px] z-[1000] cursor-pointer`}
//         onClick={onClick}
//       />
//     );
//   }, []);

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

//   const graphComponents = useMemo(() => [
//     { title: "Top Ten Script", Component: TopTenScript },
//     { title: "Stock Dep Amt Over Time", Component: StockDepAmtOverTime },
//     { title: "Combined Box", Component: CombinedBox },
//     { title: "Create PNL", Component: CreatePNL },
//     { title: "Swot Plot", Component: SwotPlot },
//     { title: "Ind Sunburst", Component: IndSunburst },
//     { title: "User Sunburst Drop", Component: UserSunburstDrop },
//     { title: "ComBub Chart", Component: ComBubChart },
//     { title: "Inv Amt Plot", Component: InvAmtPlot },
//     { title: "Best Trade Plot", Component: BestTradePlot },
//     { title: "Classify Stock Risk", Component: ClassifyStockRisk },
//     { title: "EpsBvQuaterly", Component: EpsBvQuaterly },
//   ], []);

//   return (
//     <div className="w-full p-6 flex flex-col items-center">
//       {/* Year Filter */}
//       {/* <select
//         value={selectedYear}
//         onChange={handleYearChange}
//         className="mb-4 px-4 py-2 border rounded shadow"
//       >
//         {availableYears.map((year) => (
//           <option key={year} value={year}>{year}</option>
//         ))}
//       </select> */}

//       {/* Static Graphs */}
//       <Suspense fallback={<div className="text-center">Loading Latest Insights...</div>}>
//         <LatestInsights />
//       </Suspense>
//       <Suspense fallback={<div className="text-center">Loading Short NSE Table...</div>}>
//         <ShortNseTable />
//       </Suspense>
//       <Suspense fallback={<div className="text-center">Loading Portfolio Results...</div>}>
//         <PortfolioResults />
//       </Suspense>
//       <Suspense fallback={<div className="text-center">Loading Portfolio Metrics...</div>}>
//         <PortfMatrics />
//       </Suspense>

//       {/* Slider with Graphs */}
//       <Slider {...settings} ref={sliderRef} key="graph-slider" className="w-full max-w-5xl">
//         {graphComponents.map(({ title, Component }, index) => (
//           <div key={index} className="p-4 relative">
//             <h2 className="text-2xl font-bold text-center mb-3">{title}</h2>

//             <div
//               className={`relative   p-4 ${
//                 index === 0 || isLoggedIn ? "opacity-100" : "blur-sm opacity-50"
//               } transition-all duration-500`}
//             >
//               <Suspense fallback={<div className="text-center">Loading {title}...</div>}>
//                 <Component />
//               </Suspense>
//             </div>

//             {!isLoggedIn && index !== 0 && (
//               <div className="absolute inset-0 bg-white bg-opacity-40 flex flex-col justify-center items-center rounded-xl">
//                 <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">🔒 Access Denied</h1>
//                 <button onClick={() => setShowLogin(true)}>
//                   <PortLogin onSuccess={handleLogin} />
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </Slider>

//       {/* Login Popup */}
//       {/* {showLogin && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="relative bg-white p-4 rounded shadow-xl">
//             <button
//               className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
//               onClick={() => setShowLogin(false)}
//             >
//               ✖
//             </button>
//             <PortLogin onSuccess={handleLogin} />
//           </div>
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default GraphSlider;

// import React, { useEffect, useRef, useState, useMemo, useCallback, Suspense } from "react";
// import Slider from "react-slick";
// import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import PortLogin from "./PortLogin";
// import { useYearFilter } from "./context/YearFilterContext";

// // Lazy-load components
// const TopTenScript = React.lazy(() => import("./TopTenScript"));
// const StockDepAmtOverTime = React.lazy(() => import("./StockDepAmtOverTime"));
// const CombinedBox = React.lazy(() => import("./CombinedBox"));
// const CreatePNL = React.lazy(() => import("./CreatePNL"));
// const SwotPlot = React.lazy(() => import("./SwotPlot"));
// const IndSunburst = React.lazy(() => import("./IndSunburst"));
// const UserSunburstDrop = React.lazy(() => import("./UserSunburstDrop"));
// const ComBubChart = React.lazy(() => import("./ComBubChart"));
// const InvAmtPlot = React.lazy(() => import("./InvAmtPlot"));
// const BestTradePlot = React.lazy(() => import("./BestTradePlot"));
// const ClassifyStockRisk = React.lazy(() => import("./ClassifyStockRisk"));
// const EpsBvQuaterly = React.lazy(() => import("./EpsBvQuaterly"));
// const PortfolioResults = React.lazy(() => import("./PortfolioResults"));
// const LatestInsights = React.lazy(() => import("./LatestInsight"));
// const ShortNseTable = React.lazy(() => import("./ShortNseTable"));
// const PortfMatrics = React.lazy(() => import("./PortfMatrics"));

// const GraphSlider = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const [selectedGraph, setSelectedGraph] = useState(null);
//   const sliderRef = useRef(null);
//   const { selectedYear, setSelectedYear } = useYearFilter();
//   const [availableYears, setAvailableYears] = useState(["All"]);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 480);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     setIsLoggedIn(!!token);
//     setAvailableYears(["All", 2021, 2022, 2023, 2024, 2025]);
//   }, []);

//   const handleLogin = useCallback(() => {
//     setIsLoggedIn(true);
//     setShowLogin(false);
//   }, []);

//   const handleYearChange = useCallback((e) => {
//     setSelectedYear(e.target.value);
//   }, [setSelectedYear]);

//   const CustomPrevArrow = useCallback((props) => {
//     const { className, onClick } = props;
//     return (
//       <FaChevronLeft
//         className={`${className} !text-black dark:!text-white text-2xl sm:text-3xl md:text-4xl absolute left-[-20px] sm:left-[-30px] z-[1000] cursor-pointer`}
//         onClick={onClick}
//       />
//     );
//   }, []);

//   const CustomNextArrow = useCallback((props) => {
//     const { className, onClick } = props;
//     return (
//       <FaChevronRight
//         className={`${className} !text-black dark:!text-white text-2xl sm:text-3xl md:text-4xl absolute right-[-20px] sm:right-[-30px] z-[1000] cursor-pointer`}
//         onClick={onClick}
//       />
//     );
//   }, []);

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
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: { arrows: true, slidesToShow: 1 },
//       },
//       {
//         breakpoint: 768,
//         settings: { arrows: true, slidesToShow: 1 },
//       },
//       {
//         breakpoint: 480,
//         settings: { arrows: false, swipeToSlide: true, autoplay: true },
//       },
//     ],
//   }), []);

//   const graphComponents = useMemo(
//     () => [
//       {
//         title: "Top Ten Script",
//         Component: TopTenScript,
//         imageUrl: "public/assets/gaph1.png",
//       },
//       {
//         title: "Stock Dep Amt Over Time",
//         Component: StockDepAmtOverTime,
//         imageUrl: "public/assets/gaph1.png",
//       },
//       {
//         title: "Combined Box",
//         Component: CombinedBox,
//         imageUrl: "public/assets/gaph1.png",
//       },
//       {
//         title: "Create PNL",
//         Component: CreatePNL,
//         imageUrl: "public/assets/gaph1.png",
//       },
//       {
//         title: "Swot Plot",
//         Component: SwotPlot,
//         imageUrl: "public/assets/gaph1.png",
//       },
//       {
//         title: "Ind Sunburst",
//         Component: IndSunburst,
//         imageUrl: "public/assets/gaph1.png",
//       },
//       {
//         title: "User Sunburst Drop",
//         Component: UserSunburstDrop,
//         imageUrl: "public/assets/gaph1.png",
//       },
//       {
//         title: "ComBub Chart",
//         Component: ComBubChart,
//         imageUrl: "public/assets/gaph1.png",
//       },
//       {
//         title: "Inv Amt Plot",
//         Component: InvAmtPlot,
//         imageUrl: "public/assets/gaph1.png",
//       },
//       {
//         title: "Best Trade Plot",
//         Component: BestTradePlot,
//         imageUrl: "public/assets/gaph1.png",
//       },
//       {
//         title: "Classify Stock Risk",
//         Component: ClassifyStockRisk,
//         imageUrl: "public/assets/gaph1.png",
//       },
//       {
//         title: "EpsBvQuaterly",
//         Component: EpsBvQuaterly,
//         imageUrl: "public/assets/gaph1.png",
//       },
//     ],
//     []
//   );

//   const handleCardClick = useCallback(
//     (graph, index) => {
//       if (index === 0 || isLoggedIn) {
//         setSelectedGraph(graph);
//       } else {
//         setShowLogin(true);
//       }
//     },
//     [isLoggedIn]
//   );

//   return (
//     <div className="w-full  flex flex-col items-center min-h-screen">
//       {/* Year Filter */}
//       <select
//         value={selectedYear}
//         onChange={handleYearChange}
//         className="mb-4 w-full max-w-xs sm:max-w-sm  border rounded shadow text-sm sm:text-base"
//       >
//         {availableYears.map((year) => (
//           <option key={year} value={year}>{year}</option>
//         ))}
//       </select>

//       {/* Static Graphs */}
//       <div className="w-full max-w-full sm:max-w-4xl lg:max-w-5xl space-y-6">
//         <Suspense fallback={<div className="w-full text-center text-sm sm:text-base">Loading Latest Insights...</div>}>
//           <LatestInsights />
//         </Suspense>
//         <Suspense fallback={<div className="text-center text-sm sm:text-base">Loading Short NSE Table...</div>}>

//           <ShortNseTable />
//         </Suspense>
//         <Suspense fallback={<div className="text-center text-sm sm:text-base">Loading Portfolio Results...</div>}>
//           <PortfolioResults />
//         </Suspense>
//         <Suspense fallback={<div className="text-center text-sm sm:text-base">Loading Portfolio Metrics...</div>}>
//           <PortfMatrics />
//         </Suspense>
//       </div>

//       {/* Graph Display: Cards on Mobile, Slider on Larger Screens */}
//       {isMobile ? (
//         <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
//           {graphComponents.map(({ title, imageUrl, Component }, index) => (
//             <div
//               key={index}
//               className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//               onClick={() => handleCardClick({ title, Component, index }, index)}
//               aria-label={`Open ${title} graph`}
//             >
//               <img
//                 src={imageUrl}
//                 alt={`${title} preview`}
//                 className={`w-full h-24 sm:h-32 object-cover rounded ${
//                   index === 0 || isLoggedIn ? "opacity-100" : "blur-sm opacity-50"
//                 }`}
//               />
//               <h3 className="text-sm font-semibold text-center mt-2">{title}</h3>
//               {!isLoggedIn && index !== 0 && (
//                 <div className="absolute inset-0 bg-white bg-opacity-40 flex justify-center items-center rounded">
//                   <span className="text-xs font-bold">🔒 Locked</span>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="w-full max-w-full sm:max-w-4xl lg:max-w-5xl mt-6">
//           <Slider {...settings} ref={sliderRef} key="graph-slider">
//             {graphComponents.map(({ title, Component }, index) => (
//               <div key={index} className="px-2 sm:px-4">
//                 <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-3">{title}</h2>
//                 <div
//                   className={`relative p-2 sm:p-4 ${
//                     index === 0 || isLoggedIn ? "opacity-100" : "blur-sm opacity-50"
//                   } transition-all duration-500`}
//                 >
//                   <Suspense fallback={<div className="text-center text-sm sm:text-base">Loading {title}...</div>}>
//                     <Component />
//                   </Suspense>
//                 </div>
//                 {!isLoggedIn && index !== 0 && (
//                   <div className="absolute inset-0 bg-white bg-opacity-40 flex flex-col justify-center items-center rounded-xl">
//                     <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
//                       🔒 Access Denied
//                     </h1>
//                     <button
//                       onClick={() => setShowLogin(true)}
//                       className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
//                     >
//                       Login
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </Slider>
//         </div>
//       )}

//       {/* Full-Screen Graph Modal */}
//       {selectedGraph && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 px-4">
//           <div className="relative w-full h-full max-w-full max-h-full bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg overflow-auto">
//             <button
//               className="absolute top-4 right-4 text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white text-lg sm:text-xl"
//               onClick={() => setSelectedGraph(null)}
//               aria-label="Close graph"
//             >
//               <FaTimes />
//             </button>
//             <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4">
//               {selectedGraph.title}
//             </h2>
//             <div className="w-full h-[calc(100%-4rem)]">
//               <Suspense fallback={<div className="text-center text-sm sm:text-base">Loading {selectedGraph.title}...</div>}>
//                 <selectedGraph.Component />
//               </Suspense>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Login Popup */}
//       {showLogin && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
//           <div className="relative bg-white p-4 sm:p-6 rounded shadow-xl w-full max-w-md sm:max-w-lg">
//             <button
//               className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-lg sm:text-xl"
//               onClick={() => setShowLogin(false)}
//             >
//               <FaTimes />
//             </button>
//             <PortLogin onSuccess={handleLogin} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GraphSlider;


// import React, { useEffect, useState, useMemo, useCallback, Suspense } from "react";
// import { FaTimes } from "react-icons/fa";
// import PortLogin from "./PortLogin";
// import { useYearFilter } from "./context/YearFilterContext";
// import Top_TenScript from '/public/assets/top_ten.png'
// import Stock_DepAmtOverTime from '/public/assets/deploed_amount.png'
// import Combined_Box  from '/public/assets/turnover_box.png'
// import Create_PNL from '/public/assets/market_value.png'
// import Swot_Plot from '/public/assets/swot_plot.png'
// import Ind_Sunburst from '/public/assets/industry_sunburst.png'
// import User_SunburstDrop from '/public/assets/industry_insights.png'
// import ComBub_Chart from '/public/assets/industry_bubble.png'
// import Inv_AmtPlot from '/public/assets/invest_amount.png'
// import Best_TradePlot from '/public/assets/best_trades.png'
// import Classify_StockRisk from '/public/assets/stock_risk.png'
// import Eps_BvQuaterly from '/public/assets/earning_plus.png'
    

// // Lazy-load components
// const TopTenScript = React.lazy(() => import("./TopTenScript"));
// const StockDepAmtOverTime = React.lazy(() => import("./StockDepAmtOverTime"));
// const CombinedBox = React.lazy(() => import("./CombinedBox"));
// const CreatePNL = React.lazy(() => import("./CreatePNL"));
// const SwotPlot = React.lazy(() => import("./SwotPlot"));
// const IndSunburst = React.lazy(() => import("./IndSunburst"));
// const UserSunburstDrop = React.lazy(() => import("./UserSunburstDrop"));
// const ComBubChart = React.lazy(() => import("./ComBubChart"));
// const InvAmtPlot = React.lazy(() => import("./InvAmtPlot"));
// const BestTradePlot = React.lazy(() => import("./BestTradePlot"));
// const ClassifyStockRisk = React.lazy(() => import("./ClassifyStockRisk"));
// const EpsBvQuaterly = React.lazy(() => import("./EpsBvQuaterly"));
// const PortfolioResults = React.lazy(() => import("./PortfolioResults"));
// const LatestInsights = React.lazy(() => import("./LatestInsight"));
// const ShortNseTable = React.lazy(() => import("./ShortNseTable"));
// const PortfMatrics = React.lazy(() => import("./PortfMatrics"));

// const GraphSlider = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const [selectedGraph, setSelectedGraph] = useState(null);
//   // const { selectedYear, setSelectedYear } = useYearFilter();
//   // const [availableYears, setAvailableYears] = useState(["All"]);

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     setIsLoggedIn(!!token);
//     // setAvailableYears(["All", 2021, 2022, 2023, 2024, 2025]);
//   }, []);

//   const handleLogin = useCallback(() => {
//     setIsLoggedIn(true);
//     setShowLogin(false);
//   }, []);

//   // const handleYearChange = useCallback((e) => {
//   //   setSelectedYear(e.target.value);
//   // }, [setSelectedYear]);

//   const graphComponents = useMemo(
//     () => [
//       {
//         title: "Top Ten Script",
//         Component: TopTenScript,
//         imageUrl: Top_TenScript,
//       },
//       {
//         title: "Stock Dep Amt Over Time",
//         Component: StockDepAmtOverTime,
//         imageUrl: Stock_DepAmtOverTime,
//       },
//       {
//         title: "Combined Box",
//         Component: CombinedBox,
//         imageUrl: Combined_Box,
//       },
//       {
//         title: "Create PNL",
//         Component: CreatePNL,
//         imageUrl: Create_PNL,
//       },
//       {
//         title: "Swot Plot",
//         Component: SwotPlot,
//         imageUrl: Swot_Plot,
//       },
//       {
//         title: "Ind Sunburst",
//         Component: IndSunburst,
//         imageUrl: Ind_Sunburst,
//       },
//       {
//         title: "User Sunburst Drop",
//         Component: UserSunburstDrop,
//         imageUrl: User_SunburstDrop,
//       },
//       {
//         title: "ComBub Chart",
//         Component: ComBubChart,
//         imageUrl: ComBub_Chart,
//       },
//       {
//         title: "Inv Amt Plot",
//         Component: InvAmtPlot,
//         imageUrl: Inv_AmtPlot,
//       },
//       {
//         title: "Best Trade Plot",
//         Component: BestTradePlot,
//         imageUrl: Best_TradePlot,
//       },
//       {
//         title: "Classify Stock Risk",
//         Component: ClassifyStockRisk,
//         imageUrl: Classify_StockRisk,
//       },
//       {
//         title: "EpsBvQuaterly",
//         Component: EpsBvQuaterly,
//         imageUrl: Eps_BvQuaterly,
//       },
//     ],
//     []
//   );

//   const handleCardClick = useCallback(
//     (graph, index) => {
//       if (index === 0 || isLoggedIn) {
//         setSelectedGraph(graph);
//       } else {
//         setShowLogin(true);
//       }
//     },
//     [isLoggedIn]
//   );

//   return (
//     <div className="w-full flex flex-col items-center min-h-screen">
//       {/* Year Filter */}
//       {/* <select
//         value={selectedYear}
//         onChange={handleYearChange}
//         className="mb-4 w-full max-w-xs sm:max-w-sm border rounded shadow text-sm sm:text-base"
//       >
//         {availableYears.map((year) => (
//           <option key={year} value={year}>{year}</option>
//         ))}
//       </select> */}

//       {/* Static Graphs */}
//       <div className="w-full max-w-full sm:max-w-4xl lg:max-w-5xl space-y-6">
//         <Suspense fallback={<div className="w-full text-center text-sm sm:text-base">Loading Latest Insights...</div>}>
//           <LatestInsights />
//         </Suspense>
//         <Suspense fallback={<div className="text-center text-sm sm:text-base">Loading Short NSE Table...</div>}>
//           <ShortNseTable />
//         </Suspense>
//         <Suspense fallback={<div className="text-center text-sm sm:text-base">Loading Portfolio Results...</div>}>
//           <PortfolioResults />
//         </Suspense>
//         <Suspense fallback={<div className="text-center text-sm sm:text-base">Loading Portfolio Metrics...</div>}>
//           <PortfMatrics />
//         </Suspense>
//       </div>

//       {/* Graph Cards */}
//       <div className="w-full max-w-full sm:max-w-4xl lg:max-w-5xl mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
//         {graphComponents.map(({ title, imageUrl, Component }, index) => (
//           <div
//             key={index}
//             className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//             onClick={() => handleCardClick({ title, Component, index }, index)}
//             aria-label={`Open ${title} graph`}
//           >
//             <img
//               src={imageUrl}
//               alt={`${title} preview`}
//               className={`w-full h-24 sm:h-32 object-cover rounded ${
//                 index === 0 || isLoggedIn ? "opacity-100" : "blur-sm opacity-50"
//               }`}
//             />
//             <h3 className="text-lg font-semibold text-center mt-2">{title}</h3>
//             {!isLoggedIn && index !== 0 && (
//               <div className="absolute inset-0 bg-white bg-opacity-40 flex justify-center items-center rounded">
//                 <span className="text-xs font-bold">🔒 Locked</span>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Full-Screen Graph Modal */}
//       {selectedGraph && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 px-4">
//           <div className="relative w-full h-full max-w-full max-h-full bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg overflow-auto">
//             <button
//               className="absolute top-4 right-4 text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white text-lg sm:text-xl"
//               onClick={() => setSelectedGraph(null)}
//               aria-label="Close graph"
//             >
//               <FaTimes />
//             </button>
//             <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4">
//               {selectedGraph.title}
//             </h2>
//             <div className="w-full h-[calc(100%-4rem)]">
//               <Suspense fallback={<div className="text-center text-sm sm:text-base">Loading {selectedGraph.title}...</div>}>
//                 <selectedGraph.Component />
//               </Suspense>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Login Popup */}
//       {showLogin && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
//           <div className="relative bg-white p-4 sm:p-6 rounded shadow-xl w-full max-w-md sm:max-w-lg">
//             <button
//               className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-lg sm:text-xl"
//               onClick={() => setShowLogin(false)}
//             >
//               <FaTimes />
//             </button>
//             <PortLogin onSuccess={handleLogin} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GraphSlider;






// import React, { useEffect, useState, useMemo, useCallback, Suspense } from "react";
// import { FaTimes } from "react-icons/fa";
// import PortLogin from "./PortLogin";
// import { useYearFilter } from "./context/YearFilterContext";
// import { GraphDataProvider } from "./GraphDataContext"; // Import the provider
// import Top_TenScript from '/public/assets/top_ten.png';
// import Stock_DepAmtOverTime from '/public/assets/deploed_amount.png';
// import Combined_Box from '/public/assets/turnover_box.png';
// import Create_PNL from '/public/assets/market_value.png';
// import Swot_Plot from '/public/assets/swot_plot.png';
// import Ind_Sunburst from '/public/assets/industry_sunburst.png';
// import User_SunburstDrop from '/public/assets/industry_insights.png';
// import ComBub_Chart from '/public/assets/industry_bubble.png';
// import Inv_AmtPlot from '/public/assets/invest_amount.png';
// import Best_TradePlot from '/public/assets/best_trades.png';
// import Classify_StockRisk from '/public/assets/stock_risk.png';
// import Eps_BvQuaterly from '/public/assets/earning_plus.png';

// // Lazy-load components
// const TopTenScript = React.lazy(() => import("./TopTenScript"));
// const StockDepAmtOverTime = React.lazy(() => import("./StockDepAmtOverTime"));
// const CombinedBox = React.lazy(() => import("./CombinedBox"));
// const CreatePNL = React.lazy(() => import("./CreatePNL"));
// const SwotPlot = React.lazy(() => import("./SwotPlot"));
// const IndSunburst = React.lazy(() => import("./IndSunburst"));
// const UserSunburstDrop = React.lazy(() => import("./UserSunburstDrop"));
// const ComBubChart = React.lazy(() => import("./ComBubChart"));
// const InvAmtPlot = React.lazy(() => import("./InvAmtPlot"));
// const BestTradePlot = React.lazy(() => import("./BestTradePlot"));
// const ClassifyStockRisk = React.lazy(() => import("./ClassifyStockRisk"));
// const EpsBvQuaterly = React.lazy(() => import("./EpsBvQuaterly"));
// const PortfolioResults = React.lazy(() => import("./PortfolioResults"));
// const LatestInsights = React.lazy(() => import("./LatestInsight"));
// const ShortNseTable = React.lazy(() => import("./ShortNseTable"));
// const PortfMatrics = React.lazy(() => import("./PortfMatrics"));

// const GraphSlider = ({ uploadId }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const [selectedGraph, setSelectedGraph] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     setIsLoggedIn(!!token);
//   }, []);

//   const handleLogin = useCallback(() => {
//     setIsLoggedIn(true);
//     setShowLogin(false);
//   }, []);

//   const graphComponents = useMemo(
//     () => [
//       { title: "Top Ten Script", Component: TopTenScript, imageUrl: Top_TenScript },
//       { title: "Stock Dep Amt Over Time", Component: StockDepAmtOverTime, imageUrl: Stock_DepAmtOverTime },
//       { title: "Combined Box", Component: CombinedBox, imageUrl: Combined_Box },
//       { title: "Create PNL", Component: CreatePNL, imageUrl: Create_PNL },
//       { title: "Swot Plot", Component: SwotPlot, imageUrl: Swot_Plot },
//       { title: "Ind Sunburst", Component: IndSunburst, imageUrl: Ind_Sunburst },
//       { title: "User Sunburst Drop", Component: UserSunburstDrop, imageUrl: User_SunburstDrop },
//       { title: "ComBub Chart", Component: ComBubChart, imageUrl: ComBub_Chart },
//       { title: "Inv Amt Plot", Component: InvAmtPlot, imageUrl: Inv_AmtPlot },
//       { title: "Best Trade Plot", Component: BestTradePlot, imageUrl: Best_TradePlot },
//       { title: "Classify Stock Risk", Component: ClassifyStockRisk, imageUrl: Classify_StockRisk },
//       { title: "EpsBvQuaterly", Component: EpsBvQuaterly, imageUrl: Eps_BvQuaterly },
//     ],
//     []
//   );

//   const handleCardClick = useCallback(
//     (graph, index) => {
//       if (index === 0 || isLoggedIn) {
//         setSelectedGraph(graph);
//       } else {
//         setShowLogin(true);
//       }
//     },
//     [isLoggedIn]
//   );

//   return (
//     <GraphDataProvider>
//       <div className="w-full flex flex-col items-center min-h-screen">
//         <div className="w-full max-w-full sm:max-w-4xl lg:max-w-5xl space-y-6">
//           <Suspense fallback={<div className="w-full text-center text-sm sm:text-base">Loading Latest Insights...</div>}>
//             <LatestInsights />
//           </Suspense>
//           <Suspense fallback={<div className="text-center text-sm sm:text-base">Loading Short NSE Table...</div>}>
//             <ShortNseTable />
//           </Suspense>
//           <Suspense fallback={<div className="text-center text-sm sm:text-base">Loading Portfolio Results...</div>}>
//             <PortfolioResults />
//           </Suspense> 
//           <Suspense fallback={<div className="text-center text-sm sm:text-base">Loading Portfolio Metrics...</div>}>
//             <PortfMatrics />
//           </Suspense>
//         </div>

//         <div className="w-full max-w-full sm:max-w-4xl lg:max-w-5xl mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
//           {graphComponents.map(({ title, imageUrl, Component }, index) => (
//             <div
//               key={index}
//               className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//               onClick={() => handleCardClick({ title, Component, index }, index)}
//               aria-label={`Open ${title} graph`}
//             >
//               <img
//                 src={imageUrl}
//                 alt={`${title} preview`}
//                 className={`w-full h-24 sm:h-32 object-cover rounded ${
//                   index === 0 || isLoggedIn ? "opacity-100" : "blur-sm opacity-50"
//                 }`}
//               />
//               <h3 className="text-lg font-semibold text-center mt-2">{title}</h3>
//               {!isLoggedIn && index !== 0 && (
//                 <div className="absolute inset-0 bg-white bg-opacity-40 flex justify-center items-center rounded">
//                   <span className="text-xs font-bold">🔒 Locked</span>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {selectedGraph && (
//           <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 px-4">
//             <div className="relative w-full h-full max-w-full max-h-full bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg overflow-auto">
//               <button
//                 className="absolute top-4 right-4 text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white text-lg sm:text-xl"
//                 onClick={() => setSelectedGraph(null)}
//                 aria-label="Close graph"
//               >
//                 <FaTimes />
//               </button>
//               <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4">
//                 {selectedGraph.title}
//               </h2>
//               <div className="w-full h-[calc(100%-4rem)]">
//                 <Suspense fallback={<div className="text-center text-sm sm:text-base">Loading {selectedGraph.title}...</div>}>
//                   <selectedGraph.Component />
//                 </Suspense>
//               </div>
//             </div>
//           </div>
//         )}

//         {showLogin && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
//             <div className="relative bg-white p-4 sm:p-6 rounded shadow-xl w-full max-w-md sm:max-w-lg">
//               <button
//                 className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-lg sm:text-xl"
//                 onClick={() => setShowLogin(false)}
//               >
//                 <FaTimes />
//               </button>
//               <PortLogin onSuccess={handleLogin} />
//             </div>
//           </div>
//         )}
//       </div>
//     </GraphDataProvider>
//   );
// };

// export default GraphSlider;









// import React, { useEffect, useState, useMemo, useCallback, Suspense } from "react";
// import { FaArrowRight, FaChartLine, FaChevronLeft, FaChevronRight, FaLock, FaTimes } from "react-icons/fa";
// import PortLogin from "./PortLogin";
// // import { useYearFilter } from "./context/YearFilterContext";
// import { GraphDataProvider } from "./GraphDataContext"; // Import the provider
// import Top_TenScript from '/assets/top_ten.png';
// import Stock_DepAmtOverTime from '/assets/deploed_amount.png';
// import Combined_Box from '/assets/turnover_box.png';
// import Create_PNL from '/assets/market_value.png';
// import Swot_Plot from '/assets/swot_plot.png';
// // import Ind_Sunburst from '/assets/industry_sunburst.png';
// // import User_SunburstDrop from '/assets/industry_insights.png';
// import ComBub_Chart from '/assets/industry_bubble.png';
// import Inv_AmtPlot from '/assets/invest_amount.png';
// import Best_TradePlot from '/assets/best_trades.png';
// import Classify_StockRisk from '/assets/stock_risk.png';
// import Eps_BvQuaterly from '/assets/earning_plus.png';
// import ShareholdingPlot from "./ShareHolding";

// // Lazy-load components
// const TopTenScript = React.lazy(() => import("./TopTenScript"));
// const ShareHolding = React.lazy(() => import("./ShareHolding"));
// const StockDepAmtOverTime = React.lazy(() => import("./StockDepAmtOverTime"));
// const CombinedBox = React.lazy(() => import("./CombinedBox"));
// const CreatePNL = React.lazy(() => import("./CreatePNL"));
// const SwotPlot = React.lazy(() => import("./SwotPlot"));
// // const IndSunburst = React.lazy(() => import("./IndSunburst"));
// // const UserSunburstDrop = React.lazy(() => import("./UserSunburstDrop"));
// const ComBubChart = React.lazy(() => import("./ComBubChart"));
// const InvAmtPlot = React.lazy(() => import("./InvAmtPlot"));
// const BestTradePlot = React.lazy(() => import("./BestTradePlot"));
// const ClassifyStockRisk = React.lazy(() => import("./ClassifyStockRisk"));
// const EpsBvQuaterly = React.lazy(() => import("./EpsBvQuaterly"));
// const PortfolioResults = React.lazy(() => import("./PortfolioResults"));
// const LatestInsights = React.lazy(() => import("./LatestInsight"));
// const ShortNseTable = React.lazy(() => import("./ShortNseTable"));
// const PortfMatrics = React.lazy(() => import("./PortfMatrics"));




// // Loading Skeleton Component
// const LoadingSkeleton = ({ type }) => {
//   const skeletonClasses = "animate-pulse bg-gray-200 dark:bg-gray-700 rounded";
  
//   if (type === "insights") {
//     return (
//       <div className="w-full p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
//         <div className={`${skeletonClasses} h-8 w-1/3 mb-4`}></div>
//         <div className={`${skeletonClasses} h-4 w-full mb-2`}></div>
//         <div className={`${skeletonClasses} h-4 w-5/6 mb-2`}></div>
//         <div className={`${skeletonClasses} h-4 w-2/3 mb-2`}></div>
//       </div>
//     );
//   }
  
//   if (type === "table") {
//     return (
//       <div className="w-full p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
//         <div className={`${skeletonClasses} h-8 w-1/4 mb-6`}></div>
//         <div className="space-y-3">
//           {[...Array(5)].map((_, i) => (
//             <div key={i} className={`${skeletonClasses} h-12 w-full`}></div>
//           ))}
//         </div>
//       </div>
//     );
//   }
  
//   if (type === "portfolio" || type === "metrics") {
//     return (
//       <div className="w-full p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
//         <div className={`${skeletonClasses} h-8 w-1/3 mb-6`}></div>
//         <div className="grid grid-cols-2 gap-4">
//           {[...Array(4)].map((_, i) => (
//             <div key={i} className={`${skeletonClasses} h-20 rounded-lg`}></div>
//           ))}
//         </div>
//       </div>
//     );
//   }
  
//   return <div className={`${skeletonClasses} w-full h-32`}></div>;
// };

// const GraphSlider = ({ uploadId }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const [selectedGraph, setSelectedGraph] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     setIsLoggedIn(!!token);
//   }, []);

//   const handleLogin = useCallback(() => {
//     setIsLoggedIn(true);
//     setShowLogin(false);
//   }, []);

//   const graphComponents = useMemo(
//     () => [
//       { title: "Top Ten Script", Component: TopTenScript, imageUrl: Top_TenScript },
//       { title: "Share Holding", Component: ShareHolding, imageUrl: Top_TenScript },
//       { title: "Stock Dep Amt Over Time", Component: StockDepAmtOverTime, imageUrl: Stock_DepAmtOverTime },
//       { title: "Combined Box", Component: CombinedBox, imageUrl: Combined_Box },
//       { title: "Create PNL", Component: CreatePNL, imageUrl: Create_PNL },
//       { title: "Swot Plot", Component: SwotPlot, imageUrl: Swot_Plot },
//       // { title: "Ind Sunburst", Component: IndSunburst, imageUrl: Ind_Sunburst },
//       // { title: "User Sunburst Drop", Component: UserSunburstDrop, imageUrl: User_SunburstDrop },
//       { title: "ComBub Chart", Component: ComBubChart, imageUrl: ComBub_Chart },
//       { title: "Inv Amt Plot", Component: InvAmtPlot, imageUrl: Inv_AmtPlot },
//       { title: "Best Trade Plot", Component: BestTradePlot, imageUrl: Best_TradePlot },
//       { title: "Classify Stock Risk", Component: ClassifyStockRisk, imageUrl: Classify_StockRisk },
//       { title: "EpsBvQuaterly", Component: EpsBvQuaterly, imageUrl: Eps_BvQuaterly },
//     ],
//     []
//   );

//   // const handleCardClick = useCallback(
//   //   (graph, index) => {
//   //     if (index === 0 || isLoggedIn) {
//   //       setSelectedGraph(graph);
//   //     } else {
//   //       setShowLogin(true);
//   //     }
//   //   },
//   //   [isLoggedIn]
//   // );
//     const handleCardClick = useCallback(
//     (graph, index) => {
     
//         setSelectedGraph(graph);
     
//     },
   
//   );

//   const [slideIndex, setSlideIndex] = useState(0);

//   const handlePrev = () => {
//     setSlideIndex(prev => (prev === 0 ? Math.ceil(graphComponents.length / 3) - 1 : prev - 1));
//   };

//   const handleNext = () => {
//     setSlideIndex(prev => (prev === Math.ceil(graphComponents.length / 3) - 1 ? 0 : prev + 1));
//   };

//   return (
//     <GraphDataProvider>
//   <div className="w-full flex flex-col items-center min-h-screen  dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6">
//     {/* Main content container */}
//     <div className="w-full max-w-7xl space-y-8">
//       {/* Header Section */}
//       <div className="mt-5 text-center">
//         <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-blue-400 dark:to-purple-400">
//           Market Insights Dashboard
//         </h1>
//         <p className="mt-2 text-gray-600 dark:text-gray-300">
//           Explore real-time data and analytics
//         </p>
//       </div>

//       {/* Loading sections with skeleton loaders */}
//       <Suspense fallback={<LoadingSkeleton type="insights" />}>
//         <LatestInsights />
//       </Suspense>
      
//       <Suspense fallback={<LoadingSkeleton type="table" />}>
//         <ShortNseTable />
//       </Suspense>
 
//       <Suspense fallback={<div className="text-center text-sm sm:text-base">Loading Portfolio Results...</div>}>
//              <PortfolioResults />
//            </Suspense> 
//       <Suspense fallback={<LoadingSkeleton type="metrics" />}>
//         <PortfMatrics />
//       </Suspense>

//       {/* Card Slider Section */}
//       <div className="relative">
//         <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
//           <span className="mr-2">📊</span> Analytics Tools
//         </h2>
        
//         <div className="relative group">
//           {/* Slider container */}
//           <div className="overflow-hidden ">
//             <div className="flex transition-transform duration-300 ease-in-out " style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
//               {[...Array(Math.ceil(graphComponents.length / 3))].map((_, groupIndex) => (
//                 <div key={groupIndex} className="w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-2 hover:text-sky-600 ">
//                   {graphComponents.slice(groupIndex * 3, groupIndex * 3 + 3).map(({ title, imageUrl, Component }, index) => (
//                     <div
//                       key={index}
//                       className="relative bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-xl  cursor-pointer transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
//                       onClick={() => handleCardClick({ title, Component, index }, index)}
//                       aria-label={`Open ${title} graph`}
//                     >
//                       {/* Card Image */}
//                       <div className="relative overflow-hidden  rounded-lg h-40 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
//                         <img
//                           src={imageUrl}
//                           alt={`${title} preview`}
//                           className={`w-full h-full object-cover transition-opacity duration-300 ${
//                             index === 0 || isLoggedIn ? "opacity-100" : "opacity-30 blur-sm"
//                           }`}
//                         />
//                         {/* {!isLoggedIn && index !== 0 && (
//                           <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-40">
//                             <div className="bg-white dark:bg-gray-900 p-2 rounded-full mb-2">
//                               <FaLock className="text-gray-600 dark:text-gray-300" />
//                             </div>
//                             <span className="text-white font-medium text-sm">Premium Feature</span>
//                           </div>
//                         )} */}
//                       </div>
                      
                      
//                       <div className="mt-4">
//                         <h3 className="text-lg font-semibold text-gray-800 dark:text-white hover:text-sky-600">{title}</h3>
//                         {/* <div className="flex justify-between items-center mt-3">
//                           <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
//                             {index === 0 ? "FREE" : "PRO"}
//                           </span>
//                           <button className="text-sm flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
//                             Explore <FaArrowRight className="ml-1 text-xs" />
//                           </button>
//                         </div> */}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           {/* Navigation Arrows */}
//           {graphComponents.length > 3 && (
//             <>
//               <button
//                 onClick={handlePrev}
//                 className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition z-10 opacity-0 group-hover:opacity-100"
//                 aria-label="Previous cards"
//               >
//                 <FaChevronLeft className="text-gray-700 dark:text-gray-300" />
//               </button>
//               <button
//                 onClick={handleNext}
//                 className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition z-10 opacity-0 group-hover:opacity-100"
//                 aria-label="Next cards"
//               >
//                 <FaChevronRight className="text-gray-700 dark:text-gray-300" />
//               </button>
//             </>
//           )}
          
//           {/* Slider Indicators */}
//           <div className="flex justify-center mt-6 space-x-2">
//             {[...Array(Math.ceil(graphComponents.length / 3))].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setSlideIndex(i)}
//                 className={`w-2 h-2 rounded-full transition-all ${i === slideIndex ? 'bg-blue-600 dark:bg-blue-400 w-4' : 'bg-gray-300 dark:bg-gray-600'}`}
//                 aria-label={`Go to slide ${i + 1}`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Modal for Selected Graph */}
//     {selectedGraph && (
//       <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 px-4 max-w-full backdrop-blur-sm">
//         <div className="relative w-full h-full max-w-full max-h-full bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg overflow-auto shadow-2xl border border-gray-200 dark:border-gray-700">
//           <button
//             className="absolute top-4 right-4 text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white text-2xl transition-transform hover:scale-110"
//             onClick={() => setSelectedGraph(null)}
//             aria-label="Close graph"
//           >
//             <FaTimes />
//           </button>
//           <div className="flex items-center mb-4">
//             <div className="p-2 mr-3 rounded-lg bg-blue-100 dark:bg-blue-900 text-sky-600 dark:text-blue-300">
//               <FaChartLine className="text-xl" />
//             </div>
//             <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-blue-400 dark:to-purple-400">
//               {selectedGraph.title}
//             </h2>
//           </div>
//           <div className="w-full h-[calc(100%-4rem)]">
//             <Suspense fallback={<div className="text-center py-10">Loading {selectedGraph.title}...</div>}>
//               <selectedGraph.Component />
//             </Suspense>
//           </div>
//         </div>
//       </div>
//     )}

//     {/* Login Modal */}
//     {showLogin && (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 backdrop-blur-sm">
//         <div className="relative bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg border border-gray-200 dark:border-gray-700">
//           <button
//             className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl transition-transform hover:scale-110"
//             onClick={() => setShowLogin(false)}
//           >
//             <FaTimes />
//           </button>
//           <div className="text-center mb-6">
//             <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome Back</h3>
//             <p className="text-gray-600 dark:text-gray-300 mt-2">Sign in to access premium features</p>
//           </div>
//           <PortLogin onSuccess={handleLogin} />
//         </div>
//       </div>
//     )}
//   </div>
// </GraphDataProvider>
//   );
// };

// export default GraphSlider;

import React, { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import { FaArrowRight, FaChartLine, FaChevronLeft, FaChevronRight, FaLock, FaTimes } from "react-icons/fa";
import PortLogin from "./PortLogin";
import { useYearFilter } from "./context/YearFilterContext";
import { GraphDataProvider } from "./GraphDataContext";
import Top_TenScript from '/assets/top_ten.png';
import Stock_DepAmtOverTime from '/assets/deploed_amount.png';
import Combined_Box from '/assets/turnover_box.png';
import Create_PNL from '/assets/market_value.png';
import Swot_Plot from '/assets/swot_plot.png';
import ComBub_Chart from '/assets/industry_bubble.png';
import Inv_AmtPlot from '/assets/invest_amount.png';
import Best_TradePlot from '/assets/best_trades.png';
import Classify_StockRisk from '/assets/stock_risk.png';
import Eps_BvQuaterly from '/assets/earning_plus.png';
import Share from '/assets/share.png';
import Price from '/assets/price.png';


// Lazy-load components (unchanged)
const TopTenScript = React.lazy(() => import("./TopTenScript"));
const ShareHolding = React.lazy(() => import("./ShareHolding"));
const PriceAcquisition = React.lazy(() => import("./PriceAcquisitionPlot"));
const StockDepAmtOverTime = React.lazy(() => import("./StockDepAmtOverTime"));
const CombinedBox = React.lazy(() => import("./CombinedBox"));
const CreatePNL = React.lazy(() => import("./CreatePNL"));
const SwotPlot = React.lazy(() => import("./SwotPlot"));
const ComBubChart = React.lazy(() => import("./ComBubChart"));
const InvAmtPlot = React.lazy(() => import("./InvAmtPlot"));
const BestTradePlot = React.lazy(() => import("./BestTradePlot"));
const ClassifyStockRisk = React.lazy(() => import("./ClassifyStockRisk"));
const EpsBvQuaterly = React.lazy(() => import("./EpsBvQuaterly"));
const PortfolioResults = React.lazy(() => import("./PortfolioResults"));
const LatestInsights = React.lazy(() => import("./LatestInsight"));
const ShortNseTable = React.lazy(() => import("./ShortNseTable"));
const PortfMatrics = React.lazy(() => import("./PortfMatrics"));

// Loading Skeleton Component (unchanged)
const LoadingSkeleton = ({ type }) => {
  const skeletonClasses = "animate-pulse bg-gray-200 dark:bg-gray-700 rounded";
  if (type === "insights") {
    return (
      <div className="w-full p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
        <div className={`${skeletonClasses} h-8 w-1/3 mb-4`}></div>
        <div className={`${skeletonClasses} h-4 w-full mb-2`}></div>
        <div className={`${skeletonClasses} h-4 w-5/6 mb-2`}></div>
        <div className={`${skeletonClasses} h-4 w-2/3 mb-2`}></div>
      </div>
    );
  }
  if (type === "table") {
    return (
      <div className="w-full p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
        <div className={`${skeletonClasses} h-8 w-1/4 mb-6`}></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`${skeletonClasses} h-12 w-full`}></div>
          ))}
        </div>
      </div>
    );
  }
  if (type === "portfolio" || type === "metrics") {
    return (
      <div className="w-full p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
        <div className={`${skeletonClasses} h-8 w-1/3 mb-6`}></div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`${skeletonClasses} h-20 rounded-lg`}></div>
          ))}
        </div>
      </div>
    );
  }
  return <div className={`${skeletonClasses} w-full h-32`}></div>;
};

const GraphSlider = ({ uploadId }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedGraphIndex, setSelectedGraphIndex] = useState(null); // Changed to track index

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
    setShowLogin(false);
  }, []);

  const graphComponents = useMemo(
    () => [
      { title: "Top Ten Script", Component: TopTenScript, imageUrl: Top_TenScript },
       { title: "Price Acquisition", Component: PriceAcquisition, imageUrl: Price },
      { title: "Share Holding", Component: ShareHolding, imageUrl: Share },
      { title: "Deployed Amount Over Time For a Stock", Component: StockDepAmtOverTime, imageUrl: Stock_DepAmtOverTime },
      { title: "Turnover Box Plot", Component: CombinedBox, imageUrl: Combined_Box },
      { title: "Market Value with PNL", Component: CreatePNL, imageUrl: Create_PNL },
      { title: "Swot Plot", Component: SwotPlot, imageUrl: Swot_Plot },
      { title: "PE Ratio,Book Value-Bubble Chart", Component: ComBubChart, imageUrl: ComBub_Chart },
      { title: "Invested Amount Bar Plot", Component: InvAmtPlot, imageUrl: Inv_AmtPlot },
      { title: "Best Traded Plot", Component: BestTradePlot, imageUrl: Best_TradePlot },
      { title: "Classify Stock Risk", Component: ClassifyStockRisk, imageUrl: Classify_StockRisk },
      { title: "Earning Pulse", Component: EpsBvQuaterly, imageUrl: Eps_BvQuaterly },
    ],
    []
  );

  const handleCardClick = useCallback(
    (index) => {
      setSelectedGraphIndex(index); // Set the index of the clicked graph
    },
    []
  );

  const handlePrevGraph = useCallback(() => {
    setSelectedGraphIndex((prev) => 
      prev === 0 ? graphComponents.length - 1 : prev - 1
    );
  }, [graphComponents.length]);

  const handleNextGraph = useCallback(() => {
    setSelectedGraphIndex((prev) => 
      prev === graphComponents.length - 1 ? 0 : prev + 1
    );
  }, [graphComponents.length]);

  const [slideIndex, setSlideIndex] = useState(0);

  const handlePrev = () => {
    setSlideIndex(prev => (prev === 0 ? Math.ceil(graphComponents.length / 3) - 1 : prev - 1));
  };

  const handleNext = () => {
    setSlideIndex(prev => (prev === Math.ceil(graphComponents.length / 3) - 1 ? 0 : prev + 1));
  };

  return (
    <GraphDataProvider>
      <div className="w-full flex flex-col items-center min-h-screen dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6">
        {/* Main content container (unchanged) */}
        <div className="w-full max-w-7xl space-y-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-blue-400 dark:to-purple-400">
              Market Insights Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Explore real-time data and analytics
            </p>
          </div>

          <Suspense fallback={<LoadingSkeleton type="insights" />}>
            <LatestInsights />
          </Suspense>
          
          <Suspense fallback={<LoadingSkeleton type="table" />}>
            <ShortNseTable />
          </Suspense>
          
          <Suspense fallback={<LoadingSkeleton type="portfolio" />}>
            <PortfolioResults />
          </Suspense>
          
          <Suspense fallback={<LoadingSkeleton type="metrics" />}>
            <PortfMatrics />
          </Suspense>

          {/* Card Slider Section (unchanged) */}
          <div className="relative">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
              <span className="mr-2">📊</span> Analytics Tools
            </h2>
            
            <div className="relative group">
              <div className="overflow-hidden">
                <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
                  {[...Array(Math.ceil(graphComponents.length / 3))].map((_, groupIndex) => (
                    <div key={groupIndex} className="w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-2 hover:text-sky-600">
                      {graphComponents.slice(groupIndex * 3, groupIndex * 3 + 3).map(({ title, imageUrl }, index) => (
                        <div
                          key={index}
                          className="relative bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
                          onClick={() => handleCardClick(groupIndex * 3 + index)}
                          aria-label={`Open ${title} graph`}
                        >
                          <div className="relative overflow-hidden rounded-lg h-40 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
                            <img
                              src={imageUrl}
                              alt={`${title} preview`}
                              className="w-full h-full object-cover transition-opacity duration-300"
                            />
                          </div>
                          <div className="mt-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white hover:text-sky-600">{title}</h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              
              {graphComponents.length > 3 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition z-10 opacity-0 group-hover:opacity-100"
                    aria-label="Previous cards"
                  >
                    <FaChevronLeft className="text-gray-700 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition z-10 opacity-0 group-hover:opacity-100"
                    aria-label="Next cards"
                  >
                    <FaChevronRight className="text-gray-700 dark:text-gray-300" />
                  </button>
                </>
              )}
              
              <div className="flex justify-center mt-6 space-x-2">
                {[...Array(Math.ceil(graphComponents.length / 3))].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === slideIndex ? 'bg-blue-600 dark:bg-blue-400 w-4' : 'bg-gray-300 dark:bg-gray-600'}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Selected Graph with Slider */}
        {selectedGraphIndex !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 px-4 max-w-full">
            <div className="relative w-full h-full max-w-8xl max-h-[100vh] bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg overflow-auto shadow-2xl border border-gray-200 dark:border-gray-700">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white text-2xl transition-transform hover:scale-110 z-20"
                onClick={() => setSelectedGraphIndex(null)}
                aria-label="Close graph"
              >
                <FaTimes />
              </button>
              
              {/* Slider Controls */}
              <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10">
                <button
                  onClick={handlePrevGraph}
                  className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  aria-label="Previous graph"
                >
                  <FaChevronLeft className="text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
                <button
                  onClick={handleNextGraph}
                  className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  aria-label="Next graph"
                >
                  <FaChevronRight className="text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              {/* Graph Title and Content */}
              <div className="flex items-center mb-4">
                <div className="p-2 mr-3 rounded-lg bg-blue-100 dark:bg-blue-900 text-sky-600 dark:text-blue-300">
                  <FaChartLine className="text-xl" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-blue-400 dark:to-purple-400">
                  {graphComponents[selectedGraphIndex].title}
                </h2>
              </div>
              <div className="w-full h-[calc(100%-4rem)]">
                <Suspense fallback={<div className="text-center py-10">Loading {graphComponents[selectedGraphIndex].title}...</div>}>
                  {React.createElement(graphComponents[selectedGraphIndex].Component)}
                </Suspense>
              </div>
            </div>
          </div>
        )}

        {/* Login Modal (unchanged) */}
        {showLogin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 backdrop-blur-sm">
            <div className="relative bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg border border-gray-200 dark:border-gray-700">
              <button
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl transition-transform hover:scale-110"
                onClick={() => setShowLogin(false)}
              >
                <FaTimes />
              </button>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome Back</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Sign in to access premium features</p>
              </div>
              <PortLogin onSuccess={handleLogin} />
            </div>
          </div>
        )}
      </div>
    </GraphDataProvider>
  );
};

export default GraphSlider;








