// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Briefcase, User, TrendingUp, CheckCircle, Star, Crown } from 'lucide-react';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import Banner from '../components/Banner';
// import SectorSummary from '../components/Indice/SectorSummary';



// const Home = () => {

// const [isIndividual, setIsIndividual] = useState(true);
//    const [cardPositions, setCardPositions] = useState([0, 1, 2]);

//    const handleToggle = () => setIsIndividual(!isIndividual);

//    const handleCardClick = (currentPosition) => {
//      const newPositions = [...cardPositions];
//      if (currentPosition === 0) {
//        [newPositions[0], newPositions[1]] = [newPositions[1], newPositions[0]];
//      } else if (currentPosition === 2) {
//        [newPositions[1], newPositions[2]] = [newPositions[2], newPositions[1]];
//      }
//      setCardPositions(newPositions);
//    };

//    const cardVariants = {
//      hidden: { opacity: 0, y: 50 },
//      visible: (i) => ({
//        opacity: 1,
//        y: 0,
//        transition: { delay: i * 0.2 },
//      }),
//    };

//    const bannerVariants = {
//      hidden: { opacity: 0, y: -20 },
//      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
//    };

//    const plans = [
//      {
//        title: isIndividual ? 'Basic Plan' : 'Pro Plan',
//        price: isIndividual ? '₹1000' : '₹2500',
//        icon: isIndividual ? <User size={32} /> : <Briefcase size={32} />,
//        features: isIndividual
//          ? ['Essential charts access', 'Global market data coverage', 'Highly versatile screeners']
//          : ['5 indicators per chart', '2 charts in one window', '10 server-side alerts', 'Volume profile indicators', 'Custom time intervals', 'Multiple enhanced watchlists'],
//        color: '#e2e8f0',
//      },
//      {
//        title: 'Pro Plan',
//        price: isIndividual ? '₹2500' : '₹5000',
//        icon: <TrendingUp size={32} />,
//        features: isIndividual
//          ? ['5 indicators per chart', '2 charts in one window', '10 server-side alerts', 'Volume profile indicators', 'Custom time intervals', 'Multiple enhanced watchlists']
//          : ['55 indicators per chart', '8 charts in one window', '400 server-side alerts', 'Second-based intervals', 'Alerts that don’t expire', '2x more data on charts (10k bars)', 'Publishing invite-only indicators'],
//        color: '#e2e8f0',
//      },
//      {
//        title: isIndividual ? 'Premium Plan' : 'Corporate Plan',
//        price: isIndividual ? '₹5000' : '₹10000',
//        icon: isIndividual ? <Star size={32} /> : <Crown size={32} />,
//        features: isIndividual
//          ? ['55 indicators per chart', '8 charts in one window', '400 server-side alerts', 'Second-based intervals', 'Alerts that don’t expire', '2x more data on charts (10k bars)', 'Publishing invite-only indicators']
//          : ['Unlimited data access', 'Premium support', 'Dedicated account manager', 'Exclusive content access'],
//        color: '#e2e8f0 ',
//      },
//    ];

//   return (

//     <div className="min-h-screen bg-white dark:bg-slate-900">
//       <Navbar />
//       <main className="pb-20 ">
//         <Banner />
//         {/* <Indices /> */}

//         <SectorSummary/> 

//         {/* <div className="mt-24">
//           <Sliders />
//         </div> */}

//  <div className="dark:bg-slate-900 dark:text-white min-h-screen">

//         <div className="container mx-auto px-4 md:px-12 mt-20">
//           <h1 className="text-center text-3xl md:text-4xl font-extrabold mb-4">
//             Plans for Every Level of Ambition
//           </h1>
//           <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto text-sm md:text-base">
//             With insight comes opportunity — we help you trade and invest better from the very start.
//           </p>

//           {/* Toggle */}
//           <div className="flex justify-center mb-12">
//             <label className="flex items-center gap-4 cursor-pointer text-lg font-semibold">
//               <span className={!isIndividual ? 'text-black' : ''}>Corporate</span>
//               <input
//                 type="checkbox"
//                 className="toggle text-sky-600"
//                 checked={isIndividual}
//                 onChange={handleToggle}
//               />
//               <span className={isIndividual ? 'text-black' : ''}>Individual</span>
//             </label>
//           </div>

//           {/* Card Container with Blur */}
//           <div className="relative flex justify-center items-center">
//             <div className="w-full flex flex-col items-center justify-center gap-8 md:gap-0 md:flex-row md:justify-center md:h-[450px] backdrop-blur-md">
//               {/* Coming Soon Banner */}
//               <motion.div
//                 className="absolute top-44 z-10 w-full max-w-md mx-auto text-center py-3 px-5 rounded-lg bg-gradient-to-r from-sky-800 to-cyan-700 text-white font-extrabold text-2xl tracking-wide shadow-lg  transform -translate-x-1/2"
//                 initial="hidden"
//                 animate="visible"
//                 variants={bannerVariants}
//               >
//                 Coming Soon: Premium Plans!
//               </motion.div>
//               {plans.map((plan, index) => {
//                 const position = cardPositions.indexOf(index);

//                 const desktopStyle = {
//                   position: 'absolute',
//                   width: '300px',
//                   height: '400px',
//                   left:
//                     position === 0
//                       ? 'calc(50% - 300px)'
//                       : position === 1
//                       ? 'calc(50% - 150px)'
//                       : 'calc(50%)',
//                   zIndex: position === 1 ? 3 : position === 0 ? 2 : 1,
//                   transform:
//                     position === 1
//                       ? 'rotate(0deg)'
//                       : position === 0
//                       ? 'rotate(-5deg)'
//                       : 'rotate(5deg)',
//                   opacity: position === 1 ? 1 : 0.7,
//                   transition:
//                     'left 0.3s ease, z-index 0.3s ease, transform 0.3s ease, opacity 0.3s ease',
//                   filter: 'blur(4px)',
//                 };

//                 return (
//                   <motion.div
//                     key={index}
//                     className={`shadow-lg rounded-2xl p-6 flex flex-col justify-between cursor-pointer bg-white text-black transition-all duration-300 border border-sky-700
//                       w-[90%] sm:w-[300px] h-[400px] md:static md:bg-[${plan.color}]
//                     `}
//                     style={window.innerWidth >= 768 ? { ...desktopStyle, backgroundColor: plan.color } : { filter: 'blur(4px)' }}
//                     initial="hidden"
//                     animate="visible"
//                     custom={index}
//                     variants={cardVariants}
//                     onClick={() => handleCardClick(position)}
//                   >
//                     <div className=''>
//                       <div className="flex items-center gap-3 mb-4 text-sky-800">
//                         {plan.icon}
//                         <h2 className="text-2xl font-bold text-sky-800">{plan.title}</h2>
//                       </div>
//                       <p className="text-3xl font-extrabold text-sky-800">{plan.price}</p>
//                       <h3 className="text-sm font-semibold mt-4 mb-2 uppercase tracking-wide text-sky-800">
//                         Features
//                       </h3>
//                       <ul className="space-y-2 mt-2 text-sm text-sky-800">
//                         {plan.features.map((feature, i) => (
//                           <li key={i} className="flex items-start gap-2">
//                             <CheckCircle className="w-4 h-4 mt-[2px]" />
//                             {feature}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                     <button className="btn bg-sky-800 text-white font-semibold btn-block mt-6 rounded-full hover:bg-sky-800 hover:text-white">
//                       Start Now
//                     </button>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>


//       </main>
//       <div>
//       <Footer />
//       </div>
//     </div>
//   );
// };

// export default Home;





// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Briefcase, User, TrendingUp, CheckCircle, Star, Crown, Bot, X, Maximize2, Minimize2 } from 'lucide-react';
// import Draggable from 'react-draggable';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import Banner from '../components/Banner';
// import SectorSummary from '../components/Indice/SectorSummary';

// const Home = () => {
//   const [isIndividual, setIsIndividual] = useState(true);
//   const [cardPositions, setCardPositions] = useState([0, 1, 2]);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [isMaximized, setIsMaximized] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);

//   const handleToggle = () => setIsIndividual(!isIndividual);

//   const handleCardClick = (currentPosition) => {
//     const newPositions = [...cardPositions];
//     if (currentPosition === 0) {
//       [newPositions[0], newPositions[1]] = [newPositions[1], newPositions[0]];
//     } else if (currentPosition === 2) {
//       [newPositions[1], newPositions[2]] = [newPositions[2], newPositions[1]];
//     }
//     setCardPositions(newPositions);
//   };

//   const toggleChat = () => setIsChatOpen(!isChatOpen);

//   const toggleMaximize = () => setIsMaximized(!isMaximized);

//   // Manage popup visibility cycle
//   useEffect(() => {
//     if (isChatOpen) {
//       setShowPopup(false); // Hide popup when chatbot is open
//       return;
//     }

//     // Initial delay before showing popup
//     const initialTimeout = setTimeout(() => {
//       setShowPopup(true);
//     }, 2000);

//     // Cycle for showing/hiding popup
//     const interval = setInterval(() => {
//       setShowPopup(true);
//       setTimeout(() => {
//         setShowPopup(false);
//       }, 3000); // Show for 3 seconds
//     }, 10000 + Math.random() * 5000); // Random interval between 10-15 seconds

//     return () => {
//       clearTimeout(initialTimeout);
//       clearInterval(interval);
//     };
//   }, [isChatOpen]);

//   const cardVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: (i) => ({
//       opacity: 1,
//       y: 0,
//       transition: { delay: i * 0.2 },
//     }),
//   };

//   const bannerVariants = {
//     hidden: { opacity: 0, y: -20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
//   };

//   const chatVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
//   };

//   const popupVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
//   };

//   const plans = [
//     {
//       title: isIndividual ? 'Basic Plan' : 'Pro Plan',
//       price: isIndividual ? '₹1000' : '₹2500',
//       icon: isIndividual ? <User size={32} /> : <Briefcase size={32} />,
//       features: isIndividual
//         ? ['Essential charts access', 'Global market data coverage', 'Highly versatile screeners']
//         : ['5 indicators per chart', '2 charts in one window', '10 server-side alerts', 'Volume profile indicators', 'Custom time intervals', 'Multiple enhanced watchlists'],
//       color: '#e2e8f0',
//     },
//     {
//       title: 'Pro Plan',
//       price: isIndividual ? '₹2500' : '₹5000',
//       icon: <TrendingUp size={32} />,
//       features: isIndividual
//         ? ['5 indicators per chart', '2 charts in one window', '10 server-side alerts', 'Volume profile indicators', 'Custom time intervals', 'Multiple enhanced watchlists']
//         : ['55 indicators per chart', '8 charts in one window', '400 server-side alerts', 'Second-based intervals', 'Alerts that don’t expire', '2x more data on charts (10k bars)', 'Publishing invite-only indicators'],
//       color: '#e2e8f0',
//     },
//     {
//       title: isIndividual ? 'Premium Plan' : 'Corporate Plan',
//       price: isIndividual ? '₹5000' : '₹10000',
//       icon: isIndividual ? <Star size={32} /> : <Crown size={32} />,
//       features: isIndividual
//         ? ['55 indicators per chart', '8 charts in one window', '400 server-side alerts', 'Second-based intervals', 'Alerts that don’t expire', '2x more data on charts (10k bars)', 'Publishing invite-only indicators']
//         : ['Unlimited data access', 'Premium support', 'Dedicated account manager', 'Exclusive content access'],
//       color: '#e2e8f0',
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-white dark:bg-slate-900">
//       <Navbar />
//       <main className="pb-20">
//         <Banner />
//         <SectorSummary />
//         <div className="dark:bg-slate-900 dark:text-white min-h-screen">
//           <div className="container mx-auto px-4 md:px-12 mt-20">
//             <h1 className="text-center text-3xl md:text-4xl font-extrabold mb-4">
//               Plans for Every Level of Ambition
//             </h1>
//             <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto text-sm md:text-base">
//               With insight comes opportunity — we help you trade and invest better from the very start.
//             </p>
//             <div className="flex justify-center mb-12">
//               <label className="flex items-center gap-4 cursor-pointer text-lg font-semibold">
//                 <span className={!isIndividual ? 'text-black' : ''}>Corporate</span>
//                 <input
//                   type="checkbox"
//                   className="toggle text-sky-600"
//                   checked={isIndividual}
//                   onChange={handleToggle}
//                 />
//                 <span className={isIndividual ? 'text-black' : ''}>Individual</span>
//               </label>
//             </div>
//             <div className="relative flex justify-center items-center">
//               <div className="w-full flex flex-col items-center justify-center gap-8 md:gap-0 md:flex-row md:justify-center md:h-[450px] backdrop-blur-md">
//                 <motion.div
//                   className="absolute top-44 z-10 w-full max-w-md mx-auto text-center py-3 px-5 rounded-lg bg-gradient-to-r from-sky-800 to-cyan-700 text-white font-extrabold text-2xl tracking-wide shadow-lg transform -translate-x-1/2"
//                   initial="hidden"
//                   animate="visible"
//                   variants={bannerVariants}
//                 >
//                   Coming Soon: Premium Plans!
//                 </motion.div>
//                 {plans.map((plan, index) => {
//                   const position = cardPositions.indexOf(index);
//                   const desktopStyle = {
//                     position: 'absolute',
//                     width: '300px',
//                     height: '400px',
//                     left:
//                       position === 0
//                         ? 'calc(50% - 300px)'
//                         : position === 1
//                         ? 'calc(50% - 150px)'
//                         : 'calc(50%)',
//                     zIndex: position === 1 ? 3 : position == 0 ? 2 : 1,
//                     transform:
//                       position === 1
//                         ? 'rotate(0deg)'
//                         : position === 0
//                         ? 'rotate(-5deg)'
//                         : 'rotate(5deg)',
//                     opacity: position === 1 ? 1 : 0.7,
//                     transition:
//                       'left 0.3s ease, z-index 0.3s ease, transform 0.3s ease, opacity 0.3s ease',
//                     filter: 'blur(4px)',
//                   };

//                   return (
//                     <motion.div
//                       key={index}
//                       className={`shadow-lg rounded-2xl p-6 flex flex-col justify-between cursor-pointer bg-white text-black transition-all duration-300 border border-sky-700
//                         w-[90%] sm:w-[300px] h-[400px] md:static md:bg-[${plan.color}]`}
//                       style={window.innerWidth >= 768 ? { ...desktopStyle, backgroundColor: plan.color } : { filter: 'blur(4px)' }}
//                       initial="hidden"
//                       animate="visible"
//                       custom={index}
//                       variants={cardVariants}
//                       onClick={() => handleCardClick(position)}
//                     >
//                       <div>
//                         <div className="flex items-center gap-3 mb-4 text-sky-800">
//                           {plan.icon}
//                           <h2 className="text-2xl font-bold text-sky-800">{plan.title}</h2>
//                         </div>
//                         <p className="text-3xl font-extrabold text-sky-800">{plan.price}</p>
//                         <h3 className="text-sm font-semibold mt-4 mb-2 uppercase tracking-wide text-sky-800">
//                           Features
//                         </h3>
//                         <ul className="space-y-2 mt-2 text-sm text-sky-800">
//                           {plan.features.map((feature, i) => (
//                             <li key={i} className="flex items-start gap-2">
//                               <CheckCircle className="w-4 h-4 mt-[2px]" />
//                               {feature}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                       <button className="btn bg-sky-800 text-white font-semibold btn-block mt-6 rounded-full hover:bg-sky-800 hover:text-white">
//                         Start Now
//                       </button>
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* Chatbot Button */}
//         <button
//           onClick={toggleChat}
//           className="fixed bottom-6 right-6 bg-sky-800 text-white p-4 rounded-full shadow-lg hover:bg-sky-900 transition-colors duration-300 z-50"
//           title={isChatOpen ? 'Close Chatbot' : 'Open Chatbot'}
//         >
//           <Bot size={24} />
//         </button>
//         {/* Chatbot Popup */}
//         <AnimatePresence>
//           {showPopup && !isChatOpen && (
//             <motion.div
//               className="fixed bottom-20 right-6 bg-sky-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 cursor-pointer max-w-[200px] text-sm"
//               initial="hidden"
//               animate="visible"
//               exit="hidden"
//               variants={popupVariants}
//               onClick={toggleChat}
//               title="Click to open chatbot"
//             >
//               How can I assist you?
//             </motion.div>
//           )}
//         </AnimatePresence>
//         {/* Chatbot Window */}
//         <AnimatePresence>
//           {isChatOpen && (
//             <Draggable handle=".chat-header" disabled={isMaximized}>
//               <motion.div
//                 className={`fixed bottom-20 right-6 bg-white dark:bg-slate-800 rounded-lg shadow-2xl z-50 overflow-hidden
//                   ${isMaximized ? 'top-0 left-0 w-full h-full' : 'w-[400px] h-[600px]'}`}
//                 initial="hidden"
//                 animate="visible"
//                 exit="hidden"
//                 variants={chatVariants}
//               >
//                 <div className="chat-header bg-sky-800 text-white p-2 flex justify-between items-center cursor-move">
//                   <span className="font-semibold">Chatbot</span>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={toggleMaximize}
//                       className="p-1 hover:bg-sky-700 rounded"
//                       title={isMaximized ? 'Restore' : 'Maximize'}
//                     >
//                       {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
//                     </button>
//                     <button
//                       onClick={toggleChat}
//                       className="p-1 hover:bg-sky-700 rounded"
//                       title="Close"
//                     >
//                       <X size={16} />
//                     </button>
//                   </div>
//                 </div>
//                 <iframe
//                   src="https://cmdahub.info/"
//                   className="w-full h-[calc(100%-40px)] border-none"
//                   title="Chatbot"
//                 />
//               </motion.div>
//             </Draggable>
//           )}
//         </AnimatePresence>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Home;


// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Briefcase, User, TrendingUp, CheckCircle, Star, Crown, Bot, X, Maximize2, Minimize2 } from 'lucide-react';
// import Draggable from 'react-draggable';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import Banner from '../components/Banner';
// import SectorSummary from '../components/Indice/SectorSummary';
// import SectorTicker from "../components/SectorTicker";
// import axios from 'axios';

// const Home = () => {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const [isIndividual, setIsIndividual] = useState(true);
//   const [cardPositions, setCardPositions] = useState([0, 1, 2]);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [isMaximized, setIsMaximized] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const [iframeError, setIframeError] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [sectors, setSectors] = useState([]);

//   useEffect(() => {
//     const controller = new AbortController();
//     const cacheDuration = 60 * 60 * 1000; // 1hr

//     const fetchSectors = async () => {
//       try {
//         setLoading(true);
//         const cachedData = localStorage.getItem("sectorData");
//         const cacheTimestamp = localStorage.getItem("sectorDataTimestamp");

//         let validSectors = [];

//         if (
//           cachedData &&
//           cacheTimestamp &&
//           Date.now() - parseInt(cacheTimestamp) < cacheDuration
//         ) {
//           validSectors = JSON.parse(cachedData).data;
//         } else {
//           const response = await axios.get(
//             `${API_BASE}/landpage/sector-summary`,
//             { signal: controller.signal }
//           );

//           if (
//             response.data.status !== "success" ||
//             !Array.isArray(response.data.data)
//           ) {
//             throw new Error(response.data.message || "Invalid API response");
//           }

//           validSectors = response.data.data;
//           localStorage.setItem("sectorData", JSON.stringify(response.data));
//           localStorage.setItem(
//             "sectorDataTimestamp",
//             Date.now().toString()
//           );
//         }

//         setSectors(validSectors);
//       } catch (err) {
//         if (err.name !== "AbortError") {
//           console.error("Error fetching sectors:", err);
//           setSectors([]);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSectors();
//     return () => controller.abort();
//   }, [API_BASE]);

//   const handleToggle = () => setIsIndividual(!isIndividual);

//   const handleCardClick = (currentPosition) => {
//     const newPositions = [...cardPositions];
//     if (currentPosition === 0) {
//       [newPositions[0], newPositions[1]] = [newPositions[1], newPositions[0]];
//     } else if (currentPosition === 2) {
//       [newPositions[1], newPositions[2]] = [newPositions[2], newPositions[1]];
//     }
//     setCardPositions(newPositions);
//   };

//   const toggleChat = () => setIsChatOpen(!isChatOpen);

//   const toggleMaximize = () => setIsMaximized(!isMaximized);

//   // Manage popup visibility cycle
//   useEffect(() => {
//     if (isChatOpen) {
//       setShowPopup(false); // Hide popup when chatbot is open
//       return;
//     }

//     // Initial delay before showing popup
//     const initialTimeout = setTimeout(() => {
//       setShowPopup(true);
//     }, 2000);

//     // Cycle for showing/hiding popup
//     const interval = setInterval(() => {
//       setShowPopup(true);
//       setTimeout(() => {
//         setShowPopup(false);
//       }, 3000); // Show for 3 seconds
//     }, 10000 + Math.random() * 5000); // Random interval between 10-15 seconds

//     return () => {
//       clearTimeout(initialTimeout);
//       clearInterval(interval);
//     };
//   }, [isChatOpen]);

//   // Handle iframe load errors
//   const handleIframeError = () => {
//     setIframeError(true);
//   };

//   const cardVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: (i) => ({
//       opacity: 1,
//       y: 0,
//       transition: { delay: i * 0.2 },
//     }),
//   };

//   const bannerVariants = {
//     hidden: { opacity: 0, y: -20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
//   };

//   const chatVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
//   };

//   const popupVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
//   };

//   const plans = [
//     {
//       title: isIndividual ? 'Basic Plan' : 'Pro Plan',
//       price: isIndividual ? '₹1000' : '₹2500',
//       icon: isIndividual ? <User size={32} /> : <Briefcase size={32} />,
//       features: isIndividual
//         ? ['Essential charts access', 'Global market data coverage', 'Highly versatile screeners']
//         : ['5 indicators per chart', '2 charts in one window', '10 server-side alerts', 'Volume profile indicators', 'Custom time intervals', 'Multiple enhanced watchlists'],
//       color: '#e2e8f0',
//     },
//     {
//       title: 'Pro Plan',
//       price: isIndividual ? '₹2500' : '₹5000',
//       icon: <TrendingUp size={32} />,
//       features: isIndividual
//         ? ['5 indicators per chart', '2 charts in one window', '10 server-side alerts', 'Volume profile indicators', 'Custom time intervals', 'Multiple enhanced watchlists']
//         : ['55 indicators per chart', '8 charts in one window', '400 server-side alerts', 'Second-based intervals', 'Alerts that don’t expire', '2x more data on charts (10k bars)', 'Publishing invite-only indicators'],
//       color: '#e2e8f0',
//     },
//     {
//       title: isIndividual ? 'Premium Plan' : 'Corporate Plan',
//       price: isIndividual ? '₹5000' : '₹10000',
//       icon: isIndividual ? <Star size={32} /> : <Crown size={32} />,
//       features: isIndividual
//         ? ['55 indicators per chart', '8 charts in one window', '400 server-side alerts', 'Second-based intervals', 'Alerts that don’t expire', '2x more data on charts (10k bars)', 'Publishing invite-only indicators']
//         : ['Unlimited data access', 'Premium support', 'Dedicated account manager', 'Exclusive content access'],
//       color: '#e2e8f0',
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-white dark:bg-slate-900">
//       <Navbar />

//       {/* ✅ ticker below navbar */}
//       {!loading && <SectorTicker sectors={sectors} />}

//       <main className="pb-20">
//         <Banner />
//         <SectorSummary />
//         <div className="dark:bg-slate-900 dark:text-white min-h-screen">
//           <div className="container mx-auto px-4 md:px-12 mt-20">
//             <h1 className="text-center text-3xl md:text-4xl font-extrabold mb-4">
//               Plans for Every Level of Ambition
//             </h1>
//             <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto text-sm md:text-base">
//               With insight comes opportunity — we help you trade and invest better from the very start.
//             </p>
//             <div className="flex justify-center mb-12">
//               <label className="flex items-center gap-4 cursor-pointer text-lg font-semibold">
//                 <span className={!isIndividual ? 'text-black dark:text-white' : ''}>Corporate</span>
//                 <input
//                   type="checkbox"
//                   className="toggle text-sky-600"
//                   checked={isIndividual}
//                   onChange={handleToggle}
//                 />
//                 <span className={isIndividual ? 'text-black dark:text-white' : ''}>Individual</span>
//               </label>
//             </div>
//             <div className="relative flex justify-center items-center">
//               <div className="w-full flex flex-col items-center justify-center gap-8 md:gap-0 md:flex-row md:justify-center md:h-[450px] backdrop-blur-md">
//                 <motion.div
//                   className="absolute top-44 z-10 w-full max-w-md mx-auto text-center py-3 px-5 rounded-lg bg-gradient-to-r from-sky-800 to-cyan-700 text-white font-extrabold text-2xl tracking-wide shadow-lg transform -translate-x-1/2"
//                   initial="hidden"
//                   animate="visible"
//                   variants={bannerVariants}
//                 >
//                   Coming Soon: Premium Plans!
//                 </motion.div>
//                 {plans.map((plan, index) => {
//                   const position = cardPositions.indexOf(index);
//                   const desktopStyle = {
//                     position: 'absolute',
//                     width: '300px',
//                     height: '400px',
//                     left:
//                       position === 0
//                         ? 'calc(50% - 300px)'
//                         : position === 1
//                           ? 'calc(50% - 150px)'
//                           : 'calc(50%)',
//                     zIndex: position === 1 ? 3 : position == 0 ? 2 : 1,
//                     transform:
//                       position === 1
//                         ? 'rotate(0deg)'
//                         : position === 0
//                           ? 'rotate(-5deg)'
//                           : 'rotate(5deg)',
//                     opacity: position === 1 ? 1 : 0.7,
//                     transition:
//                       'left 0.3s ease, z-index 0.3s ease, transform 0.3s ease, opacity 0.3s ease',
//                     filter: 'blur(4px)',
//                   };

//                   return (
//                     <motion.div
//                       key={index}
//                       className={`shadow-lg rounded-2xl p-6 flex flex-col justify-between cursor-pointer bg-white text-black transition-all duration-300 border border-sky-700
//                         w-[90%] sm:w-[300px] h-[400px] md:static md:bg-[${plan.color}]`}
//                       style={window.innerWidth >= 768 ? { ...desktopStyle, backgroundColor: plan.color } : { filter: 'blur(4px)' }}
//                       initial="hidden"
//                       animate="visible"
//                       custom={index}
//                       variants={cardVariants}
//                       onClick={() => handleCardClick(position)}
//                     >
//                       <div>
//                         <div className="flex items-center gap-3 mb-4 text-sky-800">
//                           {plan.icon}
//                           <h2 className="text-2xl font-bold text-sky-800">{plan.title}</h2>
//                         </div>
//                         <p className="text-3xl font-extrabold text-sky-800">{plan.price}</p>
//                         <h3 className="text-sm font-semibold mt-4 mb-2 uppercase tracking-wide text-sky-800">
//                           Features
//                         </h3>
//                         <ul className="space-y-2 mt-2 text-sm text-sky-800">
//                           {plan.features.map((feature, i) => (
//                             <li key={i} className="flex items-start gap-2">
//                               <CheckCircle className="w-4 h-4 mt-[2px]" />
//                               {feature}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                       <button className="btn bg-sky-800 text-white font-semibold btn-block mt-6 rounded-full hover:bg-sky-800 hover:text-white">
//                         Start Now
//                       </button>
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* Chatbot Button */}
//         <button
//           onClick={toggleChat}
//           className="fixed bottom-6 right-6 bg-sky-800 text-white p-4 rounded-full shadow-lg hover:bg-sky-900 transition-colors duration-300 z-50"
//           title={isChatOpen ? 'Close Chatbot' : 'Open Chatbot'}
//         >
//           <Bot size={24} />
//         </button>
//         {/* Chatbot Popup */}
//         <AnimatePresence>
//           {showPopup && !isChatOpen && (
//             <motion.div
//               className="fixed bottom-20 right-6 bg-sky-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 cursor-pointer max-w-[200px] text-sm"
//               initial="hidden"
//               animate="visible"
//               exit="hidden"
//               variants={popupVariants}
//               onClick={toggleChat}
//               title="Click to open chatbot"
//             >
//               How can I assist you?
//             </motion.div>
//           )}
//         </AnimatePresence>
//         {/* Chatbot Window */}
//         <AnimatePresence>
//           {isChatOpen && (
//             <Draggable handle=".chat-header" disabled={isMaximized}>
//               <motion.div
//                 className={`fixed bottom-20 right-6 bg-white dark:bg-slate-800 rounded-lg shadow-2xl z-50 overflow-hidden
//                   ${isMaximized ? 'top-0 left-0 w-full h-full' : 'w-[400px] h-[600px]'}`}
//                 initial="hidden"
//                 animate="visible"
//                 exit="hidden"
//                 variants={chatVariants}
//               >
//                 <div className="chat-header bg-sky-800 text-white p-2 flex justify-between items-center cursor-move">
//                   <span className="font-semibold">Chatbot</span>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={toggleMaximize}
//                       className="p-1 hover:bg-sky-700 rounded"
//                       title={isMaximized ? 'Restore' : 'Maximize'}
//                     >
//                       {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
//                     </button>
//                     <button
//                       onClick={toggleChat}
//                       className="p-1 hover:bg-sky-700 rounded"
//                       title="Close"
//                     >
//                       <X size={16} />
//                     </button>
//                   </div>
//                 </div>
//                 {iframeError ? (
//                   <div className="w-full h-[calc(100%-40px)] flex items-center justify-center text-center p-4 text-gray-600 dark:text-gray-300">
//                     Unable to load chatbot. Please try again or access it from https://cmdahub.com/.
//                   </div>
//                 ) : (
//                   <iframe
//                     src="https://cmdahub.info/"
//                     className="w-full h-[calc(100%-40px)] border-none"
//                     title="Chatbot"
//                     referrerPolicy="strict-origin-when-cross-origin"
//                     onError={handleIframeError}
//                   />
//                 )}
//               </motion.div>
//             </Draggable>
//           )}
//         </AnimatePresence>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Home;


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, User, TrendingUp, CheckCircle, Star, Crown, Bot, X, Maximize2, Minimize2 } from 'lucide-react';
import Draggable from 'react-draggable';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
// import SectorSummary from '../components/Indice/SectorSummary';
// import SectorTicker from "../components/SectorTicker";
import SectorStrip from '../components/Indice/SectorStrip';
import axios from 'axios';
import BannerSlider from '../components/BannerSlider';
import MarketIndices from '../components/Indice/MarketIndices';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
  // const [isIndividual, setIsIndividual] = useState(true);
  const [cardPositions, setCardPositions] = useState([0, 1, 2]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [sectors, setSectors] = useState([]);

  // useEffect(() => {
  //   const controller = new AbortController();
  //   const cacheDuration = 60 * 60 * 1000; // 1hr

  //   const fetchSectors = async () => {
  //     try {
  //       setLoading(true);
  //       const cachedData = localStorage.getItem("sectorData");
  //       const cacheTimestamp = localStorage.getItem("sectorDataTimestamp");

  //       let validSectors = [];

  //       if (
  //         cachedData &&
  //         cacheTimestamp &&
  //         Date.now() - parseInt(cacheTimestamp) < cacheDuration
  //       ) {
  //         validSectors = JSON.parse(cachedData).data;
  //       } else {
  //         const response = await axios.get(
  //           `${API_BASE}/landpage/sector-summary`,
  //           { signal: controller.signal }
  //         );

  //         if (
  //           response.data.status !== "success" ||
  //           !Array.isArray(response.data.data)
  //         ) {
  //           throw new Error(response.data.message || "Invalid API response");
  //         }

  //         validSectors = response.data.data;
  //         localStorage.setItem("sectorData", JSON.stringify(response.data));
  //         localStorage.setItem(
  //           "sectorDataTimestamp",
  //           Date.now().toString()
  //         );
  //       }

  //       setSectors(validSectors);
  //     } catch (err) {
  //       if (err.name !== "AbortError") {
  //         console.error("Error fetching sectors:", err);
  //         setSectors([]);
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSectors();
  //   return () => controller.abort();
  // }, [API_BASE]);

  // const handleToggle = () => setIsIndividual(!isIndividual);

  const handleCardClick = (currentPosition) => {
    const newPositions = [...cardPositions];
    if (currentPosition === 0) {
      [newPositions[0], newPositions[1]] = [newPositions[1], newPositions[0]];
    } else if (currentPosition === 2) {
      [newPositions[1], newPositions[2]] = [newPositions[2], newPositions[1]];
    }
    setCardPositions(newPositions);
  };

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const toggleMaximize = () => setIsMaximized(!isMaximized);

  // Manage popup visibility cycle
  useEffect(() => {
    if (isChatOpen) {
      setShowPopup(false); // Hide popup when chatbot is open
      return;
    }

    // Initial delay before showing popup
    const initialTimeout = setTimeout(() => {
      setShowPopup(true);
    }, 2000);

    // Cycle for showing/hiding popup
    const interval = setInterval(() => {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000); // Show for 3 seconds
    }, 10000 + Math.random() * 5000); // Random interval between 10-15 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isChatOpen]);

  // Handle iframe load errors
  const handleIframeError = () => {
    setIframeError(true);
  };

  // const cardVariants = {
  //   hidden: { opacity: 0, y: 50 },
  //   visible: (i) => ({
  //     opacity: 1,
  //     y: 0,
  //     transition: { delay: i * 0.2 },
  //   }),
  // };

  // const bannerVariants = {
  //   hidden: { opacity: 0, y: -20 },
  //   visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  // };

  const chatVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  // const plans = [
  //   {
  //     title: isIndividual ? 'Basic Plan' : 'Pro Plan',
  //     price: isIndividual ? '₹1000' : '₹2500',
  //     icon: isIndividual ? <User size={32} /> : <Briefcase size={32} />,
  //     features: isIndividual
  //       ? ['Essential charts access', 'Global market data coverage', 'Highly versatile screeners']
  //       : ['5 indicators per chart', '2 charts in one window', '10 server-side alerts', 'Volume profile indicators', 'Custom time intervals', 'Multiple enhanced watchlists'],
  //     color: '#e2e8f0',
  //   },
  //   {
  //     title: 'Pro Plan',
  //     price: isIndividual ? '₹2500' : '₹5000',
  //     icon: <TrendingUp size={32} />,
  //     features: isIndividual
  //       ? ['5 indicators per chart', '2 charts in one window', '10 server-side alerts', 'Volume profile indicators', 'Custom time intervals', 'Multiple enhanced watchlists']
  //       : ['55 indicators per chart', '8 charts in one window', '400 server-side alerts', 'Second-based intervals', 'Alerts that don’t expire', '2x more data on charts (10k bars)', 'Publishing invite-only indicators'],
  //     color: '#e2e8f0',
  //   },
  //   {
  //     title: isIndividual ? 'Premium Plan' : 'Corporate Plan',
  //     price: isIndividual ? '₹5000' : '₹10000',
  //     icon: isIndividual ? <Star size={32} /> : <Crown size={32} />,
  //     features: isIndividual
  //       ? ['55 indicators per chart', '8 charts in one window', '400 server-side alerts', 'Second-based intervals', 'Alerts that don’t expire', '2x more data on charts (10k bars)', 'Publishing invite-only indicators']
  //       : ['Unlimited data access', 'Premium support', 'Dedicated account manager', 'Exclusive content access'],
  //     color: '#e2e8f0',
  //   },
  // ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Helmet>
        <title>CMDA Hub – Capital Market Data Analytics Platform for Investors & Analysts </title>

        <meta
          name="description"
          content="Analyze markets with CMDA Hub’s advanced capital market data analytics, real-time insights, 
dashboards, equity tools, research panels & pattern detection. Make smarter investment 
decisions. "
        />

        <meta
          name="keywords"
          content="CMDA Hub, market data, equity analysis, sector performance, heatmap, dividend analysis, market indices, top sectors, stock analytics, investment insights, financial data platform"
        />

        {/* ✅ Open Graph / Social Preview */}
        <meta property="og:title" content="CMDA Hub | Real-Time Market Data & Investment Insights" />
        <meta
          property="og:description"
          content="Analyze market trends, sector performance, and dividend data with CMDA Hub — a smart financial insights platform built for informed investors."
        />
        <meta property="og:url" content="https://cmdahub.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CMDA Hub" />
        <meta
          property="og:image"
          content="https://cmdahub.com/cmda_image1.png"
        />  {/* 👈 Replace with your actual image path (1200×630 recommended) */}

        {/* ✅ Canonical URL */}
        <link rel="canonical" href="https://cmdahub.com/" />
      </Helmet>
      <Navbar />

      {/* ✅ ticker below navbar */}
      {/* {!loading && <SectorTicker sectors={sectors} />} */}

      <main className="">
        {/* <Banner /> */}
        <BannerSlider />
        <MarketIndices />
        <SectorStrip />
        {/* <SectorSummary /> */}
        {/* <div className="dark:bg-slate-900 dark:text-white min-h-screen">
          <div className="container mx-auto px-4 md:px-12 mt-20">
            <h1 className="text-center text-3xl md:text-4xl font-extrabold mb-4">
              Plans for Every Level of Ambition
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto text-sm md:text-base">
              With insight comes opportunity — we help you trade and invest better from the very start.
            </p>
            <div className="flex justify-center mb-12">
              <label className="flex items-center gap-4 cursor-pointer text-lg font-semibold">
                <span className={!isIndividual ? 'text-black dark:text-white' : ''}>Corporate</span>
                <input
                  type="checkbox"
                  className="toggle text-sky-600"
                  checked={isIndividual}
                  onChange={handleToggle}
                />
                <span className={isIndividual ? 'text-black dark:text-white' : ''}>Individual</span>
              </label>
            </div>
            <div className="relative flex justify-center items-center">
              <div className="w-full flex flex-col items-center justify-center gap-8 md:gap-0 md:flex-row md:justify-center md:h-[450px] backdrop-blur-md">
                <motion.div
                  className="absolute top-44 z-10 w-full max-w-md mx-auto text-center py-3 px-5 rounded-lg bg-gradient-to-r from-sky-800 to-cyan-700 text-white font-extrabold text-2xl tracking-wide shadow-lg transform -translate-x-1/2"
                  initial="hidden"
                  animate="visible"
                  variants={bannerVariants}
                >
                  Coming Soon: Premium Plans!
                </motion.div>
                {plans.map((plan, index) => {
                  const position = cardPositions.indexOf(index);
                  const desktopStyle = {
                    position: 'absolute',
                    width: '300px',
                    height: '400px',
                    left:
                      position === 0
                        ? 'calc(50% - 300px)'
                        : position === 1
                          ? 'calc(50% - 150px)'
                          : 'calc(50%)',
                    zIndex: position === 1 ? 3 : position == 0 ? 2 : 1,
                    transform:
                      position === 1
                        ? 'rotate(0deg)'
                        : position === 0
                          ? 'rotate(-5deg)'
                          : 'rotate(5deg)',
                    opacity: position === 1 ? 1 : 0.7,
                    transition:
                      'left 0.3s ease, z-index 0.3s ease, transform 0.3s ease, opacity 0.3s ease',
                    filter: 'blur(4px)',
                  };

                  return (
                    <motion.div
                      key={index}
                      className={`shadow-lg rounded-2xl p-6 flex flex-col justify-between cursor-pointer bg-white text-black transition-all duration-300 border border-sky-700
                        w-[90%] sm:w-[300px] h-[400px] md:static md:bg-[${plan.color}]`}
                      style={window.innerWidth >= 768 ? { ...desktopStyle, backgroundColor: plan.color } : { filter: 'blur(4px)' }}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      variants={cardVariants}
                      onClick={() => handleCardClick(position)}
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-4 text-sky-800">
                          {plan.icon}
                          <h2 className="text-2xl font-bold text-sky-800">{plan.title}</h2>
                        </div>
                        <p className="text-3xl font-extrabold text-sky-800">{plan.price}</p>
                        <h3 className="text-sm font-semibold mt-4 mb-2 uppercase tracking-wide text-sky-800">
                          Features
                        </h3>
                        <ul className="space-y-2 mt-2 text-sm text-sky-800">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 mt-[2px]" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button className="btn bg-sky-800 text-white font-semibold btn-block mt-6 rounded-full hover:bg-sky-800 hover:text-white">
                        Start Now
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div> */}
        {/* Chatbot Button */}
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-sky-800 text-white p-4 rounded-full shadow-lg hover:bg-sky-900 transition-colors duration-300 z-50"
          title={isChatOpen ? 'Close Chatbot' : 'Open Chatbot'}
        >
          <Bot size={24} />
        </button>
        {/* Chatbot Popup */}
        <AnimatePresence>
          {showPopup && !isChatOpen && (
            <motion.div
              className="fixed bottom-20 right-6 bg-sky-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 cursor-pointer max-w-[200px] text-sm"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={popupVariants}
              onClick={toggleChat}
              title="Click to open chatbot"
            >
              How can I assist you?
            </motion.div>
          )}
        </AnimatePresence>
        {/* Chatbot Window */}
        <AnimatePresence>
          {isChatOpen && (
            <Draggable handle=".chat-header" disabled={isMaximized}>
              <motion.div
                className={`fixed bottom-20 right-6 bg-white dark:bg-slate-800 rounded-lg shadow-2xl z-50 overflow-hidden
                  ${isMaximized ? 'top-0 left-0 w-full h-full' : 'w-[400px] h-[600px]'}`}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={chatVariants}
              >
                <div className="chat-header bg-sky-800 text-white p-2 flex justify-between items-center cursor-move">
                  <span className="font-semibold">Chatbot</span>
                  <div className="flex gap-2">
                    <button
                      onClick={toggleMaximize}
                      className="p-1 hover:bg-sky-700 rounded"
                      title={isMaximized ? 'Restore' : 'Maximize'}
                    >
                      {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                    <button
                      onClick={toggleChat}
                      className="p-1 hover:bg-sky-700 rounded"
                      title="Close"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                {iframeError ? (
                  <div className="w-full h-[calc(100%-40px)] flex items-center justify-center text-center p-4 text-gray-600 dark:text-gray-300">
                    Unable to load chatbot. Please try again or access it from https://cmdahub.com/.
                  </div>
                ) : (
                  <iframe
                    src="https://cmdahub.info/"
                    className="w-full h-[calc(100%-40px)] border-none"
                    title="Chatbot"
                    referrerPolicy="strict-origin-when-cross-origin"
                    onError={handleIframeError}
                  />
                )}
              </motion.div>
            </Draggable>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default Home;