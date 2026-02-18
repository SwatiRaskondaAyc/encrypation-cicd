import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const RadialMenu = ({ isOpen, onClose, position, items = [], onSelect }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!isOpen) return null;

  // Configuration
  const OUTER_RADIUS = 120;
  const INNER_RADIUS = 40;
  const ICON_RADIUS = (OUTER_RADIUS + INNER_RADIUS) / 2;

  // If we have many items, we might want to paginate, but for <12 we can just slice them
  // For the prompt's requirement, we'll slice to 12 max for now to keep the wheel usable
  const displayItems = items.slice(0, 12);
  const count = displayItems.length;
  const angleStep = 360 / count;

  // Helper to calculate coordinates
  const getCoords = (radius, angleDeg) => {
    const angleRad = (angleDeg - 90) * (Math.PI / 180); // -90 to start at top
    return {
      x: radius * Math.cos(angleRad),
      y: radius * Math.sin(angleRad),
    };
  };

  const createWedge = (index, item) => {
    const startAngle = index * angleStep;
    const endAngle = (index + 1) * angleStep;

    // SVG Path for Annular Sector
    // We need 4 points:
    // 1. Outer Start
    // 2. Outer End
    // 3. Inner End
    // 4. Inner Start

    const p1 = getCoords(OUTER_RADIUS, startAngle);
    const p2 = getCoords(OUTER_RADIUS, endAngle);
    const p3 = getCoords(INNER_RADIUS, endAngle);
    const p4 = getCoords(INNER_RADIUS, startAngle);

    const largeArc = angleStep > 180 ? 1 : 0;

    const d = [
      `M ${p1.x} ${p1.y}`,
      `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
      `L ${p3.x} ${p3.y}`,
      `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
      "Z",
    ].join(" ");

    // Icon Position (Center of wedge)
    const midAngle = startAngle + angleStep / 2;
    const iconPos = getCoords(ICON_RADIUS, midAngle);

    // Correct rotation for text/icon so it's upright?
    // Usually easier to just place it at x,y.

    const isHovered = hoveredIndex === index;

    return (
      <g
        key={item.id}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item);
          onClose(); // Auto close on select? Usually context menus do.
        }}
        className="cursor-pointer transition-all duration-200"
        style={{ transformOrigin: "0 0" }}
      >
        <path
          d={d}
          fill={
            isHovered ? "rgba(255, 255, 255, 0.9)" : "rgba(30, 41, 59, 0.8)"
          }
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
          className="transition-colors duration-200 backdrop-blur-md"
        />

        {/* Icon / Label Container */}
        <foreignObject
          x={iconPos.x - 20}
          y={iconPos.y - 20}
          width="40"
          height="40"
          className="pointer-events-none"
        >
          <div
            className={`w-full h-full flex items-center justify-center transition-colors duration-200 ${isHovered ? "text-slate-900" : "text-white"}`}
          >
            {(() => {
              if (item.type === "pattern" || item.type === "indicator") {
                const text =
                  item.subtitle ||
                  (item.label
                    ? item.label.substring(0, 2).toUpperCase()
                    : "??");
                let badgeClass = "bg-gray-100 text-gray-500";
                if (item.type === "pattern") {
                  if (item.bias === "bullish")
                    badgeClass = "bg-green-100 text-green-700";
                  else if (item.bias === "bearish")
                    badgeClass = "bg-red-100 text-red-700";
                  else if (item.bias === "neutral")
                    badgeClass = "bg-purple-100 text-purple-700";
                } else {
                  badgeClass = "bg-blue-100 text-blue-700";
                }
                return (
                  <div
                    className={`w-7 h-6 rounded flex items-center justify-center text-[9px] font-bold shadow-sm ${badgeClass}`}
                  >
                    {text}
                  </div>
                );
              }
              const Icon = item.icon;
              return Icon ? (
                <Icon size={20} />
              ) : (
                <span className="text-[10px] font-bold text-center leading-tight">
                  {item.label}
                </span>
              );
            })()}
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      onClick={onClose}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Positioning Container */}
      <div
        className="absolute drop-shadow-2xl"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)", // Center the wheel on the cursor
        }}
      >
        <svg
          width={OUTER_RADIUS * 2 + 10}
          height={OUTER_RADIUS * 2 + 10}
          viewBox={`-${OUTER_RADIUS + 5} -${OUTER_RADIUS + 5} ${OUTER_RADIUS * 2 + 10} ${OUTER_RADIUS * 2 + 10}`}
          className="overflow-visible"
        >
          {/* Center Circle (Close Button) */}
          <circle
            r={INNER_RADIUS - 2}
            fill="rgba(255, 255, 255, 0.95)"
            className="cursor-pointer hover:fill-red-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />

          {/* Close Icon in Center */}
          <foreignObject
            x={-12}
            y={-12}
            width="24"
            height="24"
            className="pointer-events-none"
          >
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <X size={20} />
            </div>
          </foreignObject>

          {/* Wedges */}
          {displayItems.map((item, i) => createWedge(i, item))}
        </svg>

        {/* Tooltip for the hovered item (Centralized or external?) */}
        {hoveredIndex !== null && displayItems[hoveredIndex] && (
          <div className="absolute left-1/2 top-[105%] -translate-x-1/2 mt-4 px-3 py-1 bg-slate-800 text-white text-xs rounded-full whitespace-nowrap pointer-events-none shadow-lg">
            {displayItems[hoveredIndex].label}
          </div>
        )}
      </div>
    </div>
  );
};

export default RadialMenu;
