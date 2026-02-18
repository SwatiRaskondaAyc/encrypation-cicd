// import React from 'react';
// import Modal from 'react-modal';

// const PortfolioSelectModal = ({ isOpen, onClose, portfolios, onSelectPortfolio, error }) => {
//   const handleSelect = (e) => {
//     const selectedPortfolio = portfolios.find(p => p.uploadId === e.target.value);
//     if (selectedPortfolio) {
//       onSelectPortfolio(selectedPortfolio);
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       className="fixed inset-0 flex items-center justify-center z-50"
//       overlayClassName="fixed inset-0 bg-black bg-opacity-50"
//       contentLabel="Select Portfolio Modal"
//     >
//       <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
//           Select a Portfolio
//         </h2>
//         <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
//           Please select a portfolio to associate with this graph.
//         </p>
//         <div className="w-full">
//           <select
//             onChange={handleSelect}
//             className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#1a2336] text-sm text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none"
//           >
//             <option value="">Select a portfolio...</option>
//             {portfolios.map((portfolio) => (
//               <option key={portfolio.uploadId} value={portfolio.uploadId}>
//                 {portfolio.PortfolioName} ({portfolio.platform})
//               </option>
//             ))}
//           </select>
//           <div className="h-5 mt-1">
//             {error && (
//               <p className="text-sm text-blue-700">{error}</p>
//             )}
//           </div>
//         </div>
//         <div className="mt-6 flex justify-end gap-2">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default PortfolioSelectModal;













// import React, { useState } from 'react';
// import Modal from 'react-modal';

// const PortfolioSelectModal = ({ isOpen, onClose, portfolios, onSelectPortfolio, error }) => {
//   const [uploadId, setUploadId] = useState('');

//   const handleSelect = (e) => {
//     const selectedValue = e.target.value;
//     setUploadId(selectedValue);
//     const selectedPortfolio = portfolios.find(p => p.uploadId.toString() === selectedValue);
//     if (selectedPortfolio) {
//       onSelectPortfolio(selectedPortfolio);
//       localStorage.setItem("uploadId", selectedPortfolio.uploadId.toString()); // Update localStorage
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       className="fixed inset-0 flex items-center justify-center z-50"
//       overlayClassName="fixed inset-0 bg-black bg-opacity-50"
//       contentLabel="Select Portfolio Modal"
//     >
//       <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
//           Select a Portfolio
//         </h2>
//         <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
//           Please select a portfolio to associate with this graph.
//         </p>
//         <div className="w-full">
//           <select
//             onChange={handleSelect}
//             value={uploadId}
//             className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#1a2336] text-sm text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none"
//           >
//             <option value="">Select a portfolio...</option>
//             {portfolios.map((portfolio) => (
//               <option key={portfolio.uploadId} value={portfolio.uploadId.toString()}>
//                 {portfolio.PortfolioName} ({portfolio.platform})
//               </option>
//             ))}
//           </select>
//           <div className="h-5 mt-1">
//             {error && (
//               <p className="text-sm text-blue-700">{error}</p>
//             )}
//           </div>
//         </div>
//         <div className="mt-6 flex justify-end gap-2">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default PortfolioSelectModal;





// import React, { useState , useEffect } from 'react';
// import Modal from 'react-modal';

// const PortfolioSelectModal = ({ isOpen, onClose, portfolios, onSelectPortfolio, error }) => {
//   const [uploadId, setUploadId] = useState('');

//  // Reset uploadId when modal opens or closes
//   useEffect(() => {
//     if (isOpen) {
//       setUploadId(''); // Reset to empty string when modal opens
//     }
//   }, [isOpen]);
//  const handleSelect = (e) => {
//     const selectedValue = e.target.value;
//     if (selectedValue) {
//       setUploadId(selectedValue);
//       const selectedPortfolio = portfolios.find(p => p.uploadId.toString() === selectedValue);
//       if (selectedPortfolio) {
//         onSelectPortfolio(selectedPortfolio);
//         localStorage.setItem("uploadId", selectedPortfolio.uploadId.toString());
//       }
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       className="fixed inset-0 flex items-center justify-center z-50"
//       overlayClassName="fixed inset-0 bg-black bg-opacity-50"
//       contentLabel="Select Portfolio Modal"
//     >
//       <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
//           Select a Portfolio
//         </h2>
//         <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
//           Please select a portfolio to associate with this graph.
//         </p>
//         <div className="w-full">
//           <select
//             onChange={handleSelect}
//             value={uploadId}
//             className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#1a2336] text-sm text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none"
//           >
//             <option value="">Select a portfolio...</option>
//             {portfolios.map((portfolio) => (
//               <option key={portfolio.uploadId} value={portfolio.uploadId.toString()}>
//                 {portfolio.PortfolioName} ({portfolio.platform})
//               </option>
//             ))}
//           </select>
//           <div className="h-5 mt-1">
//             {error && (
//               <p className="text-sm text-blue-700">{error}</p>
//             )}
//           </div>
//         </div>
//         <div className="mt-6 flex justify-end gap-2">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default PortfolioSelectModal;





import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const PortfolioSelectModal = ({ isOpen, onClose, portfolios, onSelectPortfolio, error }) => {
  const [uploadId, setUploadId] = useState('');

  // Reset uploadId when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setUploadId(''); // Reset to empty string when modal opens
    }
  }, [isOpen]);

  const handleSelect = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue) {
      setUploadId(selectedValue);
      const selectedPortfolio = portfolios.find(p => p.uploadId.toString() === selectedValue);
      if (selectedPortfolio) {
        onSelectPortfolio(selectedPortfolio);
        localStorage.setItem("uploadId", selectedPortfolio.uploadId.toString());
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      contentLabel="Select Portfolio Modal"
    >
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
          Select a Portfolio
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Please select a portfolio to associate with this graph.
        </p>
        <div className="w-full">
          <select
            onChange={handleSelect}
            value={uploadId}
            className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#1a2336] text-sm text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none"
          >
            <option value="">Select a portfolio...</option>
            {portfolios.map((portfolio) => (
              <option key={portfolio.uploadId} value={portfolio.uploadId.toString()}>
                {portfolio.PortfolioName} ({portfolio.platform})
              </option>
            ))}
          </select>
          <div className="h-5 mt-1">
            {error && (
              <p className="text-sm text-blue-700">{error}</p>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PortfolioSelectModal;