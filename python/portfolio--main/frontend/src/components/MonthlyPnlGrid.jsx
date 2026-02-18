import React, { useState } from 'react';

const MonthlyPnlGrid = ({ data }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const values = data?.map((d) => d.value) || [];
  const maxAbs = Math.max(...values.map((v) => Math.abs(v)), 1); // Avoid division by zero

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-3">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase">Monthly P&L</h3>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {data.map((m, idx) => (
          <div
            key={m.key}
            className={`relative rounded-md cursor-pointer transition-all duration-150 border
                       ${m.value === 0 ? 'bg-gray-50 border-gray-200' : getPnlColorClass(m.value, maxAbs)}
                       hover:scale-110 hover:shadow-md hover:z-10`}
            style={{ aspectRatio: '1/1', minHeight: '40px' }} // Smaller cubes
            onMouseEnter={() => setHoverIndex(idx)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <span className="absolute top-1 left-1.5 text-[9px] font-bold text-white/50">{m.label}</span>
            {hoverIndex === idx && (
              <div className="absolute z-20 -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-gray-900 text-xs text-white rounded-lg px-3 py-1.5 shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                <div className="font-bold text-blue-300">{m.label} '{String(m.year).slice(-2)}</div>
                <div className={`font-mono text-sm ${m.value >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {m.value >= 0 ? '+' : ''}₹{m.value.toFixed(0)}
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

function getPnlColorClass(value, maxAbs) {
  const ratio = Math.min(Math.abs(value) / maxAbs, 1);
  if (value > 0) { // Profit: dark pastel green/emerald
    if (ratio < 0.2) return 'bg-emerald-100 border-emerald-200/50';
    if (ratio < 0.4) return 'bg-emerald-200 border-emerald-300/50';
    if (ratio < 0.6) return 'bg-emerald-300 border-emerald-400/50';
    if (ratio < 0.8) return 'bg-emerald-400 border-emerald-500/50';
    return 'bg-emerald-500 border-emerald-600/50';
  } else { // Loss: dark pastel pink/rose
    if (ratio < 0.2) return 'bg-rose-100 border-rose-200/50';
    if (ratio < 0.4) return 'bg-rose-200 border-rose-300/50';
    if (ratio < 0.6) return 'bg-rose-300 border-rose-400/50';
    if (ratio < 0.8) return 'bg-rose-400 border-rose-500/50';
    return 'bg-rose-500 border-rose-600/50';
  }
}

export default MonthlyPnlGrid;
