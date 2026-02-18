
// import React from 'react';
// import {
//   TrendingUp, TrendingDown, BarChart2, Zap, PieChart, ArrowRight
// } from 'lucide-react';
// import { FaIndianRupeeSign } from "react-icons/fa6";
// import * as Icons from 'react-icons/fa';

// const SectorIcons = {
//   'Capital Goods': <Icons.FaIndustry />,
//   'Logistics': <Icons.FaTruck />,
//   'Automobile & Ancillaries': <Icons.FaCar />,
//   'Realty': <Icons.FaBuilding />,
//   'Textile': <Icons.FaTshirt />,
//   'Hospitality': <Icons.FaHotel />,
//   'Chemicals': <Icons.FaFlask />,
//   'Consumer Durables': <Icons.FaCouch />,
//   'Agri': <Icons.FaLeaf />,
//   'Finance': <Icons.FaMoneyBillWave />,
//   'Diversified': <Icons.FaChartLine />,
//   'FMCG': <Icons.FaShoppingCart />,
//   'Electricals': <Icons.FaLightbulb />,
//   'Power': <Icons.FaBolt />,
//   'Healthcare': <Icons.FaHeartbeat />,
//   'Ratings': <Icons.FaStar />,
//   'Crude Oil': <Icons.FaOilCan />,
//   'Telecom': <Icons.FaBroadcastTower />,
//   'Bank': <Icons.FaUniversity />,
//   'Iron & Steel': <Icons.FaCog />,
//   'Diamond & Jewellery': <Icons.FaGem />,
//   'Plastic Products': <Icons.FaBox />,
//   'Trading': <Icons.FaExchangeAlt />,
//   'Infrastructure': <Icons.FaTools />,
//   'Media & Entertainment': <Icons.FaFilm />,
//   'IT': <Icons.FaLaptop />,
//   'Business Services': <Icons.FaUserTie />,
//   'Construction Materials': <Icons.FaHardHat />,
//   'Retailing': <Icons.FaShoppingBag />,
//   'Paper': <Icons.FaFileAlt />,
//   'Miscellaneous': <Icons.FaBoxOpen />,
//   'Mining': <Icons.FaMountain />,
//   'Abrasives': <Icons.FaTools />,
//   'Alcohol': <Icons.FaWineBottle />,
//   'Inds. Gases & Fuels': <Icons.FaGasPump />,
//   'Gas Transmission': <Icons.FaSubway />,
//   'Ferro Manganese': <Icons.FaCog />,
//   'Aviation': <Icons.FaPlane />,
//   'ETF': <Icons.FaChartLine />,
//   'Education & Training': <Icons.FaGraduationCap />,
//   'Ship Building': <Icons.FaShip />,
//   'Insurance': <Icons.FaShieldAlt />,
//   'Photographic Product': <Icons.FaCamera />,
//   'Others': <Icons.FaPuzzlePiece />
// };

// const formatNumber = (value, decimals = 2) =>
//   Number.isFinite(Number(value)) ? Number(value).toFixed(decimals) : '-';

// const formatINRCrore = (value, decimals = 2) => {
//   if (!Number.isFinite(Number(value))) return '-';
//   const crValue = value / 1e7;
//   return `${Number(crValue).toFixed(decimals)} Cr`;
// };

// const formatPercentage = (value, decimals = 2) => {
//   if (!Number.isFinite(Number(value))) return '-';
//   return `${(value * 100).toFixed(decimals)}%`;
// };

// const IndiceCard = ({ sectorData, isSelected, openModal, setSelectedSector }) => {
//   const {
//     Sector,
//     SectorPE_Mode,
//     SectorCAGR_TTM_YoY,
//     SectorMarketCap,
//     Total,
//     Ups,
//     Downs,
//     Companies
//   } = sectorData;

//   const icon = SectorIcons[Sector] || <Icons.FaChartPie className="opacity-90" />;
//   const isPositiveTrend = SectorCAGR_TTM_YoY >= 0;
//   const upsPercentage = Total > 0 ? (Ups / Total) * 100 : 0;
//   const downsPercentage = Total > 0 ? (Downs / Total) * 100 : 0;

//   // Generate a unique gradient based on sector name
//   const sectorHash = Array.from(Sector).reduce((acc, char) => acc + char.charCodeAt(0), 0);
//   const gradientClass = [
//     'from-slate-900 to-sky-600',
//     'from-slate-900 to-sky-600',
//     'from-slate-900 to-sky-600',
//     'from-slate-900 to-sky-600',
//     'from-slate-900 to-sky-600'
//   ][sectorHash % 5];

//   const handleViewDetails = () => {
//     setSelectedSector(sectorData);
//     openModal();
//   };

//   return (
//     <div className={`relative bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl w-full max-w-sm h-[400px] border border-gray-200 ${isSelected ? 'ring-2 ring-opacity-70 scale-105' : ''}`}>
//       {/* Gradient Header */}
//       <div className={`h-32 bg-gradient-to-r ${gradientClass} flex items-center justify-center relative overflow-hidden`}>
//         <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
//         <div className="relative z-10 flex flex-col items-center text-white">
//           <div className="bg-white/20 p-2 rounded-full">
//             {React.cloneElement(icon, { className: "w-10 h-10 opacity-90" })}
//           </div>
//           <h3 className="mt-2 text-xl font-semibold tracking-tight">{Sector}</h3>
//           <p className={`mt-1 text-sm font-medium flex items-center ${isPositiveTrend ? 'text-emerald-400' : 'text-rose-400'}`}>
//             {isPositiveTrend ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
//             {formatPercentage(SectorCAGR_TTM_YoY)} 1Y Growth
//           </p>
//         </div>
//       </div>

//       {/* Content Section */}
//       <div className="p-4 space-y-4 h-[268px] flex flex-col justify-between">
//         {/* Key Metrics Grid */}
//         <div className="grid grid-cols-2 gap-3">
//           <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
//             <p className="text-xs text-gray-600 flex items-center gap-1">
//               <FaIndianRupeeSign className="w-3 h-3" /> P/E Ratio
//             </p>
//             <p className="mt-1 text-lg font-bold text-gray-800">{formatNumber(SectorPE_Mode)}</p>
//           </div>
//           <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
//             <p className="text-xs text-gray-600 flex items-center gap-1">
//               <PieChart className="w-3 h-3" /> Market Cap
//             </p>
//             <p className="mt-1 text-lg font-bold text-gray-800">{formatINRCrore(SectorMarketCap)}</p>
//           </div>
//         </div>

//         {/* Advancing/Declining Bar */}
//         <div className="mt-3">
//           <div className="flex justify-between text-xs mb-1">
//             <span className="text-green-600 font-medium flex items-center">
//               <TrendingUp className="w-3.5 h-3.5 mr-1" /> {Ups || 0} Advancing
//             </span>
//             <span className="text-rose-500 font-medium flex items-center">
//               <TrendingDown className="w-3.5 h-3.5 mr-1" /> {Downs || 0} Declining
//             </span>
//           </div>
//           <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
//             <div className="h-full flex">
//               <div
//                 className="bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 ease-out"
//                 style={{ width: `${upsPercentage}%` }}
//               ></div>
//               <div
//                 className="bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-500 ease-out"
//                 style={{ width: `${downsPercentage}%` }}
//               ></div>
//             </div>
//           </div>
//         </div>

//         {/* View Details Button */}
//         <button
//           onClick={handleViewDetails}
//           className="w-full mt-4 bg-gradient-to-r from-sky-700 to-slate-500 hover:from-sky-600 hover:to-gray-500 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
//         >
//           View Details <ArrowRight className="w-4 h-4 inline ml-1 transition-transform group-hover:translate-x-1" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default IndiceCard;




import React from 'react';
import {
  TrendingUp, TrendingDown, BarChart2, Zap, PieChart, ArrowRight
} from 'lucide-react';
import { FaIndianRupeeSign } from "react-icons/fa6";
import * as Icons from 'react-icons/fa';

const SectorIcons = {
  'Capital Goods': <Icons.FaIndustry />,
  'Logistics': <Icons.FaTruck />,
  'Automobile & Ancillaries': <Icons.FaCar />,
  'Realty': <Icons.FaBuilding />,
  'Textile': <Icons.FaTshirt />,
  'Hospitality': <Icons.FaHotel />,
  'Chemicals': <Icons.FaFlask />,
  'Consumer Durables': <Icons.FaCouch />,
  'Agri': <Icons.FaLeaf />,
  'Finance': <Icons.FaMoneyBillWave />,
  'Diversified': <Icons.FaChartLine />,
  'FMCG': <Icons.FaShoppingCart />,
  'Electricals': <Icons.FaLightbulb />,
  'Power': <Icons.FaBolt />,
  'Healthcare': <Icons.FaHeartbeat />,
  'Ratings': <Icons.FaStar />,
  'Crude Oil': <Icons.FaOilCan />,
  'Telecom': <Icons.FaBroadcastTower />,
  'Bank': <Icons.FaUniversity />,
  'Iron & Steel': <Icons.FaCog />,
  'Diamond & Jewellery': <Icons.FaGem />,
  'Plastic Products': <Icons.FaBox />,
  'Trading': <Icons.FaExchangeAlt />,
  'Infrastructure': <Icons.FaTools />,
  'Media & Entertainment': <Icons.FaFilm />,
  'IT': <Icons.FaLaptop />,
  'Business Services': <Icons.FaUserTie />,
  'Construction Materials': <Icons.FaHardHat />,
  'Retailing': <Icons.FaShoppingBag />,
  'Paper': <Icons.FaFileAlt />,
  'Miscellaneous': <Icons.FaBoxOpen />,
  'Mining': <Icons.FaMountain />,
  'Abrasives': <Icons.FaTools />,
  'Alcohol': <Icons.FaWineBottle />,
  'Inds. Gases & Fuels': <Icons.FaGasPump />,
  'Gas Transmission': <Icons.FaSubway />,
  'Ferro Manganese': <Icons.FaCog />,
  'Aviation': <Icons.FaPlane />,
  'ETF': <Icons.FaChartLine />,
  'Education & Training': <Icons.FaGraduationCap />,
  'Ship Building': <Icons.FaShip />,
  'Insurance': <Icons.FaShieldAlt />,
  'Photographic Product': <Icons.FaCamera />,
  'Others': <Icons.FaPuzzlePiece />
};

const formatNumber = (value, decimals = 2) =>
  Number.isFinite(Number(value)) ? Number(value).toFixed(decimals) : '-';

const formatINRCrore = (value, decimals = 2) => {
  if (!Number.isFinite(Number(value))) return '-';
  const crValue = value / 1e7;
  return `${Number(crValue).toFixed(decimals)} Cr`;
};

const formatPercentage = (value, decimals = 2) => {
  if (!Number.isFinite(Number(value))) return '-';
  return `${(value * 100).toFixed(decimals)}%`;
};

const IndiceCard = ({ sectorData, isSelected, openModal, setSelectedSector }) => {
  const {
    Sector,
    SectorPE_Mode,
    SectorCAGR_1Y_MCap,
    SectorMarketCap,
    Total,
    Ups,
    Downs,
    Companies
  } = sectorData;

  const icon = SectorIcons[Sector] || <Icons.FaChartPie className="opacity-90" />;
  const isPositiveTrend = SectorCAGR_1Y_MCap >= 0;
  const upsPercentage = Total > 0 ? (Ups / Total) * 100 : 0;
  const downsPercentage = Total > 0 ? (Downs / Total) * 100 : 0;

  // Generate a unique gradient based on sector name
  const sectorHash = Array.from(Sector).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradientClass = [
    'from-slate-900 to-sky-600',
    'from-slate-900 to-sky-600',
    'from-slate-900 to-sky-600',
    'from-slate-900 to-sky-600',
    'from-slate-900 to-sky-600'
  ][sectorHash % 5];


  //   const gradientClass = [
  //   'from-blue-800 via-blue-500 to-blue-800',
  //   'from-blue-800 via-blue-500 to-blue-800',
  //   'from-blue-800 via-blue-500 to-blue-800',
  //   'from-blue-800 via-blue-500 to-blue-800',
  //   'from-blue-800 via-blue-500 to-blue-800'
  // ][sectorHash % 5];

  const handleViewDetails = () => {
    setSelectedSector(sectorData);
    openModal();
  };

  return (
    <div className={`relative bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl w-full max-w-sm h-[400px] border border-gray-200 ${isSelected ? 'ring-2 ring-opacity-70 scale-105' : ''}`}>
      {/* Gradient Header */}
      <div className={`h-32 bg-gradient-to-r ${gradientClass} flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col items-center text-white">
          <div className="bg-white/20 p-2 rounded-full">
            {React.cloneElement(icon, { className: "w-10 h-10 opacity-90" })}
          </div>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">{Sector}</h3>
          <p className={`mt-1 text-sm font-medium flex items-center ${isPositiveTrend ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositiveTrend ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {formatPercentage(SectorCAGR_1Y_MCap)} 1Y Growth
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-4 h-[268px] flex flex-col justify-between">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <FaIndianRupeeSign className="w-3 h-3" /> P/E Ratio
            </p>
            <p className="mt-1 text-lg font-bold text-gray-800">{formatNumber(SectorPE_Mode)}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <PieChart className="w-3 h-3" /> Market Cap
            </p>
            <p className="mt-1 text-lg font-bold text-gray-800">{formatINRCrore(SectorMarketCap)}</p>
          </div>
        </div>

        {/* Advancing/Declining Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-green-600 font-medium flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> {Ups || 0} Advancing
            </span>
            <span className="text-rose-500 font-medium flex items-center">
              <TrendingDown className="w-3.5 h-3.5 mr-1" /> {Downs || 0} Declining
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
            <div className="h-full flex">
              <div
                className="bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 ease-out"
                style={{ width: `${upsPercentage}%` }}
              ></div>
              <div
                className="bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-500 ease-out"
                style={{ width: `${downsPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={handleViewDetails}
          className="w-full mt-4 bg-gradient-to-r from-sky-700 to-slate-500 hover:from-sky-600 hover:to-gray-500 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          View Details <ArrowRight className="w-4 h-4 inline ml-1 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default IndiceCard;