// // src/components/PointsDashboard.jsx
// import React, { useState } from 'react';
// import { usePoints } from '../../hooks/usePoints';

// const PointsDashboard = () => {
//   const { pointsData, loading, error, refetch } = usePoints();

//   if (loading) return <div>Loading points...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!pointsData?.data) return <div>No points data available</div>;

//   const { totalPoints, equityPoints, portfolioPoints, tutorialPoints } = pointsData.data;

//   return (
//     <div>
//       <h2>Your Points: {totalPoints}</h2>
//       <button onClick={refetch}>Refresh</button>
//     </div>
//   );
// };

// export default PointsDashboard;

// import React, { useState } from 'react';
// import { usePoints } from '../../hooks/usePoints';
// import {
//   Trophy,
//   TrendingUp,
//   Briefcase,
//   BookOpen,
//   RefreshCw,
//   X,
//   Award
// } from 'lucide-react';

// const PointsDashboard = () => {
//   const { pointsData, loading, error, refetch } = usePoints();
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2 text-gray-600">Loading points...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
//         <div className="text-red-600 mb-2">⚠️ {error}</div>
//         <button
//           onClick={refetch}
//           className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   if (!pointsData?.data) {
//     return (
//       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
//         <div className="text-yellow-600">No points data available</div>
//       </div>
//     );
//   }

//   const { totalPoints, equityPoints, portfolioPoints, tutorialPoints, userType } = pointsData.data;

//   // Calculate progress percentage for visual indicator
//   const getTierProgress = (points) => {
//     if (points >= 1000) return 100;
//     if (points >= 500) return (points - 500) / 5;
//     if (points >= 250) return (points - 250) / 2.5;
//     if (points >= 100) return (points - 100) / 1.5;
//     return points;
//   };

//   const progress = getTierProgress(totalPoints);

//   return (
//     <>
//       {/* Main Points Card */}
//       <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
//         <div className="p-6">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-blue-100 rounded-full">
//                 <Trophy className="w-6 h-6 text-blue-600" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold text-gray-800">Points Summary</h2>
//                 <span className="text-sm text-gray-500 capitalize">{userType || 'user'}</span>
//               </div>
//             </div>
//             <button
//               onClick={refetch}
//               className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
//               title="Refresh points"
//             >
//               <RefreshCw className="w-5 h-5" />
//             </button>
//           </div>

//           {/* Total Points Display */}
//           <div
//             className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02]"
//             onClick={() => setIsModalOpen(true)}
//           >
//             <div className="text-4xl font-bold mb-2">{totalPoints}</div>
//             <div className="text-blue-100">Total Points</div>
//             <div className="text-sm text-blue-200 mt-2">Click to view details →</div>
//           </div>

//           {/* Progress Bar */}
//           <div className="mt-4">
//             <div className="flex justify-between text-sm text-gray-600 mb-1">
//               <span>Progress to next tier</span>
//               <span>{Math.min(100, Math.round(progress))}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div
//                 className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
//                 style={{ width: `${Math.min(100, progress)}%` }}
//               ></div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-100">
//               <div className="flex items-center space-x-3">
//                 <Award className="w-6 h-6 text-blue-600" />
//                 <h3 className="text-xl font-bold text-gray-800">Points Breakdown</h3>
//               </div>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6">
//               {/* Total Points Summary */}
//               <div className="text-center mb-6">
//                 <div className="text-3xl font-bold text-gray-800 mb-2">{totalPoints}</div>
//                 <div className="text-gray-600">Total Points Earned</div>
//               </div>

//               {/* Points Categories */}
//               <div className="space-y-4">
//                 {/* Equity Points */}
//                 <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
//                   <div className="flex items-center space-x-3">
//                     <div className="p-2 bg-green-100 rounded-lg">
//                       <TrendingUp className="w-5 h-5 text-green-600" />
//                     </div>
//                     <div>
//                       <div className="font-semibold text-gray-800">Equity Analysis</div>
//                       <div className="text-sm text-gray-600">Stock ratings & analysis</div>
//                     </div>
//                   </div>
//                   <div className="text-2xl font-bold text-green-600">{equityPoints}</div>
//                 </div>

//                 {/* Portfolio Points */}
//                 <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
//                   <div className="flex items-center space-x-3">
//                     <div className="p-2 bg-orange-100 rounded-lg">
//                       <Briefcase className="w-5 h-5 text-orange-600" />
//                     </div>
//                     <div>
//                       <div className="font-semibold text-gray-800">Portfolio Management</div>
//                       <div className="text-sm text-gray-600">Portfolio ratings & tools</div>
//                     </div>
//                   </div>
//                   <div className="text-2xl font-bold text-orange-600">{portfolioPoints}</div>
//                 </div>

//                 {/* Tutorial Points */}
//                 <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
//                   <div className="flex items-center space-x-3">
//                     <div className="p-2 bg-purple-100 rounded-lg">
//                       <BookOpen className="w-5 h-5 text-purple-600" />
//                     </div>
//                     <div>
//                       <div className="font-semibold text-gray-800">Tutorials</div>
//                       <div className="text-sm text-gray-600">Learning & video ratings</div>
//                     </div>
//                   </div>
//                   <div className="text-2xl font-bold text-purple-600">{tutorialPoints}</div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex space-x-3 mt-6">
//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
//                 >
//                   Close
//                 </button>

//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add some custom animations */}
//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes scaleIn {
//           from { transform: scale(0.9); opacity: 0; }
//           to { transform: scale(1); opacity: 1; }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.2s ease-out;
//         }
//         .animate-scaleIn {
//           animation: scaleIn 0.2s ease-out;
//         }
//       `}</style>
//     </>
//   );
// };

// export default PointsDashboard;







import React, { useState } from 'react';
import { usePoints } from '../../hooks/usePoints';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  TrendingUp,
  Briefcase,
  BookOpen,
  RefreshCw,
  X,
  Award,
  Lock
} from 'lucide-react';

const PointsDashboard = () => {
  const { pointsData, loading, error, refetch } = usePoints();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
        <div className="text-red-600 text-sm mb-2">{error}</div>
        <button
          onClick={refetch}
          className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!pointsData?.data) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
        <div className="text-yellow-600 text-sm">No points data</div>
      </div>
    );
  }

  const { totalPoints, equityPoints, portfolioPoints, tutorialPoints, userType } = pointsData.data;

  const handleEquityClick = () => {
    navigate('/equityinsights');
  };

  const handleTutorialClick = () => {
    navigate('/search-tutorial');
  };

  const getTierProgress = (points) => {
    if (points >= 1000) return 100;
    if (points >= 500) return (points - 500) / 5;
    if (points >= 250) return (points - 250) / 2.5;
    if (points >= 100) return (points - 100) / 1.5;
    return points;
  };

  const progress = getTierProgress(totalPoints);

  return (
    <>
      {/* Compact Main Points Card */}
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-100 rounded-full">
                <Trophy className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Points</h2>
                {/* <span className="text-xs text-gray-500 capitalize">{userType || 'user'}</span> */}
              </div>
            </div>
            {/* <button
              onClick={refetch}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Refresh points"
            >
              <RefreshCw className="w-4 h-4" />
            </button> */}
          </div>

          {/* Total Points Display */}
          <div
            className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-4 text-white text-center cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="text-2xl font-bold mb-1">{totalPoints}</div>
            <div className="text-blue-100 text-xs">Total Points</div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Next tier</span>
              <span>{Math.min(100, Math.round(progress))}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, progress)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full animate-scaleIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Points Breakdown</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {/* Total Points Summary */}
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-gray-800 mb-1">{totalPoints}</div>
                <div className="text-sm text-gray-600">Total Points Earned</div>
              </div>

              {/* Points Categories */}
              <div className="space-y-3">
                {/* Equity Points - Clickable */}
                <div
                  onClick={handleEquityClick}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100 cursor-pointer hover:bg-green-100 hover:border-green-200 transition-colors group"
                >
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 text-sm">Equity Analysis</div>
                      <div className="text-xs text-gray-600">Stock ratings & analysis</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-600">{equityPoints}</div>
                </div>

                {/* Portfolio Points - Blurred/Disabled */}
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border border-gray-200 cursor-not-allowed relative">
                  <div className="flex items-center space-x-2 opacity-60">
                    <div className="p-1.5 bg-gray-200 rounded-lg">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-600 text-sm">Portfolio Management</div>
                      <div className="text-xs text-gray-500">Coming soon</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-500">{portfolioPoints}</div>
                  <Lock className="w-3 h-3 text-gray-400 absolute top-2 right-2" />
                </div>

                {/* Tutorial Points - Clickable */}
                <div
                  onClick={handleTutorialClick}
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100 cursor-pointer hover:bg-purple-100 hover:border-purple-200 transition-colors group"
                >
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 text-sm">Tutorials</div>
                      <div className="text-xs text-gray-600">Learning & videos</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-purple-600">{tutorialPoints}</div>
                </div>
              </div>

              {/* Action Buttons */}
              {/* <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default PointsDashboard;