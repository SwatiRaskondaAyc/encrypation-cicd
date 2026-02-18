// import React from 'react';

// const Aluminium = () => {
//   return (
//     <div className="card bg-gradient-to-r from-blue-300 to-indigo-400 hover:scale-105 transform duration-300 dark:from-cyan-700 dark:to-blue-500">
//       <div className="card-body p-6 text-center">
//         <h2 className="text-2xl font-bold mb-2 flex items-center justify-center">
//           Aluminium
//           <span className="ml-3 badge bg-red-500 text-white p-2 rounded-lg">-34.22</span>
//         </h2>
//         <p className="text-2xl font-bold dark:text-gray-200">
//           23,732.30 <span className="text-sm font-light">INR</span>
//         </p>
//         <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
//           The market dynamics for aluminum are influenced by supply, demand, energy prices, and geopolitical factors.
//         </p>
//         <div className="mt-4">
//           <button className="rounded-full border-2 px-6 py-2 text-sm font-medium text-blue-700 bg-yellow-300 hover:bg-yellow-400 dark:text-white dark:bg-yellow-500 dark:hover:bg-yellow-600 transition-all duration-300">
//             Read More
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Aluminium;

import React from 'react';

const Aluminium = () => {
  return (
    <div className="max-w-md mx-auto bg-white dark:from-cyan-800 dark:to-blue-600 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-500 transform hover:scale-[1.03] overflow-hidden">
      <div className="p-6 text-center text-black dark:text-gray-100">
        <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3 dark:text-black">
          Aluminium
          <span className="bg-red-600 text-white text-sm px-3 py-1 rounded-full shadow-md">
            -34.22
          </span>
        </h2>

        <p className="text-3xl font-extrabold mb-1 dark:text-black">
          23,732.30 <span className="text-base font-medium">INR</span>
        </p>

        <p className="text-sm text-gray-800 dark:text-black mt-3 leading-relaxed">
          Aluminium prices are impacted by global demand, energy costs, supply chain constraints, and political instability.
        </p>

        <div className="mt-6">
          <button className="inline-block px-6 py-2 bg-sky-800 hover:bg-sky-400 dark:bg-sky-800 dark:hover:bg-sky-400 text-white dark:text-white font-semibold rounded-full border-2 border-white transition-all duration-300 shadow-sm">
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Aluminium;
