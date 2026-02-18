import React from 'react';

export default function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="flex space-x-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-4 py-2 rounded-md text-sm font-medium 
            ${
              value === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
