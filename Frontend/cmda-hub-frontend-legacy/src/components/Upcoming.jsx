// import React from 'react';
// import Navbar from './Navbar';
// function Upcoming() {
 
//   return (

//     <div
//     className="relative overflow-hidden py-20 px-4 md:px-12 lg:px-24 banner-background"
//     style={{
//       background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("/public/home4.jpg")',
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//       backgroundAttachment: 'fixed',
//     }}
//   >
//     <Navbar/>
//     <div className='min-h-screen text-white text-center flex justify-center items-center aligns-middle mt-10 dark:bg-slate-600 dark:text-white'>

//     <h1 className='text-3xl'>Upcoming......</h1>
//     </div>
//     </div>
//   );
// }

// export default Upcoming;


import React from 'react';
import Navbar from './Navbar';
import { MdDashboard } from "react-icons/md";
import Footer from './Footer';

function Upcoming() {
  return (
    <div
      className="relative overflow-hidden py-20 px-4 md:px-12 lg:px-24 banner-background"
      style={{
        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url("/home1.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar />
      <div className='min-h-screen text-white text-center flex flex-col justify-center items-center  dark:bg-slate-600 dark:text-white'>
        <h1 className='text-4xl font-bold mb-4 flex gap-1'><MdDashboard /> Dashboard Coming Soon</h1>
        <p className='text-lg max-w-xl'>
          We're currently working on bringing you an amazing experience. The dashboard is under development and will be available shortly.
        </p>
        <div className="mt-6">
          <span className="text-sm text-gray-300">Stay tuned and check back soon!</span>
        </div>

        
        <div className="mt-10">
          
          <button className="px-4 py-2 rounded-r bg-blue-600 hover:bg-blue-700 transition text-white">
            Notify Me
          </button>
        </div>
      </div>
     
    </div>
  );
}

export default Upcoming;
