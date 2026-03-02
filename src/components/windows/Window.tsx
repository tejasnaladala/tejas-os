"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WindowId } from "@/types";
import { useWindowStore } from "@/stores/windowStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useDraggable } from "@/hooks/useDraggable";
import { BREAKPOINTS, WINDOW_CONFIG } from "@/lib/constants";
import TitleBar from "./TitleBar";

const TASKBAR_HEIGHT = 48;

interface WindowProps {
  windowId: WindowId;
  children: React.ReactNode;
}

export default function Window({ windowId, children }: WindowProps) {
  const windowState = useWindowStore((s) => s.getWindow(windowId));
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const updatePosition = useWindowStore((s) => s.updatePosition);
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.tablet - 1}px)`);

  const isActive = activeWindowId === windowId;
  const isMaximized = windowState?.isMaximized || isMobile;

  const handleDrag = useCallback(
    (position: { x: number; y: number }) => {
      updatePosition(windowId, position);
    },
    [windowId, updatePosition]
  );

  const { handleMouseDown } = useDraggable({
    initialPosition: windowState?.position ?? { x: 100, y: 60 },
    onDrag: handleDrag,
    enabled: !isMaximized,
  });

  const handleFocus = useCallback(() => {
    focusWindow(windowId);
  }, [focusWindow, windowId]);

  if (!windowState || !windowState.isOpen) return null;

  const style = isMaximized
    ? {
        top: 0,
        left: 0,
        width: "100%",
        height: `calc(100vh - ${TASKBAR_HEIGHT}px)`,
        zIndex: windowState.zIndex,
      }
    : {
        top: windowState.position.y,
        left: windowState.position.x,
        width: windowState.size.width,
        height: windowState.size.height,
        zIndex: windowState.zIndex,
      };

  return (
    <AnimatePresence>
      {!windowState.isMinimized && (
        <motion.div
          className={`fixed flex flex-col overflow-hidden rounded-sm
            border bg-bg-primary shadow-lg shadow-black/50
            ${isActive ? "border-accent-green/30" : "border-border"}`}
          style={style}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          onMouseDown={handleFocus}
        >
          <TitleBar
            windowId={windowId}
            title={windowState.title}
            isActive={isActive}
            onMouseDown={handleMouseDown}
          />
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
