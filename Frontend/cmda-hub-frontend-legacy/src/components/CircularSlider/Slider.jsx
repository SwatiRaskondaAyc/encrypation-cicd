// import React, { useState } from 'react';
// import FancyCarousel from "react-fancy-circular-carousel";
// import 'react-fancy-circular-carousel/FancyCarousel.css';

// import image1 from ' /assets/gold.jpg';
// import image2 from ' /assets/aluminium.jpg';
// import image3 from ' /assets/cotton.jpg';
// import image4 from ' /assets/crudeoil.jpg';
// import image5 from ' /assets/wheat.jpg';
// import image6 from ' /assets/oil.jpg';

// import CrudOil from './CrudOil';
// import Alumininum from './Aluminium';
// import Cotton from './Cotton';
// import Oil from './Oil';
// import Gold from './Gold';
// import Wheat from './Wheat';

// import { motion } from "framer-motion";

// const Sliders = () => {
//   const [focusElement, setFocusElement] = useState(0);
  

//   const images = [image1, image2, image3, image4, image5, image6];
//   const info = [<Gold />, <Alumininum />, <Cotton />, <CrudOil />, <Wheat />, <Oil />];

 

//   return (
    
//     <div className="m-5 p-5 text-center font-semibold text-black-700 mb-5 dark:bg-slate-900 dark:text-white font container mx-auto md:px-9 px-3">
//       <div className="flex flex-wrap md:flex-nowrap justify-between gap-6">
//         {/* Slider Section */}
//         <div className="w-full md:w-2/3 flex justify-center items-center">
//           <FancyCarousel 
//             images={images} 
//             setFocusElement={setFocusElement} 
//             carouselRadius={window.innerWidth < 768 ? 140 : 150}
//             peripheralImageRadius={window.innerWidth < 768 ? 70 : 100}
//             centralImageRadius={window.innerWidth < 768 ? 110 : 150}
//             focusElementStyling={{ border: '20px solid rgb(11, 11, 11)' }}
//             // autoRotateTime={5}
            
//           />
//         </div>

     
//         <div className="w-full md:w-1/3">
//           <motion.div
//             key={focusElement} // Ensure unique key for animations
//             initial={{ opacity: 0, y: 20 }} // Starting state
//             animate={{ opacity: 1, y: 0 }} // Final state
//             exit={{ opacity: 0, y: -20 }} // Exit state
//             transition={{ duration: 0.5 }} // Smooth transition
//           >
//             {info[focusElement] || (
//               <p className="text-gray-500">Select an item to view details.</p>
//             )}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sliders;

// import React, { useState, useEffect } from 'react';
// import FancyCarousel from "react-fancy-circular-carousel";
// import 'react-fancy-circular-carousel/FancyCarousel.css';

// import image1 from ' /assets/gold.jpg';
// import image2 from ' /assets/aluminium.jpg';
// import image3 from ' /assets/cotton.jpg';
// import image4 from ' /assets/crudeoil.jpg';
// import image5 from ' /assets/wheat.jpg';
// import image6 from ' /assets/oil.jpg';

// import CrudOil from './CrudOil';
// import Alumininum from './Aluminium';
// import Cotton from './Cotton';
// import Oil from './Oil';
// import Gold from './Gold';
// import Wheat from './Wheat';

// import { motion, AnimatePresence } from "framer-motion";

// const Sliders = () => {
//   const [focusElement, setFocusElement] = useState(0);
//   const [isMobile, setIsMobile] = useState(false);

//   const images = [image1, image2, image3, image4, image5, image6];
//   const info = [<Gold />, <Alumininum />, <Cotton />, <CrudOil />, <Wheat />, <Oil />];

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 768);
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   return (
//     <div className="container mx-auto px-4 py-12 text-black dark:bg-gray-900 dark:text-white">
//       <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
//         Explore Key Commodities
//       </h2>

//       <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
//         {/* Info Panel */}
//         <motion.div
//           className="w-full md:w-1/2 bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-6 border-2 border-yellow-400 hover:scale-[1.02] transition-all duration-300"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={focusElement}
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -30 }}
//               transition={{ duration: 0.5 }}
//             >
//               {info[focusElement] || (
//                 <p className="text-gray-400 text-center">Select an item to view details.</p>
//               )}
//             </motion.div>
//           </AnimatePresence>
//         </motion.div>

//         {/* Carousel */}
//         <div className="w-full md:w-1/2 flex justify-center items-center relative">
//           <div className="relative z-10">
//             <FancyCarousel
//               images={images}
//               setFocusElement={setFocusElement}
//               carouselRadius={isMobile ? 130 : 180}
//               peripheralImageRadius={isMobile ? 65 : 90}
//               centralImageRadius={isMobile ? 110 : 140}
//               focusElementStyling={{
//                 border: '6px solid #facc15',
//                 boxShadow: '0 0 25px rgba(234, 179, 8, 0.7)',
//                 borderRadius: '100%',
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sliders;

import React, { useState } from 'react';
import FancyCarousel from "react-fancy-circular-carousel";
import 'react-fancy-circular-carousel/FancyCarousel.css';

import image1 from '/assets/gold.jpg';
import image2 from '/assets/aluminium.jpg';
import image3 from '/assets/cotton.jpg';
import image4 from '/assets/crudeoil.jpg';
import image5 from '/assets/wheat.jpg';
import image6 from '/assets/oil.jpg';

import CrudOil from './CrudOil';
import Alumininum from './Aluminium';
import Cotton from './Cotton';
import Oil from './Oil';
import Gold from './Gold';
import Wheat from './Wheat';

import { motion } from "framer-motion";

const Sliders = () => {
  const [focusElement, setFocusElement] = useState(0);
  

  const images = [image1, image2, image3, image4, image5, image6];
  const info = [<Gold />, <Alumininum />, <Cotton />, <CrudOil />, <Wheat />, <Oil />];

 

  return (
    <div className="m-5 p-5 text-center font-semibold text-black-700 mb-5 dark:bg-slate-900 dark:text-white font container mx-auto md:px-9 px-3">
      <div className="flex flex-wrap md:flex-nowrap justify-between gap-6">
        {/* Slider Section */}
        <div className="w-full md:w-2/3 flex justify-center items-center">
          <FancyCarousel 
            images={images} 
            setFocusElement={setFocusElement} 
            carouselRadius={window.innerWidth < 768 ? 140 : 150}
            peripheralImageRadius={window.innerWidth < 768 ? 70 : 100}
            centralImageRadius={window.innerWidth < 768 ? 110 : 150}
            focusElementStyling={{ border: '20px solid rgb(11, 11, 11)' }}
            // autoRotateTime={5}
            
          />
        </div>

     
        <div className="w-full md:w-1/3">
          <motion.div
            key={focusElement} // Ensure unique key for animations
            initial={{ opacity: 0, y: 20 }} // Starting state
            animate={{ opacity: 1, y: 0 }} // Final state
            exit={{ opacity: 0, y: -20 }} // Exit state
            transition={{ duration: 0.5 }} // Smooth transition
          >
            {info[focusElement] || (
              <p className="text-gray-500">Select an item to view details.</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Sliders;


