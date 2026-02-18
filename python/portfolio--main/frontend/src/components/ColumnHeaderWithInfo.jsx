import React, { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";

/**
 * Robust tooltip component that prevents cutoff by smart positioning
 * Uses fixed positioning and boundary detection with smooth fade animation
 */
const ColumnHeaderWithInfo = ({ label, description, right = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    if (isHovered && headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      const tooltipWidth = 320; // Increased width to prevent text cutoff
      const tooltipHeight = 180; // Approximate

      // Calculate horizontal position
      let left = rect.left + rect.width / 2 - tooltipWidth / 2;

      // Check right boundary
      if (left + tooltipWidth > window.innerWidth - 20) {
        left = window.innerWidth - tooltipWidth - 20;
      }

      // Check left boundary
      if (left < 20) {
        left = 20;
      }

      // Calculate vertical position (below the header)
      let top = rect.bottom + 10;

      // If not enough space below, show above
      if (top + tooltipHeight > window.innerHeight - 20) {
        top = rect.top - tooltipHeight - 10;
      }

      setTooltipPos({ top, left });
      // Delay visibility slightly for smooth fade-in
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isHovered]);

  return (
    <>
      <div
        ref={headerRef}
        className={`flex items-center gap-1 group relative cursor-help ${
          right ? "justify-end" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {label}
        <HelpCircle
          size={13}
          className="text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0"
        />
      </div>

      {isHovered && (
        <>
          <div
            className="fixed z-[9999] max-w-sm p-4 bg-gray-900 text-white rounded-lg shadow-2xl text-xs leading-relaxed pointer-events-none transition-opacity duration-200"
            style={{
              top: `${tooltipPos.top}px`,
              left: `${tooltipPos.left}px`,
              width: "320px",
              opacity: isVisible ? 1 : 0,
            }}
          >
            <div className="font-bold text-blue-200 mb-1.5 text-sm break-words">
              {label}
            </div>
            <div className="text-gray-100 break-words">{description}</div>
            {/* Arrow indicator */}
            <div className="absolute w-3 h-3 bg-gray-900 transform rotate-45 -top-1.5 left-1/2 -translate-x-1/2" />
          </div>
        </>
      )}
    </>
  );
};

export default ColumnHeaderWithInfo;
