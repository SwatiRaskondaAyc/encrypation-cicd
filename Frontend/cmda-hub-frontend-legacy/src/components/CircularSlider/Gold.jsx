// import React from 'react';

// const Gold = () => {
//   return (
//     <div>
//       <div className="card bg-gradient-to-r from-blue-300 to-indigo-400 hover:scale-105 transform duration-300 dark:from-cyan-700 dark:to-blue-500">
//         <figure className="relative">
//           {/* <img
//             src="./assets/gold.jpg"
//             alt="Gold"
//             className="w-full h-52 object-cover rounded-t-lg"
//           /> */}
//           {/* <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
//             Trending
//           </div> */}
//         </figure>
//         <div className="card-body p-6 text-center">
//           <h2 className="card-title text-2xl font-bold mb-2 flex justify-center items-center">
//             Gold
//             <div className="ml-3 badge bg-green-500 text-white p-2 rounded-lg">
//               +62.12
//             </div>
//           </h2>
//           <p className=" font-bold text-2xl  text-xl  dark:text-gray-200">
//             34,732.30 <span className="text-sm font-light">INR</span>
//           </p>
//           <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
//           Gold is a highly valued precious metal used in jewelry, investment, and industrial applications. Its price is driven by demand as a safe-haven asset,<br /> currency hedge, and inflation protector.


//           </p>
//           <div className="text-cardcard-actions mt-4">
//             <button className="rounded-full border-2 px-6 py-2 text-sm font-medium text-blue-700 bg-yellow-300 hover:bg-yellow-400 dark:text-white dark:bg-yellow-500 dark:hover:bg-yellow-600 transition-all duration-300">
//               Read More
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Gold;
import React from 'react';
import { FaCoins } from 'react-icons/fa'; // Optional: icon for visual flair

const Gold = () => {
  return (
    <div className="max-w-md mx-auto bg-white dark:from-yellow-600 dark:to-yellow-700 rounded-3xl shadow-xl hover:shadow-2xl transition duration-500 transform hover:scale-[1.03] overflow-hidden">
      <div className="p-6 text-center text-gray-900 dark:text-white">
        <h2 className="text-3xl font-bold dark:text-black mb-3 flex items-center justify-center gap-3">
          <FaCoins className="text-black dark:text-black" /> Gold
          <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full shadow-md">
            +62.12
          </span>
        </h2>

        <p className="text-3xl font-extrabold mb-1 dark:text-black">
          34,732.30 <span className="text-base font-medium">INR</span>
        </p>

        <p className="text-gray-800 dark:text-black mt-3 text-sm leading-relaxed">
          Gold is a highly valued precious metal used in jewelry, investment, and industrial applications. Its price is driven by demand as a safe-haven asset,
          currency hedge, and inflation protector.
        </p>

        <div className="mt-6">
          <button className="inline-block px-6 py-2 bg-sky-800 hover:bg-sky-400 text-white font-semibold rounded-full border-2 border-white transition-all duration-300 shadow-sm dark:bg-sky-800 dark:hover:bg-sky-400">
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gold;

