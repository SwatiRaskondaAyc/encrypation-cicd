// import React from "react";
// import { motion } from "framer-motion";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import {
//   RiDragMove2Line,
//   RiCalendarLine,
//   RiEdit2Line,
//   RiCheckLine,
//   RiDeleteBinLine,
//   RiFileTextLine,
//   RiUploadCloudLine
// } from "react-icons/ri";

// const PortfolioList = (props) => {
//   const {
//     savedPortfolios,
//     onDragEnd,
//     editingId,
//     setEditingId,
//     loadSavedPortfolio,
//     handleViewTrades,
//     handleAddMoreTrades,
//     isAuthenticated,
//     handleRefreshPortfolios,
//     setDeleteTarget,
//     setSavedPortfolios,
//     saveLocalPortfolios,
//     activePortfolioId, // New prop for highlighting
//   } = props;

//   const auth = typeof isAuthenticated === 'function' ? isAuthenticated() : !!isAuthenticated;

//   return (
//     <motion.section
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="flex flex-col h-full"
//     >
//       {savedPortfolios.length > 0 ? (
//         <div className="flex-1 overflow-y-auto pr-1 costume-scrollbar">
//           <DragDropContext onDragEnd={onDragEnd}>
//             <Droppable droppableId="portfolios">
//               {(provided) => (
//                 <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
//                   {savedPortfolios.map((sp, index) => {
//                     const isActive = activePortfolioId === sp.portfolioId;
//                     return (
//                       <Draggable key={sp.portfolioId} draggableId={sp.portfolioId} index={index}>
//                         {(provided, snapshot) => (
//                           <motion.div
//                             initial={{ opacity: 0, x: -10 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             whileHover={{ scale: 1.01 }}
//                             onClick={() => loadSavedPortfolio(sp)}
//                             className={`group relative bg-white dark:bg-gray-800 rounded-xl p-4 border transition-all cursor-pointer
//                               ${isActive
//                                 ? "border-blue-500 ring-1 ring-blue-500 shadow-md bg-blue-50/50 dark:bg-blue-900/20"
//                                 : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm"
//                               }
//                               ${snapshot.isDragging ? "shadow-2xl scale-105 z-50" : ""}
//                             `}
//                           >
//                             <div className="flex items-start justify-between gap-3">
//                               {/* Drag Handle */}
//                               <div
//                                 {...provided.dragHandleProps}
//                                 className="mt-1 cursor-grab text-gray-300 group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-400 transition-colors"
//                               >
//                                 <RiDragMove2Line className="w-5 h-5" />
//                               </div>

//                               {/* Content */}
//                               <div className="flex-1 min-w-0">
//                                 {editingId === sp.portfolioId ? (
//                                   <input
//                                     value={sp.portfolioName}
//                                     onChange={(e) => {
//                                       const updated = savedPortfolios.map((p) =>
//                                         p.portfolioId === sp.portfolioId ? { ...p, portfolioName: e.target.value } : p
//                                       );
//                                       setSavedPortfolios(updated);
//                                       saveLocalPortfolios(updated);
//                                     }}
//                                     onClick={(e) => e.stopPropagation()} // Prevent load on click input
//                                     className="w-full px-2 py-1 rounded border border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none"
//                                     autoFocus
//                                     onBlur={() => setEditingId(null)}
//                                     // Enter key logic if needed
//                                     onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
//                                   />
//                                 ) : (
//                                   <div className="pr-2">
//                                     <h3 className={`text-base font-semibold truncate transition-colors ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
//                                       {sp.portfolioName}
//                                     </h3>
//                                     <div className="flex items-center gap-2 mt-0.5">
//                                       <span className="text-xs px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium">
//                                         {sp.broker || "Unknown"}
//                                       </span>
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>

//                             {/* Actions Row - Visible on Hover or if Active */}
//                             <div className={`mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between gap-2 opacity-100 transition-opacity ${isActive ? 'opacity-100' : 'lg:opacity-0 lg:group-hover:opacity-100'}`}>
//                               <div className="flex items-center gap-1">
//                                 <button
//                                   onClick={(e) => { e.stopPropagation(); handleViewTrades(sp.portfolioId); }}
//                                   className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
//                                   title="View Trades"
//                                 >
//                                   <RiCalendarLine className="w-4 h-4" />
//                                 </button>
//                                 <button
//                                   onClick={(e) => { e.stopPropagation(); handleAddMoreTrades(sp); }}
//                                   className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
//                                   title="Add More Trades"
//                                 >
//                                   <RiUploadCloudLine className="w-4 h-4" />
//                                 </button>
//                               </div>

//                               <div className="flex items-center gap-1">
//                                 <button
//                                   onClick={(e) => { e.stopPropagation(); setEditingId(editingId === sp.portfolioId ? null : sp.portfolioId); }}
//                                   className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
//                                   title="Rename"
//                                 >
//                                   {editingId === sp.portfolioId ? (
//                                     <RiCheckLine className="w-4 h-4 text-green-600" />
//                                   ) : (
//                                     <RiEdit2Line className="w-4 h-4" />
//                                   )}
//                                 </button>
//                                 <button
//                                   onClick={(e) => { e.stopPropagation(); setDeleteTarget(sp.portfolioId); }}
//                                   className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
//                                   title="Delete"
//                                 >
//                                   <RiDeleteBinLine className="w-4 h-4" />
//                                 </button>
//                               </div>
//                             </div>
//                           </motion.div>
//                         )}
//                       </Draggable>
//                     );
//                   })}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           </DragDropContext>
//         </div>
//       ) : (
//         <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-white/50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
//           <RiFileTextLine className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" />
//           <p className="text-sm text-gray-500 dark:text-gray-400">No portfolios yet</p>
//           <p className="text-xs text-gray-400 mt-1">Import a file to get started</p>
//         </div>
//       )}
//     </motion.section>
//   );
// }

// export default PortfolioList;


import React from "react";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  RiDragMove2Line,
  RiCalendarLine,
  RiEdit2Line,
  RiCheckLine,
  RiDeleteBinLine,
  RiUploadCloudLine,
  RiFileTextLine,
  RiFolderOpenLine,
} from "react-icons/ri";
import { Tooltip } from "react-tooltip"; // Optional: for better tooltips

const PortfolioList = (props) => {
  const {
    savedPortfolios,
    onDragEnd,
    editingId,
    setEditingId,
    loadSavedPortfolio,
    handleViewTrades,
    handleAddMoreTrades,
    isAuthenticated,
    setDeleteTarget,
    setSavedPortfolios,
    saveLocalPortfolios,
    activePortfolioId,
  } = props;

  const auth = typeof isAuthenticated === 'function' ? isAuthenticated() : !!isAuthenticated;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full"
    >
      {savedPortfolios.length > 0 ? (
        <div className="flex-1 overflow-y-auto pr-2 pb-4 custom-scrollbar">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="portfolios">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3 pt-2"
                >
                  {savedPortfolios.map((sp, index) => {
                    const isActive = activePortfolioId === sp.portfolioId;
                    const isEditing = editingId === sp.portfolioId;

                    return (
                      <Draggable
                        key={sp.portfolioId}
                        draggableId={sp.portfolioId}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <motion.div
                            layout
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`group relative rounded-2xl overflow-hidden transition-all duration-200
                              ${snapshot.isDragging ? "rotate-3 shadow-2xl z-50" : ""}
                            `}
                          >
                            <div
                              onClick={() => !isEditing && loadSavedPortfolio(sp)}
                              className={`relative p-5 cursor-pointer transition-all
                                ${isActive
                                  ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 border-blue-400 shadow-lg ring-2 ring-blue-500/30"
                                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-md hover:shadow-xl"
                                }
                                border-2 rounded-2xl
                              `}
                            >
                              {/* Drag Handle */}
                              <div
                                {...provided.dragHandleProps}
                                className="absolute left-3 top-5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                                aria-label="Drag to reorder"
                              >
                                <RiDragMove2Line className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                              </div>

                              {/* Main Content */}
                              <div className="pl-10 pr-4">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={sp.portfolioName}
                                    onChange={(e) => {
                                      const updated = savedPortfolios.map((p) =>
                                        p.portfolioId === sp.portfolioId
                                          ? { ...p, portfolioName: e.target.value }
                                          : p
                                      );
                                      setSavedPortfolios(updated);
                                      saveLocalPortfolios(updated);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === "Escape") {
                                        setEditingId(null);
                                      }
                                    }}
                                    onBlur={() => setEditingId(null)}
                                    autoFocus
                                    className="w-full px-3 py-2 text-lg font-semibold bg-white dark:bg-gray-700 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 text-gray-900 dark:text-white"
                                  />
                                ) : (
                                  <>
                                    <h3
                                      className={`text-lg font-bold truncate pr-8 ${isActive
                                          ? "text-blue-700 dark:text-blue-300"
                                          : "text-gray-900 dark:text-white"
                                        }`}
                                    >
                                      {sp.portfolioName}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-2">
                                      <span className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
                                        {sp.broker || "Unknown Broker"}
                                      </span>
                                      {sp.tradeCount !== undefined && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {sp.tradeCount} trade{sp.tradeCount !== 1 ? "s" : ""}
                                        </span>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>

                              {/* Action Buttons - Always visible on small screens, hover on large */}
                              <div
                                className={`mt-5 flex items-center justify-between border-t border-gray-200/70 dark:border-gray-700/70 pt-4
                                  ${isActive ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100"}
                                  transition-opacity duration-200
                                `}
                              >
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewTrades(sp.portfolioId);
                                    }}
                                    className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all"
                                    aria-label="View trades"
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content="View Trades"
                                  >
                                    <RiCalendarLine className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddMoreTrades(sp);
                                    }}
                                    className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all"
                                    aria-label="Add trades"
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content="Add More Trades"
                                  >
                                    <RiUploadCloudLine className="w-5 h-5" />
                                  </button>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingId(isEditing ? null : sp.portfolioId);
                                    }}
                                    className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all"
                                    aria-label={isEditing ? "Save name" : "Rename portfolio"}
                                  >
                                    {isEditing ? (
                                      <RiCheckLine className="w-5 h-5 text-green-600" />
                                    ) : (
                                      <RiEdit2Line className="w-5 h-5" />
                                    )}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteTarget(sp.portfolioId);
                                    }}
                                    className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all"
                                    aria-label="Delete portfolio"
                                  >
                                    <RiDeleteBinLine className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700">
            <RiFolderOpenLine className="w-20 h-20 text-gray-400 dark:text-gray-600 mb-6" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No portfolios yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              Start by importing your first brokerage statement or trade history to begin tracking.
            </p>
          </div>
        </div>
      )}

      {/* Optional: Add react-tooltip for better UX */}
      {/* <Tooltip id="tooltip" place="top" delayShow={300} /> */}
    </motion.section>
  );
};

export default PortfolioList;