import React, { useState, useEffect, useCallback } from "react";
import { Star, GripVertical, Settings } from "lucide-react";

const STORAGE_KEY = "favoritesToolbarPosition";

const FavoritesToolbar = ({
  favorites,
  onSelect,
  activeToolId,
  onOpenToolSettings,
}) => {
  // Draggable position state with localStorage persistence
  const [position, setPosition] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { x: null, y: 10 }; // null x = centered
    } catch {
      return { x: null, y: 10 };
    }
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Persist position
  useEffect(() => {
    if (!isDragging && position.x !== null) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
      } catch (e) {
        console.warn("Failed to save toolbar position:", e);
      }
    }
  }, [position, isDragging]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    const toolbar = e.currentTarget.parentElement;
    const parent = toolbar.parentElement;
    if (!parent) return;

    const toolbarRect = toolbar.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - toolbarRect.left,
      y: e.clientY - toolbarRect.top,
      parentLeft: parentRect.left,
      parentTop: parentRect.top,
      parentWidth: parentRect.width,
      parentHeight: parentRect.height,
      toolbarWidth: toolbarRect.width,
      toolbarHeight: toolbarRect.height,
    });
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;

      let x = e.clientX - dragOffset.parentLeft - dragOffset.x;
      let y = e.clientY - dragOffset.parentTop - dragOffset.y;

      // Keep within parent bounds
      x = Math.max(
        0,
        Math.min(x, dragOffset.parentWidth - dragOffset.toolbarWidth),
      );
      y = Math.max(
        0,
        Math.min(y, dragOffset.parentHeight - dragOffset.toolbarHeight),
      );

      setPosition({ x, y });
    },
    [isDragging, dragOffset],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (favorites.length === 0) return null;

  const tools = favorites.filter((f) => f.type === "tool");
  const indicators = favorites.filter((f) => f.type === "indicator");
  const patterns = favorites.filter((f) => f.type === "pattern");

  const renderButton = (item, isText = false) => {
    const isActive = activeToolId === item.id || activeToolId === item.payload;
    const Icon = item.icon;

    const renderBadge = () => {
      const text =
        item.subtitle ||
        (item.label ? item.label.substring(0, 2).toUpperCase() : "??");

      let badgeClass = "bg-gray-100 text-gray-500";

      if (item.type === "pattern") {
        if (item.bias === "bullish") badgeClass = "bg-green-100 text-green-700";
        else if (item.bias === "bearish")
          badgeClass = "bg-red-100 text-red-700";
        else if (item.bias === "neutral")
          badgeClass = "bg-purple-100 text-purple-700";
      } else if (item.type === "indicator") {
        badgeClass = "bg-blue-100 text-blue-700";
      }

      return (
        <div
          className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${badgeClass}`}
        >
          {text}
        </div>
      );
    };

    return (
      <div key={item.id} className="relative group flex items-center">
        <button
          onClick={() => onSelect(item)}
          className={`
            flex items-center justify-center rounded-md transition-colors 
            ${isText ? "px-1 h-8 min-w-[32px]" : "w-8 h-8"}
            ${isActive ? "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200" : "hover:bg-slate-100 text-slate-600"}
          `}
          title={item.label}
        >
          {isText ? (
            renderBadge()
          ) : Icon && typeof Icon !== "string" ? (
            <Icon className="w-4 h-4" />
          ) : (
            <span className="text-xs">?</span>
          )}
        </button>
      </div>
    );
  };

  // Position style - centered if x is null, otherwise absolute
  const positionStyle =
    position.x !== null
      ? {
          position: "absolute",
          left: position.x,
          top: position.y,
          transform: "none",
        }
      : {
          position: "absolute",
          left: "50%",
          top: position.y,
          transform: "translateX(-50%)",
        };

  return (
    <div
      className={`z-50 bg-white shadow-lg border border-slate-200 rounded-xl flex flex-row items-center px-2 py-1.5 gap-2 ${
        isDragging
          ? "transition-none cursor-grabbing shadow-xl"
          : "transition-all duration-300"
      }`}
      style={{ ...positionStyle, pointerEvents: "auto" }}
    >
      {/* Drag Handle */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-center w-5 h-8 cursor-grab hover:bg-slate-100 rounded transition-colors shrink-0"
        title="Drag to move"
      >
        <GripVertical className="w-3 h-3 text-slate-400" />
      </div>

      <div className="w-px h-5 bg-slate-200 shrink-0" />

      {/* Scrollable Content Area */}
      <div
        className={`flex items-center gap-2 overflow-x-auto no-scrollbar ${
          favorites.length > 14 ? "max-w-[500px]" : ""
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onWheel={(e) => {
          if (e.deltaY !== 0) {
            e.currentTarget.scrollLeft += e.deltaY;
          }
        }}
      >
        {/* Tools Section */}
        {tools.length > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            {tools.map((item) => renderButton(item, false))}
          </div>
        )}

        {/* Divider */}
        {tools.length > 0 && (indicators.length > 0 || patterns.length > 0) && (
          <div className="w-px h-5 bg-slate-200 mx-1 shrink-0" />
        )}

        {/* Indicators Section */}
        {indicators.length > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            {indicators.map((item) => renderButton(item, true))}
          </div>
        )}

        {/* Divider */}
        {(tools.length > 0 || indicators.length > 0) && patterns.length > 0 && (
          <div className="w-px h-5 bg-slate-200 mx-1 shrink-0" />
        )}

        {/* Patterns Section */}
        {patterns.length > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            {patterns.map((item) => renderButton(item, true))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesToolbar;
