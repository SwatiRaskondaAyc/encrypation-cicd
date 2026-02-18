import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "chartToolboxPosition";

const DEFAULT_POSITION = { x: 20, y: 100 };

/**
 * Hook for managing draggable toolbox position with persistence
 */
export function useToolboxPosition() {
  const [position, setPosition] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_POSITION;
    } catch {
      return DEFAULT_POSITION;
    }
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Persist position to localStorage
  useEffect(() => {
    if (!isDragging) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
      } catch (e) {
        console.warn("Failed to save toolbox position:", e);
      }
    }
  }, [position, isDragging]);

  const startDrag = useCallback((e, currentPosition) => {
    e.preventDefault();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y,
    });
  }, []);

  const onDrag = useCallback(
    (e) => {
      if (!isDragging) return;
      setPosition({
        x: Math.max(0, e.clientX - dragOffset.x),
        y: Math.max(0, e.clientY - dragOffset.y),
      });
    },
    [isDragging, dragOffset],
  );

  const endDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetPosition = useCallback(() => {
    setPosition(DEFAULT_POSITION);
  }, []);

  return {
    position,
    isDragging,
    startDrag,
    onDrag,
    endDrag,
    resetPosition,
  };
}

export default useToolboxPosition;
