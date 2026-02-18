
import React from 'react'
import Modal from 'react-modal';

const DragStartModal = ({ isOpen, onClose, onSearch, searchTerm, setSearchTerm, searchedStocks, onSelectItem, onClear, selectedCompany,error }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      contentLabel="Search Company Modal"
    >
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
          {selectedCompany ? 'Change Company Selection' : 'Search for a Company'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {selectedCompany ? 'Search and select a new company to update your dashboard.' : 'Please search and select a company before dragging components to the dashboard.'}
        </p>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search NSE stock..."
            className="px-3 py-2 rounded-full w-full bg-gray-100 dark:bg-[#1a2336] text-sm text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={onSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-full text-white bg-black hover:bg-cyan-700 text-sm transition"
          >
            Search
          </button>
        </div>
           <div className="h-5 mt-1">
    {error && (
      <p className="text-sm text-blue-700">{error}</p>
    )}
  </div>
  
        {searchedStocks.length > 0 && (
          <div className="mt-4 max-h-60 overflow-y-auto bg-gray-100 dark:bg-[#1a2336] border border-gray-300 dark:border-gray-600 rounded shadow">
            {searchedStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer"
                onClick={() => onSelectItem(stock)}
              >
                <span className="text-sm text-gray-800 dark:text-white">{stock.companyName} ({stock.symbol})</span>
              </div>
            ))}
            <button
              onClick={onClear}
              className="w-full text-center py-2 text-red-500 hover:text-red-700 text-sm"
            >
              Clear
            </button>
          </div>
        )}
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

export default DragStartModal
