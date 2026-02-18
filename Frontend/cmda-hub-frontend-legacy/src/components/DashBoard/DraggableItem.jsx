// Inside SidebarRight
// import { useDraggable } from '@dnd-kit/core';

// const DraggableItem = ({ id, icon, label, collapsed }) => {
//   const { attributes, listeners, setNodeRef } = useDraggable({
//     id,
//     data: { label },
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       {...listeners}
//       {...attributes}
//       className="flex items-center gap-4 text-gray-300 hover:text-white cursor-pointer"
//     >
//       <span className="text-xl">{icon}</span>
//       {!collapsed && <span className="text-md font-medium">{label}</span>}
//     </div>
//   );
// };

// export default DraggableItem ;

// const DraggableItem = ({ label, icon: Icon, collapsed, onClick }) => {
//   return (
//     <div
//       className="flex items-center gap-4 text-gray-300 hover:text-white cursor-pointer"
//       onClick={onClick}
//     >
//       {Icon && <Icon />}
//       {!collapsed && <span>{label}</span>}
//     </div>
//   );
// };

// export default DraggableItem;


//*********************************************working code 


// import { useDraggable } from '@dnd-kit/core';

// const DraggableItem = ({ id, label, icon: IconComponent, collapsed }) => {
//   const { attributes, listeners, setNodeRef,transform } = useDraggable({
//     id,
//     data: { label },
//   });
// const style = {
//   transform: transform
//     ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
//     : undefined,
// };


//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...listeners}
//       {...attributes}
//       className="cursor-grab active:cursor-grabbing mb-4"
//     >
//       {/* {Icon && <Icon />}
//       {!collapsed && <span>{label}</span>} */}
//       <div  className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition w-20"
//         title={label}>
//           <IconComponent size={24} className="text-cyan-700"/>
//           {!collapsed && (
//             <span className='text-xs text center leading-tight'>
//               {label}
//             </span>
//           )}
//       </div>
//     </div>
//   );
// };

// export default DraggableItem;



// import { useDraggable } from '@dnd-kit/core';


// const DraggableItem = ({ id, label, icon: Icon, collapsed }) => {
//   const handleDragStart = (e) => {
//     e.dataTransfer.setData('text/plain', id);
//   };
//   const { attributes, listeners, setNodeRef,transform } = useDraggable({
//         id,
//         data: { label },
//       });
//   const style = {
//       transform: transform
//         ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
//         : undefined,
//     }

//   return (
//     <div
//     ref={setNodeRef}
//       style={style}
//       {...listeners}
//       {...attributes}
//       draggable
//       onDragStart={handleDragStart}
//       className={`flex items-center justify-center ${collapsed ? 'w-full' : 'gap-2'} 
//                   bg-slate-700 hover:bg-slate-600 rounded-md p-2 cursor-grab transition group`}
//       title={collapsed ? label : ''}
//     >
//       <Icon className="text-white text-xl" />  {label}
//       {!collapsed && (
//         <span className="text-sm text-white font-medium whitespace-nowrap">
//           {label}
//         </span>
//       )}
//     </div>
//   );
// };

// export default DraggableItem;




// import { useDraggable } from '@dnd-kit/core';

// const DraggableItem = ({ id, label, icon: Icon, collapsed }) => {
//   const handleDragStart = (e) => {
//     e.dataTransfer.setData('text/plain', id);
//   };

//   const { attributes, listeners, setNodeRef, transform } = useDraggable({
//     id,
//     data: { label },
//   });

//   const style = {
//     transform: transform
//       ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
//       : undefined,
//     transition: 'transform 0.3s ease-in-out', // Smooth transition on drag
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...listeners}
//       {...attributes}
//       draggable
//       onDragStart={handleDragStart}
//       className={`flex items-center justify-center transition-all ${
//         collapsed ? 'w-16' : 'w-full'
//       } bg-slate-700 hover:bg-slate-600 rounded-md p-2 cursor-grab group`}
//     >
//       {/* Render only icon when collapsed */}
//       <div className="flex items-center gap-2">
//         <Icon className="text-white text-xl" />
//         {label}

//         {/* Render label when sidebar is not collapsed */}
//         {/* {!collapsed && (
//           <span className="text-sm text-white font-medium whitespace-nowrap transition-all">

//           </span>
//         )} */}
//       </div>
//     </div>
//   );
// };

// export default DraggableItem;

// import { useDraggable } from '@dnd-kit/core';
// import { useEffect, useState } from 'react';

// const DraggableItem = ({ id, label, icon: Icon, collapsed }) => {
//   const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
//     id,
//     data: { label },
//   });

//   const style = {
//     transform: transform
//       ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
//       : undefined,
//     transition: isDragging ? 'none' : 'transform 0.2s ease-in-out',
//     zIndex: isDragging ? 50 : 1, // brings dragged item above others
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...listeners}
//       {...attributes}
//       className={`
//         flex items-center gap-2 p-3 rounded-xl
//         transition-all duration-200 ease-in-out
//         bg-slate-700 hover:bg-slate-600 shadow-md
//         cursor-grab active:cursor-grabbing select-none
//         ${collapsed ? 'w-14 justify-center' : 'w-full justify-start'}
//         ${isDragging ? 'scale-105 opacity-80' : ''}
//       `}
//     >
//       <Icon className="text-white text-xl" />
//       {!collapsed && (
//         <span className="text-white font-medium text-sm whitespace-nowrap">
//           {label}
//         </span>
//       )}
//     </div>
//   );
// };

// export default DraggableItem;\


// import { useDraggable } from '@dnd-kit/core';
// // import { portfolioGraphComponents } from './graphConfig';

// const DraggableItem = ({ id, label, icon: Icon, collapsed }) => {
//   const handleDragStart = (e) => {
//     e.dataTransfer.setData('text/plain', id);
//   };

//   const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
//     id,
//     data: { label },
//   });

//   const style = {
//     transform: transform
//       ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
//       : undefined,
//     transition: isDragging ? 'none' : 'transform 0.25s ease-in-out',
//     zIndex: isDragging ? 1 : 50,
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...listeners}
//       {...attributes}
//       draggable
//       onDragStart={handleDragStart}
//       className={`
//         flex items-center gap-3 p-3 rounded-lg
//         transition-all duration-200 ease-in-out
//         bg-slate-700 hover:bg-slate-600 shadow
//         cursor-grab active:cursor-grabbing select-none
//         ${collapsed ? 'w-14 justify-center' : 'w-full justify-start'}
//         ${isDragging ? 'scale-105 opacity-90' : ''}
//       `}
//     >
//       <Icon className="text-white text-xl" />
//       {label}
//       {!collapsed && (
//         <span className="text-white font-medium text-sm whitespace-nowrap">

//         </span>
//       )}
//     </div>
//   );
// };

// export default DraggableItem;


// DraggableItem.jsx
// import React from 'react';
// import { useDraggable } from '@dnd-kit/core';
// import { ComponentRegistry } from './ComponentRegistry'; // adjust path as needed

// const DraggableItem = ({ id, componentKey }) => {
//   const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

//   const Component = ComponentRegistry[componentKey];

//   const style = {
//     transform: transform
//       ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
//       : undefined,
//     padding: '8px',
//     border: '1px solid #ccc',
//     marginBottom: '8px',
//     backgroundColor: '#fff',
//     cursor: 'grab',
//   };

//   if (!Component) {
//     return <div style={style}>Error: Component "{componentKey}" not found</div>;
//   }

//   return (
//     <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
//       <Component />
//     </div>
//   );
// };

// export default DraggableItem;









//+++++++++++++++working for eq+++++++++++++++++++
// ✅ DraggableItem.jsx
// import React from 'react';
// import { useDraggable } from '@dnd-kit/core';

// const DraggableItem = ({ id, label, icon: Icon, collapsed }) => {
//   const { attributes, listeners, setNodeRef, transform } = useDraggable({
//     id,
//     data: { label },
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       {...listeners}
//       {...attributes}
//       style={{
//         transform: transform
//           ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
//           : undefined,
//       }}
//       className="cursor-grab rounded-md hover:text-black bg-cyan-700 hover:bg-cyan-500 hover:text-black p-2 text-white text-xs text-center font-sm w-full transition"
//     >
//      <div className="flex flex-col items-center space-y-1">
//    {collapsed ? (
//       <span className="text-xs text-center leading-tight">
//         {label}
//       </span>
//     ) : (
//       <>
//         <Icon size={20} className="text-white" />
//         <span className="text-lg  text-center leading-tight">
//           {label}
//         </span>
//       </>
//     )}
//   </div>
//   </div>
//   );
// };

// export default DraggableItem;










// import React from 'react';
// import { useDraggable } from '@dnd-kit/core';

// const DraggableItem = ({ id, label, icon, collapsed }) => {
//   const { attributes, listeners, setNodeRef, transform } = useDraggable({
//     id,
//     data: { label },
//   });

//   const style = {
//     transform: transform
//       ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
//       : undefined,
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       {...listeners}
//       {...attributes}
//       style={style}
//       className="cursor-grab  text-white transition-all duration-200 p-2  w-full"
//     >
//       <div className="flex flex-col items-center space-y-2">
//         <div
//           className={` p-2 ${collapsed ? '' : 'w-full'} transition`}
//         >

//           <img src={icon} alt='img'  size={collapsed ? 0 : 24} className="text-white w-24 h-12" />
//         </div>

//         <span
//           className={`text-center font-medium ${
//             collapsed ? 'text-xs leading-tight' : 'text-sm'
//           }`}
//         >
//           {label}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default DraggableItem;



// import { useDraggable } from '@dnd-kit/core';

// const DraggableItem = ({ id, label, icon, collapsed }) => {
//   const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
//     id,
//     data: { label },
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       {...listeners}
//       {...attributes}
//       className={`flex flex-col items-center space-y-2 gap-2 xs:gap-3 text-gray-300 hover:text-white transition p-2 xs:p-3 rounded-lg
//         ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'} cursor-grab active:cursor-grabbing touch-none
//         ${collapsed ? 'justify-center' : 'justify-start'}`}
//     >
//       {typeof icon === 'string' ? (
//         <img
//           src={icon}
//           alt={label}
//           className={`w-24 h-12 xs:w-8 xs:h-8 object-contain ${collapsed ? 'w-8 h-8' : ''}`}
//         />
//       ) : (
//         // <span className="text-lg xs:text-xl">{icon}</span>

//          <span
//            className={`text-center font-medium ${
//             collapsed ? 'text-xs leading-tight' : 'text-sm'
//           }`}
//          >
//            {label}
//         </span>
//       )}
//       {!collapsed && <span className="text-xs xs:text-sm font-medium truncate">{label}</span>}
//     </div>
//   );
// };

// export default DraggableItem;





// import { useDraggable } from '@dnd-kit/core';

// const DraggableItem = ({ id, label, icon, collapsed }) => {
//   const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
//     id,
//     data: { label },
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       {...listeners}
//       {...attributes}
//       className={`flex flex-col items-center space-y-1 text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-lg
//         ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'} cursor-grab active:cursor-grabbing touch-none
//         ${collapsed ? 'justify-center' : 'justify-start'}`}
//     >
//       {typeof icon === 'string' ? (
//         <>
//           <img
//             src={icon}
//             alt={label}
//             className={`w-12 h-12 object-contain ${collapsed ? 'w-8 h-8' : 'xs:w-14 xs:h-14'}`}
//           />
//           {!collapsed && (
//             <span className="text-xs font-medium truncate text-gray-200 mt-1">{label}</span>
//           )}
//         </>
//       ) : (
//         <span className={`text-center font-medium ${collapsed ? 'text-xs' : 'text-sm'}`}>
//           {label}
//         </span>
//       )}
//     </div>
//   );
// };

// export default DraggableItem;



import { useDraggable } from '@dnd-kit/core';

const DraggableItem = ({ id, label, icon, collapsed }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { label },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex flex-col items-center space-y-1 text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-lg
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'} cursor-grab active:cursor-grabbing touch-none
        ${collapsed ? 'justify-center' : 'justify-start'}`}
    >
      {typeof icon === 'string' ? (
        <>
          <img
            src={icon}
            alt={label}
            className={`w-full h-auto ${collapsed ? 'w-8 h-8 ' : 'xs:w-14 xs:h-14'}`}
          />
          {!collapsed && (
            <span className="text-sm font-medium truncate text-gray-900 mt-1 dark:text-gray-300 ">{label}</span>
          )} 
        </>
      ) : (
        <span className={`text-center font-medium ${collapsed ? 'text-xs' : 'text-sm'}`}>
          {label}
        </span>
      )}
    </div>
  );
};

export default DraggableItem;

