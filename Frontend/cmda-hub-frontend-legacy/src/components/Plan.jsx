// import React, { useState } from 'react';

// import { motion } from 'framer-motion';
// import { Briefcase, User, TrendingUp, CheckCircle, Star, Crown } from 'lucide-react';
// import Navbar from './Navbar';
// import Footer from './Footer';

// const Plan = () => {
//   const [isIndividual, setIsIndividual] = useState(true);
//   const [cardPositions, setCardPositions] = useState([0, 1, 2]);

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

//   const plans = [
//     {
//       title: isIndividual ? 'Basic Plan' : 'Pro Plan',
//       price: isIndividual ? '₹1000' : '₹2500',
//       icon: isIndividual ? <User size={32} /> : <Briefcase size={32} />,
//       features: isIndividual
//         ? ['Essential charts access', 'Global market data coverage', 'Highly versatile screeners']
//         : ['5 indicators per chart', '2 charts in one window', '10 server-side alerts', 'Volume profile indicators', 'Custom time intervals', 'Multiple enhanced watchlists'],
//       color: '#025d7d',
//     },
//     {
//       title: 'Pro Plan',
//       price: isIndividual ? '₹2500' : '₹5000',
//       icon: <TrendingUp size={32} />,
//       features: isIndividual
//         ? ['5 indicators per chart', '2 charts in one window', '10 server-side alerts', 'Volume profile indicators', 'Custom time intervals', 'Multiple enhanced watchlists']
//         : ['55 indicators per chart', '8 charts in one window', '400 server-side alerts', 'Second-based intervals', 'Alerts that don’t expire', '2x more data on charts (10k bars)', 'Publishing invite-only indicators'],
//       color: '#5b9cb2 ',
//     },
//     {
//       title: isIndividual ? 'Premium Plan' : 'Corporate Plan',
//       price: isIndividual ? '₹5000' : '₹10000',
//       icon: isIndividual ? <Star size={32} /> : <Crown size={32} />,
//       features: isIndividual
//         ? ['55 indicators per chart', '8 charts in one window', '400 server-side alerts', 'Second-based intervals', 'Alerts that don’t expire', '2x more data on charts (10k bars)', 'Publishing invite-only indicators']
//         : ['Unlimited data access', 'Premium support', 'Dedicated account manager', 'Exclusive content access'],
//       color: '#5b9cb2 ',
//     },
//   ];

//   return (
//     <>
//       <div className="dark:bg-slate-900 dark:text-white min-h-screen">
//         <Navbar />
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
//                 className="toggle toggle-primary"
//                 checked={isIndividual}
//                 onChange={handleToggle}
//               />
//               <span className={isIndividual ? 'text-black' : ''}>Individual</span>
//             </label>
//           </div>

//           {/* Card Container with Blur */}
//           <div className="relative flex justify-center items-center">
//             <div className="w-full flex flex-col items-center gap-8 md:gap-0 md:flex-row md:justify-center md:h-[450px] backdrop-blur-md">
//               {/* Coming Soon Banner */}
//               <motion.div
//                  className="absolute top-44 z-10 w-[60%] max-w-[600px]  mx-auto text-center items-center py-4 text-black font-extrabold text-3xl tracking-wide  border-b-4 border-white translate-x-[10%]"
//                 initial="hidden"
//                 animate="visible"
//                 variants={bannerVariants}
//               >
//                 🚀 Coming Soon: Premium Plans!
//               </motion.div>
//               {plans.map((plan, index) => {
//                 const position = cardPositions.indexOf(index);

//                 const desktopStyle = {
//                   position: 'absolute',
//                   width: '300px',
//                   height: '400px',
//                   left:
//                     position === 0
//                       ? 'calc(50% - 450px / 2)'
//                       : position === 1
//                       ? 'calc(50% - 450px / 2 + 150px)'
//                       : 'calc(50% - 450px / 2 + 300px)',
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
//                     className={`shadow-lg rounded-2xl p-6 flex flex-col justify-between cursor-pointer bg-white text-black transition-all duration-300
//                       w-[90%] sm:w-[300px] h-[400px] md:static md:bg-[${plan.color}]
//                     `}
//                     style={window.innerWidth >= 768 ? { ...desktopStyle, backgroundColor: plan.color } : { filter: 'blur(4px)' }}
//                     initial="hidden"
//                     animate="visible"
//                     custom={index}
//                     variants={cardVariants}
//                     onClick={() => handleCardClick(position)}
//                   >
//                     <div>
//                       <div className="flex items-center gap-3 mb-4">
//                         {plan.icon}
//                         <h2 className="text-2xl font-bold">{plan.title}</h2>
//                       </div>
//                       <p className="text-3xl font-extrabold">{plan.price}</p>
//                       <h3 className="text-sm font-semibold mt-4 mb-2 uppercase tracking-wide ">
//                         Features
//                       </h3>
//                       <ul className="space-y-2 mt-2 text-sm">
//                         {plan.features.map((feature, i) => (
//                           <li key={i} className="flex items-start gap-2">
//                             <CheckCircle className="w-4 h-4 mt-[2px]" />
//                             {feature}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                     <button className="btn bg-white text-black font-semibold btn-block mt-6 rounded-full hover:bg-sky-800 hover:text-white">
//                       Start Now
//                     </button>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Plan;



 import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  User,
  TrendingUp,
  CheckCircle,
  Star,
  Crown,
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const Plan = () => {
  const [isIndividual, setIsIndividual] = useState(true);
  const [cardPositions, setCardPositions] = useState([0, 1, 2]);

  const handleToggle = () => setIsIndividual(!isIndividual);

  const handleCardClick = (currentPosition) => {
    const newPositions = [...cardPositions];
    if (currentPosition === 0) {
      [newPositions[0], newPositions[1]] = [newPositions[1], newPositions[0]];
    } else if (currentPosition === 2) {
      [newPositions[1], newPositions[2]] = [newPositions[2], newPositions[1]];
    }
    setCardPositions(newPositions);
  };

  const plans = [
    {
      title: isIndividual ? 'Basic Plan' : 'Pro Plan',
      price: isIndividual ? '₹1000' : '₹2500',
      icon: isIndividual ? <User size={32} /> : <Briefcase size={32} />,
      features: isIndividual
        ? ['Essential charts access', 'Global market data coverage', 'Highly versatile screeners']
        : ['5 indicators per chart', '2 charts in one window', '10 server-side alerts', 'Volume profile indicators', 'Custom time intervals', 'Multiple enhanced watchlists'],
      color: '#025d7d',
    },
    {
      title: 'Pro Plan',
      price: isIndividual ? '₹2500' : '₹5000',
      icon: <TrendingUp size={32} />,
      features: isIndividual
        ? ['5 indicators per chart', '2 charts in one window', '10 server-side alerts', 'Volume profile indicators', 'Custom time intervals', 'Multiple enhanced watchlists']
        : ['55 indicators per chart', '8 charts in one window', '400 server-side alerts', 'Second-based intervals', 'Alerts that don’t expire', '2x more data on charts (10k bars)', 'Publishing invite-only indicators'],
      color: '#357ea0',
    },
    {
      title: isIndividual ? 'Premium Plan' : 'Corporate Plan',
      price: isIndividual ? '₹5000' : '₹10000',
      icon: isIndividual ? <Star size={32} /> : <Crown size={32} />,
      features: isIndividual
        ? ['55 indicators per chart', '8 charts in one window', '400 server-side alerts', 'Second-based intervals', 'Alerts that don’t expire', '2x more data on charts (10k bars)', 'Publishing invite-only indicators']
        : ['Unlimited data access', 'Premium support', 'Dedicated account manager', 'Exclusive content access'],
      color: '#4a95af',
    },
  ];

  return (
    <>
      <div className="dark:bg-slate-900 dark:text-white min-h-screen relative">
        <Navbar />
        <div className="container mx-auto px-4 md:px-12 mt-20 relative z-10">
          <h1 className="text-center text-4xl md:text-5xl font-extrabold mb-4">
            Plans for Every Level of Ambition
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto text-base md:text-lg">
            With insight comes opportunity — we help you trade and invest better from the very start.
          </p>

          {/* Toggle */}
          <div className="flex justify-center mb-12">
            <label className="flex items-center gap-4 cursor-pointer text-lg font-semibold">
              <span className={!isIndividual ? 'text-black dark:text-white' : 'text-gray-400'}>
                Corporate
              </span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={isIndividual}
                onChange={handleToggle}
              />
              <span className={isIndividual ? 'text-black dark:text-white' : 'text-gray-400'}>
                Individual
              </span>
            </label>
          </div>

          {/* Cards */}
          <div className="relative flex justify-center items-center overflow-x-hidden">
            {/* Coming Soon Banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute top-4 md:top-0 left-2/2 -translate-x-1/2 bg-sky-700 text-white text-lg md:text-2xl font-bold px-6 py-2 rounded-full shadow-lg z-20"
            >
              🚀 Coming Soon: Premium Plans!
            </motion.div>

            <div className="relative w-full max-w-6xl flex flex-col md:flex-row items-center justify-center md:h-[500px] gap-6 mt-10">
              {plans.map((plan, index) => {
                const position = cardPositions.indexOf(index);

                const style = window.innerWidth >= 768
                  ? {
                      position: 'absolute',
                      width: '300px',
                      height: '420px',
                      left:
                        position === 0
                          ? 'calc(50% - 460px)'
                          : position === 1
                          ? 'calc(50% - 150px)'
                          : 'calc(50% + 160px)',
                      zIndex: position === 1 ? 3 : 1,
                      transform:
                        position === 1
                          ? 'scale(1.1)'
                          : 'scale(0.9)',
                      opacity: position === 1 ? 1 : 0.6,
                      transition: 'all 0.4s ease',
                    }
                  : {};

                return (
                  <motion.div
                    key={index}
                    className="shadow-xl rounded-2xl p-6 bg-white text-black flex flex-col justify-between cursor-pointer transition-all duration-300 w-[90%] sm:w-[300px] h-[420px]"
                    style={{ ...style, backgroundColor: plan.color }}
                    onClick={() => handleCardClick(position)}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4 text-white">
                        {plan.icon}
                        <h2 className="text-2xl font-bold">{plan.title}</h2>
                      </div>
                      <p className="text-3xl font-extrabold text-white">{plan.price}</p>
                      <h3 className="text-sm font-semibold mt-4 mb-2 uppercase tracking-wide text-white">
                        Features
                      </h3>
                      <ul className="space-y-2 mt-2 text-sm text-white">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-[2px]" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button className="btn bg-white text-black font-semibold w-full mt-6 rounded-full hover:bg-sky-800 hover:text-white">
                      Start Now
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Plan;
