"use client";

export type MobileTab = "about" | "projects" | "resume" | "games" | "contact";

const tabs: { id: MobileTab; label: string; icon: string }[] = [
  { id: "about", label: "About", icon: "\u{1F4BB}" },
  { id: "projects", label: "Projects", icon: "\u{1F4C2}" },
  { id: "resume", label: "Resume", icon: "\u{1F4C4}" },
  { id: "games", label: "Games", icon: "\u{1F3AE}" },
  { id: "contact", label: "Contact", icon: "\u{2709}\u{FE0F}" },
];

interface MobileNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

export default function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center border-t border-border bg-bg-elevated">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 font-mono text-[10px] transition-colors ${
              isActive
                ? "border-t-2 border-accent-green text-accent-green"
                : "border-t-2 border-transparent text-text-secondary"
            }`}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
