// import React from 'react';

// const Cotton = () => {
//   return (
//     <div>
//       <div className="card bg-gradient-to-r from-blue-300 to-indigo-400 hover:scale-105 transform duration-300 dark:from-cyan-700 dark:to-blue-500">
//         <figure className="relative">
//           {/* <img
//             src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.pcHFigMqZxinQygrrVqScAHaFj%26pid%3DApi&f=1&ipt=5fffcc97bbb053367737d842c1f5e6e68d37d1ff78dcf1fa21f2432d38b5fa0c&ipo=images"
//             alt="Cotton"
//             className="w-full md:1/2 h-52 object-cover rounded-t-lg"
//           /> */}
//           {/* <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
//             Trending
//           </div> */}
//         </figure>
//         <div className="card-body p-6 text-center">
//           <h2 className="card-title text-2xl font-bold mb-2 flex items-center justify-center">
//             Cotton
//             <div className="ml-3 badge bg-green-500 text-white p-2 rounded-lg">
//               +42.22
//             </div>
//           </h2>
//           <p className="text-2xl font-bold dark:text-gray-200">
//             32,342.30 <span className="text-sm font-light">INR</span>
//           </p>
//           <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
//           The cotton market is highly dynamic, influenced by agricultural, industrial, and economic factors.
//           <br /> Here's an in-depth look at the current state of the cotton market
//           </p>
//           <div className="text-centercard-actions mt-4">
//             <button className="rounded-full border-2 px-6 py-2 text-sm font-medium text-blue-700 bg-yellow-300 hover:bg-yellow-400 dark:text-white dark:bg-yellow-500 dark:hover:bg-yellow-600 transition-all duration-300">
//               Read More
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cotton;

import React from 'react';

const Cotton = () => {
  return (
    <div className="max-w-md mx-auto bg-white text-black dark:from-cyan-800 dark:to-blue-600 rounded-3xl shadow-xl shadow-black hover:shadow-2xl transition-shadow duration-500 transform hover:scale-[1.03] overflow-hidden">
      <div className="p-6 text-center text-black dark:text-gray-100">
        <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3 dark:text-black">
          Cotton
          <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full shadow-md">
            +42.22
          </span>
        </h2>

        <p className="text-3xl font-extrabold mb-1 dark:text-black">
          32,342.30 <span className="text-base font-medium">INR</span>
        </p>

        <p className="text-sm text-gray-800 dark:text-black mt-3 leading-relaxed">
          The cotton market is highly dynamic, influenced by agricultural, industrial, and economic factors. <br />
          Here’s an in-depth look at the current state of the cotton market.
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

export default Cotton;
