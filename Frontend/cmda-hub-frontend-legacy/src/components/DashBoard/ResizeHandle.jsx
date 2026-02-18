import React from 'react'

const ResizeHandle = ({ direction = 'horizontal' }) => (
  <div
    className={`
      relative group transition-all duration-200
      ${direction === 'horizontal' ? 'w-2 h-full mx-1' : 'h-2 w-full my-1'}
    `}
  >
    <div
      className={`
        absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10
        rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200
      `}
    />
    <div
      className={`
        absolute inset-0 flex items-center justify-center
        ${direction === 'horizontal' ? 'flex-col' : 'flex-row'}
      `}
    >
      <div
        className={`
          bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full
          transition-all duration-200 group-hover:scale-110
          ${direction === 'horizontal' ? 'w-1 h-8' : 'h-1 w-8'}
        `}
      />
    </div>
  </div>
);

export default ResizeHandle
