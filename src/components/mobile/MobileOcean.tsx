"use client";

import { useState, useRef, useEffect } from "react";
import { STATIONS } from "@/lib/constants";
import { StationId } from "@/types";
import ResearchLab from "@/components/panels/ResearchLab";
import SalvageYard from "@/components/panels/SalvageYard";
import SystemsBay from "@/components/panels/SystemsBay";
import ArcadeRig from "@/components/panels/ArcadeRig";
import CommsArray from "@/components/panels/CommsArray";
import Gallery from "@/components/panels/Gallery";
import TheTrench from "@/components/panels/TheTrench";
import MobileNav from "./MobileNav";

const STATION_COMPONENTS: Record<StationId, React.ComponentType> = {
  research: ResearchLab,
  salvage: SalvageYard,
  systems: SystemsBay,
  arcade: ArcadeRig,
  comms: CommsArray,
  gallery: Gallery,
  trench: TheTrench,
};

const MAIN_STATIONS = STATIONS.filter((s) => s.id !== "trench");

export default function MobileOcean() {
  const [activeTab, setActiveTab] = useState<StationId>("research");
  const [visitedStations, setVisitedStations] = useState<Set<StationId>>(
    new Set(["research"])
  );
  const [showTrench, setShowTrench] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track which stations have been scrolled into view
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-station") as StationId;
            if (id) {
              setVisitedStations((prev) => {
                const next = new Set(prev);
                next.add(id);
                return next;
              });
              setActiveTab(id);
            }
          }
        });
      },
      { root: container, threshold: 0.3 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [showTrench]);

  // Check if all main stations visited
  useEffect(() => {
    const allMainVisited = MAIN_STATIONS.every((s) =>
      visitedStations.has(s.id)
    );
    if (allMainVisited && !showTrench) {
      setShowTrench(true);
    }
  }, [visitedStations, showTrench]);

  const scrollToStation = (id: StationId) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
    setActiveTab(id);
  };

  const visibleStations = showTrench ? STATIONS : MAIN_STATIONS;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header
        className="shrink-0 px-4 py-3 flex items-center justify-between z-20"
        style={{
          background: "rgba(10, 15, 26, 0.95)",
          borderBottom: "1px solid rgba(0, 212, 255, 0.1)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div>
          <h1
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "var(--accent-cyan)" }}
          >
            Tejas Naladala
          </h1>
          <p
            className="font-mono text-[9px]"
            style={{ color: "var(--text-secondary)" }}
          >
            ROV Deep-Sea Explorer
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[9px] tabular-nums"
            style={{ color: "var(--text-secondary)" }}
          >
            {visitedStations.size}/{MAIN_STATIONS.length}
          </span>
          <a
            href="/"
            className="font-mono text-[9px] tracking-wider uppercase px-2 py-1 rounded-sm"
            style={{
              color: "var(--accent-cyan)",
              border: "1px solid rgba(0, 212, 255, 0.2)",
            }}
          >
            Home
          </a>
          <a
            href="/resume"
            className="font-mono text-[9px] tracking-wider uppercase px-2 py-1 rounded-sm"
            style={{
              color: "var(--accent-amber)",
              border: "1px solid rgba(255, 176, 0, 0.3)",
            }}
          >
            Resume
          </a>
        </div>
      </header>

      {/* Scrollable content */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ background: "var(--ocean-surface)" }}
      >
        {visibleStations.map((station) => {
          const StationComponent = STATION_COMPONENTS[station.id];
          return (
            <section
              key={station.id}
              ref={(el) => {
                sectionRefs.current[station.id] = el;
              }}
              data-station={station.id}
              className="min-h-screen px-4 py-8"
              style={{
                background:
                  station.id === "trench"
                    ? "linear-gradient(180deg, var(--ocean-midnight) 0%, var(--ocean-abyss) 100%)"
                    : undefined,
              }}
            >
              {/* Section header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{station.icon}</span>
                <div>
                  <h2
                    className="font-mono text-sm tracking-wider uppercase"
                    style={{ color: "var(--accent-cyan)" }}
                  >
                    {station.label}
                  </h2>
                  <p
                    className="font-mono text-[10px]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {station.description}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div
                className="mb-6"
                style={{
                  borderBottom: "1px solid rgba(0, 212, 255, 0.1)",
                }}
              />

              {/* Station content */}
              <StationComponent />
            </section>
          );
        })}

        {/* Bottom spacer for nav bar */}
        <div className="h-16" />
      </div>

      {/* Bottom navigation */}
      <MobileNav
        activeTab={activeTab}
        onNavigate={scrollToStation}
        showTrench={showTrench}
      />
    </div>
  );
}
