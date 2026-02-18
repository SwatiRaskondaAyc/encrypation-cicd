// import { useState } from 'react';
// import {
//   FaTachometerAlt,
//   FaBullseye,
//   FaTasks,
//   FaChartLine,
//   FaCog,
//   FaBars,
// } from 'react-icons/fa';

// const SidebarLeft = () => {
//   const [collapsed, setCollapsed] = useState(false);

//   const menuItems = [
//     { label: 'Dashboard', icon: <FaTachometerAlt /> },
//     { label: 'Goals', icon: <FaBullseye /> },
//     { label: 'Tasks', icon: <FaTasks /> },
//     { label: 'Investments', icon: <FaChartLine /> },
//     { label: 'Settings', icon: <FaCog /> },
//   ];

//   return (
//     <aside
//       className={`h-screen sticky top-0 bg-gray-900 text-white p-4 transition-all duration-300 ease-in-out ${
//         collapsed ? 'w-20' : 'w-64'
//       } shadow-lg flex flex-col justify-between`}
//     >
//       {/* Toggle Button */}
//       <div>
//       <button
//           onClick={() => setCollapsed(!collapsed)}
//           className="text-white mb-4 focus:outline-none flex items-center justify-start"
//         >
//           <span className="text-xl font-bold">
//             <span className="text-white">#CMD</span>
//             {!collapsed &&<span className="text-cyan-300 ml-1">A</span>}
//           </span>
//         </button>

//         {/* Navigation */}
//         <nav className="space-y-6">
//           {menuItems.map((item, index) => (
//             <div
//               key={index}
//               className="flex items-center gap-4 text-gray-300 hover:text-white transition cursor-pointer"
//             >
//               <span className="text-xl">{item.icon}</span>
//               {!collapsed && (
//                 <span className="text-md font-medium">{item.label}</span>
//               )}
//             </div>
//           ))}
//         </nav>
//       </div>

//       {/* Footer or Profile */}
//       <div className="mt-auto text-sm text-gray-500">
//         {!collapsed && <p className="text-xs">© 2025 YourApp</p>}
//       </div>
//     </aside>
//   );
// };

// export default SidebarLeft;


import { useState } from 'react';
import { FaTachometerAlt, FaBullseye, FaTasks, FaChartLine, FaCog, FaBars } from 'react-icons/fa';

const SidebarLeft = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { label: 'Dashboard', icon: <FaTachometerAlt /> },
    { label: 'Goals', icon: <FaBullseye /> },
    { label: 'Tasks', icon: <FaTasks /> },
    { label: 'Investments', icon: <FaChartLine /> },
    { label: 'Settings', icon: <FaCog /> },
  ];

  return (
    <aside className={`h-screen sticky top-0 bg-gray-900 text-white transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'} shadow-lg flex flex-col justify-between`}>
      <div className="flex justify-start p-4">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-white mb-4 focus:outline-none flex flex-col items-start justify-start"
      >
        <span className="text-xl font-bold leading-tight">
          <span className="text-white">#CMD</span>
          <span className="text-cyan-300">
            {collapsed ? <div className="block">A</div> : <span className="inline">Analytics</span>}
          </span>
        </span>
      </button>

      </div>
      <div className="flex-1 px-2 space-y-6">
        {menuItems.map((item, index) => (
          <div key={index} className="flex items-center gap-4 text-gray-300 hover:text-white transition cursor-pointer">
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span className="text-md font-medium">{item.label}</span>}
          </div>
        ))}
      </div>
      <div className="px-2 mb-4 text-xs text-gray-500">
        {!collapsed && <p>© 2025 CMD A</p>}
      </div>
    </aside>
  );
};

export default SidebarLeft;
