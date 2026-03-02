"use client";

import { useRef, useCallback } from "react";

interface UseDraggableOptions {
  initialPosition: { x: number; y: number };
  onDrag: (position: { x: number; y: number }) => void;
  enabled: boolean;
}

export function useDraggable({ initialPosition, onDrag, enabled }: UseDraggableOptions) {
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startPosX: initialPosition.x,
    startPosY: initialPosition.y,
  });

  // Keep the initial position ref up to date
  dragState.current.startPosX = initialPosition.x;
  dragState.current.startPosY = initialPosition.y;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.current.isDragging) return;

      const deltaX = e.clientX - dragState.current.startX;
      const deltaY = e.clientY - dragState.current.startY;

      const newX = Math.max(0, dragState.current.startPosX + deltaX);
      const newY = Math.max(0, dragState.current.startPosY + deltaY);

      onDrag({ x: newX, y: newY });
    },
    [onDrag]
  );

  const handleMouseUp = useCallback(() => {
    dragState.current.isDragging = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) return;

      // Prevent dragging from buttons
      if ((e.target as HTMLElement).closest("button")) return;

      e.preventDefault();

      dragState.current.isDragging = true;
      dragState.current.startX = e.clientX;
      dragState.current.startY = e.clientY;
      dragState.current.startPosX = initialPosition.x;
      dragState.current.startPosY = initialPosition.y;

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [enabled, initialPosition.x, initialPosition.y, handleMouseMove, handleMouseUp]
  );

  return { handleMouseDown };
}
