// import { useDroppable } from '@dnd-kit/core'


// const DroppableSection = ({id,children}) => {
//     const {setNodeRef,isOver}=useDroppable({id});

//   return (
//     <div 
//         ref={setNodeRef}
//         className={`min-h-[200px] p-4 rounded-lg border-2 transition-colors ${
//             isOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
//           }`}
//     >
//         <h3 className="text-md font-bold mb-2 capitalize">{id.replace('-', ' ')}</h3>
//       {children}


//     </div>
//   )
// }

// export default DroppableSection

// import { useDroppable } from '@dnd-kit/core'
// import { motion } from 'framer-motion';

// const DroppableArea = ({ id, children }) => {
//   const { setNodeRef, isOver } = useDroppable({ id });
//   return (
//     <motion.div
//       ref={setNodeRef}
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className={`p-8 rounded-3xl border border-dashed transition-all w-full h-full shadow-lg backdrop-blur-lg 
//         ${isOver ? 'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-slate-700 dark:to-slate-800' : 'bg-white dark:bg-[#0f172a]'} 
//         border-gray-300 dark:border-slate-600`}
//     >
//       {children}
//     </motion.div>
//   );
// };
// export default DroppableArea


// import { useDroppable } from '@dnd-kit/core';
// import { motion } from 'framer-motion';

// const DroppableArea = ({ id, children, droppedItems = [] }) => {
//   const { setNodeRef, isOver } = useDroppable({ id });

//   // Calculate dynamic minimum height based on number of dropped items
//   const itemsPerRow = 2;
//   const rows = Math.ceil(droppedItems.length / itemsPerRow);
//       const minHeight = (count) => {
//   if (count <= 2) return "min-h-[800px]";
//   if (count <= 4) return "min-h-[1600px]";
//   if (count <= 6) return "min-h-[2400px]";
//   return `min-h-[${count * 400}px]`; // scale automatically
// };

//   return (
//     <motion.div
//       ref={setNodeRef}
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       style={{ minHeight: `${minHeight}px` }} // Dynamic min-height
//       className={`p-8 rounded-3xl border border-dashed transition-all w-full shadow-lg backdrop-blur-lg 
//         ${isOver ? 'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-slate-700 dark:to-slate-800' : 'bg-white dark:bg-[#0f172a]'} 
//         border-gray-300 dark:border-slate-600`}
//     >
//       {children}
//     </motion.div>
//   );
// };

// export default DroppableArea;



import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';

const DroppableArea = ({ id, children, droppedItems = [] }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  // Calculate dynamic minimum height based on number of dropped items
  const itemsPerRow = 2;
  const rows = Math.ceil(droppedItems.length / itemsPerRow);
  const minHeight = rows * 800; // 400px per row, matching fixed plot height

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      
      transition={{ duration: 0.3 }}
      style={{ minHeight: `${minHeight}px` }} // Dynamic min-height
      className={`p-8 rounded-3xl border border-dashed transition-all w-full shadow-lg backdrop-blur-lg 
        ${isOver ? 'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-slate-700 dark:to-slate-800' : 'bg-white dark:bg-[#0f172a]'} 
        border-gray-300 dark:border-slate-600`}
    >
      {children}
    </motion.div>
  );
};

export default DroppableArea;