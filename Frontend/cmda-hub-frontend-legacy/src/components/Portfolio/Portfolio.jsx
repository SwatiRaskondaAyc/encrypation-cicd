// import React from 'react';
// import Navbar from '../Navbar';
// import Footer from '../Footer';
// import portfolio from '../../../public/portfolio.jpg'
// import Login from '../Login.jsx';

// const Portfolio = () => {
//   return (
//     <>
// <Navbar/>
// <div className="bg-white">
//       <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
//         <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
//           <svg
//             viewBox="0 0 1024 1024"
//             aria-hidden="true"
//             className="absolute left-1/2 top-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
//           >
//             <circle r={512} cx={512} cy={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
//             <defs>
//               <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
//                 <stop stopColor="#FFD700" />
//                 <stop offset={1} stopColor="##FFEA70" />
//               </radialGradient>
//             </defs>
//           </svg>
//           <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
//             <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
//              Elevate Your Portfolio Analysis
//             </h2>
//             <p className="mt-6 text-pretty text-lg/8 text-gray-300">
//              Take control of your investments with our intelligent portfolio tracking tool. Gain insights, optimize performance, and make informed decisions.
//             </p>
//             <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
//               <a
//                 onClick={() => document.getElementById("my_modal_3").showModal()} 
//                 className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
//               >
//                 Get started
//               </a>
//               <Login/>
//               <a href="/portDash" className="text-sm/6 font-semibold text-white">
//                 Learn more <span aria-hidden="true">→</span>
//               </a>
//             </div>
//           </div>
//           <div className="relative mt-16 h-80 lg:mt-8">
//             <img
//               alt="App screenshot"
//               src={portfolio}
//               width={1824}
//               height={1080}
//               className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//     <Footer/>
//     </>
//   );
// };

// export default Portfolio;










import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import portfolio from '../../../public/portfolio.jpg';
import Login from '../Login.jsx';
import { Link } from "react-router-dom";

const Portfolio = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 dark:bg-slate-900 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="relative bg-gray-900 text-white rounded-3xl shadow-lg overflow-hidden max-w-7xl w-full p-8 md:p-16 lg:flex lg:items-center lg:gap-x-16">
          {/* Gradient Effect */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-yellow-500/30 via-gray-900 to-yellow-300/20"></div>
          
          {/* Text Section */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
              Elevate Your Portfolio Analysis
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Take control of your investments with our intelligent portfolio tracking tool. Gain insights, optimize performance, and make informed decisions.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
              {/* <button
                onClick={() => document.getElementById("my_modal_3").showModal()}
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-6 py-3 rounded-lg shadow-md transition"
              >
                Get Started
              </button>
              <Login /> */}
              {/* <a
                href="/portDash"
                className="text-yellow-400 hover:underline text-lg font-medium"
              >
                Learn more →
              </a> */}

              <Link
                to="/portDash"
                className="text-yellow-400 hover:underline text-lg font-medium"
              >
                Learn more →
              </Link>
              
            </div>
          </div>
          
          {/* Image Section */}
          <div className="mt-10 lg:mt-0 lg:w-1/2 flex justify-center">
            <img
              alt="Portfolio Dashboard Preview"
              src={portfolio}
              className="w-full max-w-lg rounded-lg shadow-lg border border-gray-700"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Portfolio;

