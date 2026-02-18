// import React from 'react';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import Banner from '../components/Banner';
// import MarketCapBanner from '../components/MarketCapBanner';

// const BannerSlider = () => {
//     const settings = {
//         dots: true,
//         infinite: true,
//         slidesToShow: 1,
//         slidesToScroll: 1,
//         autoplay: true,
//         autoplaySpeed: 7000,
//         pauseOnHover: true,
//         pauseOnDotsHover: true,
//         arrows: true,
//         adaptiveHeight: true,
//         fade: true,
//         speed: 1000,
//         cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
//         appendDots: (dots) => (
//             <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0">
//                 <ul className="flex justify-center space-x-2 sm:space-x-3 md:space-x-4 backdrop-blur-sm bg-black/10 rounded-full py-2 px-3 mx-auto w-max">{dots}</ul>
//             </div>
//         ),
//         customPaging: (i) => (
//             <button
//                 className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-white/60 hover:bg-white transition-all duration-300 transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 aria-label={`Go to slide ${i + 1}`}
//             ></button>
//         ),
//     };

//     return (
//         <div className="relative w-full min-h-screen mx-auto overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
//             <div className="mt-10 slider-container min-h-full">
//                 <Slider {...settings}>
//                     <div className=" w-full relative">
//                         <div
//                             className="absolute inset-0 z-10"
//                             style={{
//                                 background: 'linear-gradient(135deg, rgba(157, 240, 212, 0.15) 0%, rgba(255, 252, 252, 0.25) 50%, transparent 100%)',
//                                 animation: 'gradientShift 12s ease infinite',
//                             }}
//                         ></div>
//                         <Banner />
//                     </div>
//                     <div className="w-full relative">
//                         <div
//                             className="absolute inset-0 z-10"
//                             style={{
//                                 background: 'linear-gradient(135deg, rgba(197, 239, 247, 0.15) 0%, rgba(161, 233, 255, 0.25) 50%, transparent 100%)',
//                                 animation: 'gradientShift 12s ease infinite',
//                             }}
//                         ></div>
//                         <div className="mt-50 p-6 min-h-[800px]">
//                             <MarketCapBanner />
//                         </div>
//                     </div>
//                 </Slider>
//             </div>

//             <style jsx global>{`
//         .slick-prev,
//         .slick-next {
//           z-index: 20;
//           width: 48px;
//           height: 48px;
//           background: rgba(255, 255, 255, 0.85);
//           border-radius: 20%;
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           display: flex !important;
//           align-items: center;
//           justify-content: center;
//           box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
//           backdrop-filter: blur(10px);
//           -webkit-backdrop-filter: blur(10px);
//           border: 1px solid rgba(255, 255, 255, 0.5);
//         }

//         .slick-prev:before,
//         .slick-next:before {
//           font-family: 'slick';
//           font-size: 22px;
//           line-height: 1;
//           opacity: 0.8;
//           color: #334155;
//           -webkit-font-smoothing: antialiased;
//           -moz-osx-font-smoothing: grayscale;
//           font-weight: bold;
//           transition: all 0.2s ease;
//         }

//         .slick-prev:hover,
//         .slick-next:hover,
//         .slick-prev:focus,
//         .slick-next:focus {
//           background: rgba(255, 255, 255, 0.95);
//           transform: translateY(-2px) scale(1.05);
//           outline: none;
//           box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
//         }

//         .slick-prev:hover:before,
//         .slick-next:hover:before {
//           opacity: 1;
//           color: #0f172a;
//           transform: scale(1.1);
//         }

//         .slick-prev { 
//           left: 1.5rem; 
//         }

//         .slick-next { 
//           right: 1.5rem; 
//         }

//         .slick-dots { 
//           bottom: 1.5rem; 
//         }

//         .slick-dots li {
//           width: 12px;
//           height: 12px;
//           margin: 0 5px;
//           transition: all 0.3s ease;
//         }

//         .slick-dots li button {
//           width: 12px;
//           height: 12px;
//           padding: 0;
//           border-radius: 50%;
//           background: rgba(90, 88, 88, 0.6);
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//         }

//         .slick-dots li button:before {
//           display: none;
//         }

//         .slick-dots li.slick-active button {
//           opacity: 1;
//           background: #ffffff;
//           transform: scale(1.2);
//           box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
//         }

//         .slick-dots li button:hover {
//           background: rgba(255, 255, 255, 0.9);
//           transform: scale(1.2);
//         }

//         .slick-slide > div { 
//           display: flex; 
//           align-items: center; 
//           justify-content: center; 
//         }

//         .slick-track, .slick-list { 
//           height: auto !important; 
//         }

//         /* Dark mode support */
//         .dark .slick-prev,
//         .dark .slick-next {
//           background: rgba(30, 41, 59, 0.8);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//         }

//         .dark .slick-prev:before,
//         .dark .slick-next:before {
//           color: #cbd5e1;
//         }

//         .dark .slick-dots li button {
//           background: rgba(255, 255, 255, 0.3);
//         }

//         .dark .slick-dots li.slick-active button {
//           background: #e2e8f0;
//           box-shadow: 0 0 0 2px rgba(226, 232, 240, 0.5);
//         }

//         @keyframes gradientShift {
//           0% { background-position: 0% 0%; }
//           50% { background-position: 100% 100%; }
//           100% { background-position: 0% 0%; }
//         }

//         @keyframes gradientFlow {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }

//         /* Enhanced focus styles for accessibility */
//         .slick-prev:focus-visible,
//         .slick-next:focus-visible {
//           outline: 2px solid #3b82f6;
//           outline-offset: 2px;
//         }

//         /* Responsive adjustments */
//         @media (max-width: 640px) {
//           .slick-prev, .slick-next { 
//             width: 40px; 
//             height: 40px; 
//           }

//           .slick-prev { 
//             left: 0.75rem; 
//           }

//           .slick-next { 
//             right: 0.75rem; 
//           }

//           .slick-prev:before, .slick-next:before { 
//             font-size: 18px; 
//           }

//           .slick-dots { 
//             bottom: 1rem; 
//           }
//         }

//         @media (min-width: 1024px) {
//           .slick-prev, .slick-next { 
//             width: 52px; 
//             height: 52px; 
//           }

//           .slick-prev { 
//             left: 2rem; 
//           }

//           .slick-next { 
//             right: 2rem; 
//           }

//           .slick-prev:before, .slick-next:before { 
//             font-size: 24px; 
//           }
//         }

//         /* Animation for slide transitions */
//         .slick-slide {
//           transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease;
//         }

//         /* Active slide enhancement */
//         .slick-slide.slick-active {
//           opacity: 1;
//           transform: scale(1);
//           z-index: 1;
//         }

//         /* New styles for MarketCapBanner */
//         .min-h-[400px] {
//           min-height: 400px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }
//         .p-6 {
//           padding: 1.5rem;
//         }
//       `}</style>
//         </div>
//     );
// };

// export default BannerSlider;

// *******************************wc******************************


// import React from 'react';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import Banner from '../components/Banner';
// import MarketCapBanner from '../components/MarketCapBanner';

// const BannerSlider = () => {
//   const settings = {
//     dots: true,
//     infinite: true,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: false,
//     autoplaySpeed: 7000,
//     pauseOnHover: true,
//     pauseOnDotsHover: true,
//     arrows: true,
//     adaptiveHeight: false,
//     fade: true,
//     speed: 1000,
//     cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
//     appendDots: (dots) => (
//       <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0">
//         <ul className="flex justify-center space-x-2 sm:space-x-3 md:space-x-4 backdrop-blur-sm bg-black/10 rounded-full py-2 px-3 mx-auto w-max">{dots}</ul>
//       </div>
//     ),
//     customPaging: (i) => (
//       <button
//         className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-white/60 hover:bg-white transition-all duration-300 transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         aria-label={`Go to slide ${i + 1}`}
//       ></button>
//     ),
//   };

//   return (
//     <div className=" relative w-full  mx-auto overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
//       <div className="pt-10 slider-container ">
//         <Slider {...settings}>
//           <div className="w-full relative">
//             <div
//               className="absolute inset-0 z-10"
//             // style={{
//             //   background: 'linear-gradient(135deg, rgba(157, 240, 212, 0.15) 0%, rgba(255, 252, 252, 0.25) 50%, transparent 100%)',
//             //   animation: 'gradientShift 12s ease infinite',
//             // }}
//             ></div>
//             <Banner />
//           </div>
//           <div className="">
//             <div
//               className="absolute inset-0 z-10"
//             // style={{
//             //   background: 'linear-gradient(135deg, rgba(197, 239, 247, 0.15) 0%, rgba(161, 233, 255, 0.25) 50%, transparent 100%)',
//             //   animation: 'gradientShift 12s ease infinite',
//             // }}
//             ></div>
//             <MarketCapBanner />
//           </div>
//         </Slider>
//       </div>

//       <style jsx global>{`
//         .slick-prev,
//         .slick-next {
//           z-index: 20;
//           width: 48px;
//           height: 48px;
//           background: rgba(255, 255, 255, 0.85);
//           border-radius: 20%;
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           display: flex !important;
//           align-items: center;
//           justify-content: center;
//           box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
//           backdrop-filter: blur(10px);
//           -webkit-backdrop-filter: blur(10px);
//           border: 1px solid rgba(255, 255, 255, 0.5);
//         }

//         .slick-prev:before,
//         .slick-next:before {
//           font-family: 'slick';
//           font-size: 22px;
//           line-height: 1;
//           opacity: 0.8;
//           color: #334155;
//           -webkit-font-smoothing: antialiased;
//           -moz-osx-font-smoothing: grayscale;
//           font-weight: bold;
//           transition: all 0.2s ease;
//         }

//         .slick-prev:hover,
//         .slick-next:hover,
//         .slick-prev:focus,
//         .slick-next:focus {
//           background: rgba(255, 255, 255, 0.95);
//           transform: translateY(-2px) scale(1.05);
//           outline: none;
//           box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
//         }

//         .slick-prev:hover:before,
//         .slick-next:hover:before {
//           opacity: 1;
//           color: #0f172a;
//           transform: scale(1.1);
//         }

//         .slick-prev { 
//           left: 1.5rem; 
//         }

//         .slick-next { 
//           right: 1.5rem; 
//         }

//         .slick-dots { 
//           bottom: 1.5rem; 
//         }

//         .slick-dots li {
//           width: 12px;
//           height: 12px;
//           margin: 0 5px;
//           transition: all 0.3s ease;
//         }

//         .slick-dots li button {
//           width: 12px;
//           height: 12px;
//           padding: 0;
//           border-radius: 50%;
//           background: rgba(90, 88, 88, 0.6);
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//         }

//         .slick-dots li button:before {
//           display: none;
//         }

//         .slick-dots li.slick-active button {
//           opacity: 1;
//           background: #ffffff;
//           transform: scale(1.2);
//           box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
//         }

//         .slick-dots li button:hover {
//           background: rgba(255, 255, 255, 0.9);
//           transform: scale(1.2);
//         }

//         .slick-slide > div { 
//           display: flex; 
//           align-items: center; 
//           justify-content: center; 
//         }

//         .slick-track, .slick-list { 
//           height: auto !important; 
//         }

//         /* Dark mode support */
//         .dark .slick-prev,
//         .dark .slick-next {
//           background: rgba(30, 41, 59, 0.8);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//         }

//         .dark .slick-prev:before,
//         .dark .slick-next:before {
//           color: #cbd5e1;
//         }

//         .dark .slick-dots li button {
//           background: rgba(255, 255, 255, 0.3);
//         }

//         .dark .slick-dots li.slick-active button {
//           background: #e2e8f0;
//           box-shadow: 0 0 0 2px rgba(226, 232, 240, 0.5);
//         }

//         @keyframes gradientShift {
//           0% { background-position: 0% 0%; }
//           50% { background-position: 100% 100%; }
//           100% { background-position: 0% 0%; }
//         }

//         @keyframes gradientFlow {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }

//         /* Enhanced focus styles for accessibility */
//         .slick-prev:focus-visible,
//         .slick-next:focus-visible {
//           outline: 2px solid #3b82f6;
//           outline-offset: 2px;
//         }

//         /* Responsive adjustments */
//         @media (max-width: 640px) {
//           .slick-prev, .slick-next { 
//             width: 40px; 
//             height: 40px; 
//           }

//           .slick-prev { 
//             left: 0.75rem; 
//           }

//           .slick-next { 
//             right: 0.75rem; 
//           }

//           .slick-prev:before, .slick-next:before { 
//             font-size: 18px; 
//           }

//           .slick-dots { 
//             bottom: 1rem; 
//           }
//         }

//         @media (min-width: 1024px) {
//           .slick-prev, .slick-next { 
//             width: 52px; 
//             height: 52px; 
//           }

//           .slick-prev { 
//             left: 2rem; 
//           }

//           .slick-next { 
//             right: 2rem; 
//           }

//           .slick-prev:before, .slick-next:before { 
//             font-size: 24px; 
//           }
//         }

//         /* Animation for slide transitions */
//         .slick-slide {
//           transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease;
//         }

//         /* Active slide enhancement */
//         .slick-slide.slick-active {
//           opacity: 1;
//           transform: scale(1);
//           z-index: 1;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default BannerSlider;

import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Banner from '../components/Banner';
import MarketCapBanner from '../components/MarketCapBanner';

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    pauseOnDotsHover: true,
    arrows: true,
    adaptiveHeight: false,
    fade: true,
    speed: 1000,
    cssEase: 'cubic-bezier(0.87, 0, 0.13, 1)',
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    appendDots: (dots) => (
      <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-0 right-0">
        <div className="flex justify-center items-center backdrop-blur-xl bg-black/20 rounded-2xl py-3 px-4 mx-auto w-max border border-white/10 shadow-2xl">
          <ul className="flex justify-center space-x-3 sm:space-x-4">{dots}</ul>
        </div>
      </div>
    ),
    customPaging: (i) => (
      <button
        className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-500 transform hover:scale-125 focus:outline-none focus:ring-3 focus:ring-blue-400/50 ${i === currentSlide
          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-blue-500/30 scale-125'
          : 'bg-white/70 hover:bg-white'
          }`}
        aria-label={`Go to slide ${i + 1}`}
      ></button>
    ),
  };

  // Progress bar animation
  useEffect(() => {
    if (isHovered) return;

    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.animation = 'none';
      setTimeout(() => {
        progressBar.style.animation = 'progress 5s linear';
      }, 100);
    }
  }, [currentSlide, isHovered]);

  return (
    <div
      className="relative w-full min-h-[350px] sm:min-h-[400px] md:min-h-[500px] mx-auto overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-sky-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-400/5 to-teal-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Progress bar */}
      {/* <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-30">
        <div
          className="progress-bar h-full bg-gradient-to-r from-cyan-400 to-blue-500 origin-left"
          style={{ animation: 'progress 5s linear' }}
        ></div>
      </div> */}

      {/* Slide counter */}
      {/* <div className="absolute top-1 right-6 z-20">
        <div className="">
          <span className="text-white font-semibold text-sm">
            {currentSlide + 1} <span className="text-white/60">/ 2</span>
          </span>
        </div>
      </div> */}

      <div className="pt-10  slider-container relative z-10">
        <Slider {...settings}>
          <div className="w-full relative">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 z-10 "></div>
            <div className="absolute inset-0 z-0  "></div>
            <Banner />
          </div>
          <div className="w-full relative">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 z-10"></div>
            <div className="absolute inset-0 z-0 "></div>
            <MarketCapBanner />
          </div>
        </Slider>
      </div>

      <style jsx global>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }

        .slick-prev,
        .slick-next {
          z-index: 20;
          width: 56px;
          height: 56px;
          
          border-radius: 50%;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex !important;
          align-items: center;
          justify-content: center;
          
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: none;
          transform: translateY(-50%);
        }

        .slick-prev:before,
        .slick-next:before {
          font-family: 'slick';
          font-size: 24px;
          line-height: 1;
          opacity: 0.9;
          color: #0f172a;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-weight: bold;
          transition: all 0.3s ease;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slick-prev:hover,
        .slick-next:hover,
        .slick-prev:focus,
        .slick-next:focus {
        
          transform: translateY(-50%) scale(1.1);
          outline: none;
         
        }

        .slick-prev:hover:before,
        .slick-next:hover:before {
          opacity: 1;
          color: #336068ff;
          transform: scale(1.2);
        }

        .slick-prev { 
          left: 2rem; 
        }

        .slick-next { 
          right: 2rem; 
        }

        .slick-dots { 
          bottom: 2rem; 
        }

        .slick-dots li {
          width: auto;
          height: auto;
         
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .slick-dots li button {
          width: 12px;
          height: 12px;
          padding: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .slick-dots li button:before {
          display: none;
        }

        .slick-dots li.slick-active {
          transform: scale(1.1);
        }

        .slick-dots li.slick-active button {
          opacity: 1;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          transform: scale(1.3);
          box-shadow: 
            0 0 20px rgba(125, 167, 235, 0.4),
            0 0 0 2px rgba(255, 255, 255, 0.3);
        }

        .slick-dots li button:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
        }

        .slick-slide > div { 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          height: 100%;
        }

        .slick-track, .slick-list { 
          height: 100% !important; 
        }

        /* Enhanced slide animations */
        .slick-slide {
          transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), 
                     opacity 0.8s ease;
          opacity: 0.7;
          transform: scale(0.95);
        }

        .slick-slide.slick-active {
          opacity: 1;
          transform: scale(1);
          z-index: 1;
        }

        /* Dark mode enhancements */
        .dark .slick-prev,
        .dark .slick-next {
          
          
        }

        .dark .slick-prev:before,
        .dark .slick-next:before {
          color: #e2e8f0;
        }

        .dark .slick-prev:hover,
        .dark .slick-next:hover {
         
        }

        .dark .slick-dots li button {
          background: rgba(255, 255, 255, 0.3);
        }

        .dark .slick-dots li.slick-active button {
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
        
        }

        /* Enhanced focus styles */
        .slick-prev:focus-visible,
        .slick-next:focus-visible,
        .slick-dots li button:focus-visible {
          outline: 3px solid #3b82f6;
          outline-offset: 2px;
          
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .slick-prev, .slick-next { 
            width: 44px; 
            height: 44px; 
          }

          .slick-prev { 
            left: 1rem; 
          }

          .slick-next { 
            right: 1rem; 
          }

          .slick-prev:before, .slick-next:before { 
            font-size: 18px; 
          }

          .slick-dots { 
            bottom: 1.5rem; 
          }
        }

        @media (min-width: 1536px) {
          .slick-prev, .slick-next { 
            width: 64px; 
            height: 64px; 
          }

          .slick-prev { 
            left: 3rem; 
          }

          .slick-next { 
            right: 3rem; 
          }

          .slick-prev:before, .slick-next:before { 
            font-size: 28px; 
          }
        }

        /* Smooth scrolling for the entire slider */
        .slider-container {
          scroll-behavior: smooth;
        }

        /* Performance optimizations */
        .slick-track {
          will-change: transform;
        }

        .slick-slide {
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default BannerSlider;
