"use client";

import { motion } from "framer-motion";
import { WindowId } from "@/types";
import { useWindowStore } from "@/stores/windowStore";
import { SITE_CONFIG } from "@/lib/constants";

interface StartMenuProps {
  onClose: () => void;
}

interface MenuItem {
  label: string;
  icon: string;
  action: () => void;
}

export default function StartMenu({ onClose }: StartMenuProps) {
  const openWindow = useWindowStore((s) => s.openWindow);

  const openAndClose = (id: WindowId) => {
    openWindow(id);
    onClose();
  };

  const menuItems: MenuItem[] = [
    { label: "About", icon: "\u2139\ufe0f", action: () => openAndClose("system-info") },
    { label: "Projects", icon: "\ud83d\udcc1", action: () => openAndClose("projects") },
    { label: "Resume", icon: "\ud83d\udcc4", action: () => openAndClose("resume") },
    { label: "Skills", icon: "\ud83d\udd27", action: () => openAndClose("skills") },
    { label: "Achievements", icon: "\ud83c\udfc6", action: () => openAndClose("achievements") },
    { label: "Event Log", icon: "\ud83d\udccb", action: () => openAndClose("timeline") },
    { label: "Arcade", icon: "\ud83d\udd79\ufe0f", action: () => openAndClose("arcade") },
    { label: "Terminal", icon: ">_", action: () => openAndClose("terminal") },
  ];

  const bottomItems: MenuItem[] = [
    {
      label: "Contact",
      icon: "\ud83d\udce7",
      action: () => {
        window.location.href = `mailto:${SITE_CONFIG.email}`;
        onClose();
      },
    },
    {
      label: "View as Resume",
      icon: "\ud83d\udd17",
      action: () => {
        window.open("/resume", "_blank");
        onClose();
      },
    },
  ];

  const itemClass =
    "flex items-center gap-3 px-4 py-2 text-xs font-mono text-text-primary hover:bg-accent-green/10 hover:text-accent-green cursor-pointer transition-colors w-full text-left";

  return (
    <motion.div
      className="absolute bottom-12 left-0 w-64 bg-bg-elevated border border-border rounded-t-sm shadow-lg shadow-black/50 z-[8000] overflow-hidden"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="text-accent-green font-mono text-sm glow-green">TejasOS</div>
        <div className="text-text-secondary text-[10px] font-mono">Founder Edition</div>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        {menuItems.map((item) => (
          <button key={item.label} className={itemClass} onClick={item.action}>
            <span className="w-5 text-center text-sm">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Separator */}
      <div className="border-t border-border" />

      {/* Bottom Items */}
      <div className="py-1">
        {bottomItems.map((item) => (
          <button key={item.label} className={itemClass} onClick={item.action}>
            <span className="w-5 text-center text-sm">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Footer: Social Links */}
      <div className="px-4 py-2 border-t border-border flex gap-3">
        <a
          href={SITE_CONFIG.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-mono text-text-secondary hover:text-accent-green transition-colors"
        >
          GitHub
        </a>
        <a
          href={SITE_CONFIG.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-mono text-text-secondary hover:text-accent-green transition-colors"
        >
          LinkedIn
        </a>
        <a
          href={SITE_CONFIG.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-mono text-text-secondary hover:text-accent-green transition-colors"
        >
          Instagram
        </a>
      </div>
    </motion.div>
  );
}
