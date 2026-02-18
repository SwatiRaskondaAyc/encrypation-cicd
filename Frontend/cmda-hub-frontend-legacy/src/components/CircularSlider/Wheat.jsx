// import React from 'react';

// const Wheat = () => {
//   return (
//     <div>
//       <div className="card bg-gradient-to-r from-blue-300 to-indigo-400 hover:scale-105 transform duration-300 dark:from-cyan-700 dark:to-blue-500">
//         <figure className="relative">
//           {/* <img
//             src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.FxcZRGIgk8o044IvJk3yWAHaE8%26pid%3DApi&f=1&ipt=b160a6d23dd8097c8fa70b739a8766442f78ce42f4dfdc4aaa4484c06ac91b63&ipo=images"
//             alt="Wheat"
//             className="w-full h-52 object-cover rounded-t-lg"
//           /> */}
//           {/* <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
//             Trending
//           </div> */}
//         </figure>
//         <div className="card-body p-6 text-center">
//           <h2 className="text-center card-title text-2xl font-bold mb-2 flex justify-center items-center">
//             Wheat
//             <div className="ml-3 badge bg-red-500 text-white p-2 rounded-lg">
//               -10.01
//             </div>
//           </h2>
//           <p className="font-bold text-2xl  text-xl  dark:text-gray-200">
//             23,732.30 <span className="text-sm font-light">INR</span>
//           </p>
//           <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
//           Vegetable oil is a major edible oil used globally in cooking, food production, and various industrial applications. <br /> The key vegetable oils include palm oil, soybean oil, canola oil, and sunflower oil, with palm oil being the most widely produced and traded globally..
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

// export default Wheat;

import React from 'react';

const Wheat = () => {
  return (
    <div className="max-w-md mx-auto bg-white dark:from-yellow-600 dark:to-yellow-700 rounded-3xl shadow-xl hover:shadow-2xl transition duration-500 transform hover:scale-[1.03] overflow-hidden">
      <div className="p-6 text-center text-black dark:text-white">
        <h2 className="text-3xl font-bold mb-3 flex items-center justify-center dark:text-black gap-3">
          Wheat
          <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full shadow-md">
            -10.01
          </span>
        </h2>

        <p className="text-3xl font-extrabold dark:text-black mb-1">
          23,732.30 <span className="text-base font-medium">INR</span>
        </p>

        <p className="text-gray-800 dark:text-black mt-3 text-sm leading-relaxed">
          Wheat is one of the world's most important crops, serving as a staple food for a large part of the global population. Its price is affected by factors such as weather conditions, global demand, and crop yields.
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

export default Wheat;

