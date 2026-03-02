"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { DesktopIconConfig, WindowId } from "@/types";
import { useWindowStore } from "@/stores/windowStore";
import { SITE_CONFIG } from "@/lib/constants";

interface DesktopIconProps {
  config: DesktopIconConfig;
  index: number;
}

export default function DesktopIcon({ config, index }: DesktopIconProps) {
  const lastClickTime = useRef(0);
  const openWindow = useWindowStore((s) => s.openWindow);

  const handleOpen = useCallback(() => {
    if (config.id === "mail") {
      window.location.href = `mailto:${SITE_CONFIG.email}`;
    } else {
      openWindow(config.id as WindowId);
    }
  }, [config.id, openWindow]);

  const handleClick = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTime.current < 400) {
      handleOpen();
      lastClickTime.current = 0;
    } else {
      lastClickTime.current = now;
    }
  }, [handleOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleOpen();
      }
    },
    [handleOpen]
  );

  return (
    <motion.button
      className="flex flex-col items-center gap-1 w-20 p-2 rounded
        hover:bg-white/5 focus:bg-white/10 focus:outline-none
        transition-colors cursor-pointer select-none"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay: index * 0.08,
      }}
      aria-label={`Open ${config.label}`}
    >
      <span className="text-2xl" role="img" aria-hidden>
        {config.icon}
      </span>
      <span className="text-[10px] font-mono text-text-primary leading-tight text-center break-words">
        {config.label}
      </span>
    </motion.button>
  );
}
