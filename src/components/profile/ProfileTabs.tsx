"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import { achievements } from "@/data/achievements";
import { publications, preprints, scholarProfile } from "@/data/publications";
import { GlowCard } from "@/components/ui/spotlight-card";
import ImageRevealHero from "@/components/profile/ImageRevealHero";

/**
 * Aayam-style profile: bold mono nameplate, hairline tab nav, content panels
 * for OVERVIEW, EXPERIENCE, PROJECTS, PUBLICATIONS, AWARDS, CONTACT.
 *
 * 3D: nameplate gets a subtle mouse-parallax tilt (CSS perspective + rotateX/Y
 * driven by pointer position, throttled to rAF). No external 3D library.
 * Disabled under prefers-reduced-motion.
 */

type Tab =
  | "overview"
  | "experience"
  | "projects"
  | "publications"
  | "awards"
  | "contact";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "publications", label: "Publications" },
  { id: "awards", label: "Awards" },
  { id: "contact", label: "Contact" },
];

function useMouseTilt(enabled: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    let running = true;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let pendingMove = false;

    const onMove = (e: MouseEvent) => {
      // Reduced amplitude (was 8/12 deg, now 3/4 deg) - calmer and cheaper.
      const w = window.innerWidth;
      const h = window.innerHeight;
      targetX = (e.clientY / h - 0.5) * -3;
      targetY = (e.clientX / w - 0.5) * 4;
      pendingMove = true;
    };

    const tick = () => {
      if (!running) return;
      // Skip the easing math when nothing has moved AND the current already
      // matches the target (no work to do). This frees the main thread.
      if (
        pendingMove ||
        Math.abs(targetX - currentX) > 0.001 ||
        Math.abs(targetY - currentY) > 0.001
      ) {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        if (ref.current) {
          ref.current.style.transform = `perspective(1200px) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
        }
        pendingMove = false;
      }
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);
    return () => {
      running = false;
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);
  return ref;
}

export default function ProfileTabs() {
  const [active, setActive] = useState<Tab>("overview");
  const tiltRef = useMouseTilt(true);

  return (
    <div style={{ position: "relative" }}>
      {/* HERO BLOCK - full-width 2-column grid:
            LEFT  : eyebrow, nameplate, tagline, lede
            RIGHT : ImageRevealHero + domain tags + currently-line
          Stacks below 1024px so mobile reads top-to-bottom.
          alignItems is `start` so the portrait aligns with the top of the
          nameplate column rather than centering against the taller text
          stack - that vertical alignment was making the photo read as
          "below" the nameplate instead of next to it. */}
      <div
        className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]"
        style={{
          position: "relative",
          zIndex: 1,
          gap: "clamp(40px, 5vw, 64px)",
          alignItems: "start",
        }}
      >
        <div className="order-2 min-w-0 lg:order-1">
          <div
            style={{
              perspective: "1200px",
              willChange: "transform",
            }}
          >
            <p
              className="eyebrow"
              style={{ marginBottom: 16 }}
            >
              Engineer / Researcher / Founder
            </p>
            <h1
              ref={tiltRef}
              className="nameplate"
              style={{
                fontSize: "clamp(48px, 7.4vw, 104px)",
                letterSpacing: "0.02em",
                lineHeight: 0.94,
                display: "block",
                transition: "transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                transformStyle: "preserve-3d",
              }}
            >
              TEJAS<br />NALADALA
            </h1>
          </div>

          {/* Tagline - punchy, dense thesis sentence. Wider measure so
              it doesn't shatter into 4 short lines on a 1180px hero. */}
          <h2
            style={{
              marginTop: 32,
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "clamp(20px, 2.1vw, 26px)",
              lineHeight: 1.32,
              letterSpacing: "-0.012em",
              color: "var(--text-primary)",
              maxWidth: "34ch",
            }}
          >
            18. Building plasma hardware, autonomous research engines, and
            verification systems for model-generated work.
          </h2>

          {/* Lede paragraph - a single dense paragraph in the user's
              preferred fact-first cadence. */}
          <p
            className="body-md"
            style={{
              marginTop: 24,
              color: "var(--text-secondary)",
              maxWidth: "58ch",
              fontSize: 16,
              lineHeight: 1.7,
            }}
          >
            Currently building <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>R0 Systems</strong>, plasma sanitization equipment for post-harvest agricultural produce. Prev. founded <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>PlasmaX</strong> ($2M seed; decentralised on-site nitrogen production for ammonia synthesis). Also building <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>Parchment Labs</strong> (autonomous literature-to-experiment pipeline) and <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>delphi</strong> (pre-registered verification for LLM-generated quant strategies).
          </p>
        </div>

        <div
          className="order-1 mx-auto w-full min-w-0 lg:order-2"
          style={{
            marginTop: "var(--portrait-offset, 6px)",
            maxWidth: "min(440px, 100%)",
          }}
        >
          <ImageRevealHero />

          {/* Domain tag row - sits below the portrait. Slash-separated
              mono row that wraps naturally on narrower viewports. */}
          <div
            className="flex flex-wrap items-center justify-center"
            style={{ marginTop: 24, columnGap: 14, rowGap: 8 }}
          >
            {[
              "plasma hardware",
              "embedded systems",
              "AI evaluation",
              "autonomous research",
              "verification",
            ].map((tag, i, arr) => (
              <span
                key={tag}
                className="flex items-center font-mono uppercase"
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.16em",
                  color: "var(--text-muted)",
                }}
              >
                {tag}
                {i < arr.length - 1 && (
                  <span
                    aria-hidden="true"
                    style={{
                      marginLeft: 14,
                      color: "var(--text-faint)",
                    }}
                  >
                    /
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Currently-shipping line - centered under the picture. */}
          <div style={{ marginTop: 18 }}>
            <p
              className="profile-now-line font-mono text-center"
              style={{
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                lineHeight: 1.7,
              }}
            >
              <span style={{ color: "#CC785C" }}>Now </span>
              <span style={{ color: "var(--text-primary)" }}>R0 Systems</span>
              <span style={{ color: "var(--text-faint)" }}>
                {" "}/ post-harvest plasma sanitization
              </span>
              <br />
              <span style={{ color: "var(--text-faint)" }}>also </span>
              <span style={{ color: "var(--text-primary)" }}>Parchment Labs</span>
              <span style={{ color: "var(--text-faint)" }}> + </span>
              <span style={{ color: "var(--text-primary)" }}>delphi</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tab nav + panels constrained to a comfortable reading column.
          Hero above is full-width (2-col with portrait); the body content
          stays narrower for measure. */}
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
      <div role="tablist" aria-label="Profile sections" className="tab-nav">
        {TABS.map((tab, idx) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const dir = e.key === "ArrowRight" ? 1 : -1;
                const next = (idx + dir + TABS.length) % TABS.length;
                setActive(TABS[next].id);
                document.getElementById(`tab-${TABS[next].id}`)?.focus();
              } else if (e.key === "Home") {
                e.preventDefault();
                setActive(TABS[0].id);
                document.getElementById(`tab-${TABS[0].id}`)?.focus();
              } else if (e.key === "End") {
                e.preventDefault();
                setActive(TABS[TABS.length - 1].id);
                document.getElementById(`tab-${TABS[TABS.length - 1].id}`)?.focus();
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panels - animated swap with fade+rise so the active panel feels
          like it flows in. Hidden panels still render in DOM for SEO. */}
      <div className="profile-panel-wrap" style={{ position: "relative", zIndex: 1 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {renderPanel(active)}
          </motion.div>
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
}

function renderPanel(active: Tab) {
  switch (active) {
    case "overview":
      return <Overview hidden={false} />;
    case "experience":
      return <Experience hidden={false} />;
    case "projects":
      return <Projects hidden={false} />;
    case "publications":
      return <Publications hidden={false} />;
    case "awards":
      return <Awards hidden={false} />;
    case "contact":
      return <Contact hidden={false} />;
  }
}

function Panel({
  id,
  hidden,
  children,
}: {
  id: Tab;
  hidden: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={`panel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      hidden={hidden}
      className="profile-panel"
    >
      {children}
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="section-label">
      {children}
    </p>
  );
}

/* -------------------- OVERVIEW -------------------- */
function Overview({ hidden }: { hidden: boolean }) {
  return (
    <Panel id="overview" hidden={hidden}>
      <div>
        <SectionLabel>About</SectionLabel>
        <p
          className="body-lg"
          style={{ fontSize: "clamp(20px, 2.2vw, 26px)", lineHeight: 1.5 }}
        >
          18, undergrad. Currently building{" "}
          <strong style={{ fontWeight: 600 }}>R0 Systems</strong> — plasma
          sanitization equipment for post-harvest agricultural produce.
          Prev. founded <strong style={{ fontWeight: 600 }}>PlasmaX</strong>{" "}
          ($2M seed; decentralised on-site nitrogen production for ammonia
          synthesis). Also building{" "}
          <strong style={{ fontWeight: 600 }}>Parchment Labs</strong> and{" "}
          <strong style={{ fontWeight: 600 }}>delphi</strong>.
        </p>
        <p
          className="body-md mt-6"
          style={{ color: "var(--text-secondary)" }}
        >
          I care about systems that can be audited: real customers, real
          hardware, real experiments, real failure logs.
        </p>
      </div>

      <div>
        <SectionLabel>Education</SectionLabel>
        <div className="profile-row profile-row-start">
          <div>
            <p className="label-mono" style={{ color: "var(--text-muted)" }}>
              2024 — 2028
            </p>
          </div>
          <div>
            <p className="body-md" style={{ fontWeight: 600, fontSize: 17 }}>
              University of Washington, Seattle
            </p>
            <p className="body-md mt-1" style={{ fontSize: 16 }}>
              B.S. Electrical &amp; Computer Engineering + Applied Mathematics
            </p>
            <p
              className="label-mono mt-2"
              style={{ color: "var(--text-muted)", fontSize: 12 }}
            >
              GPA 3.93/4.0 · Lavin Fellow · YC AI Startup School 2026
            </p>
          </div>
        </div>
      </div>

      <div>
        <SectionLabel>Highlights</SectionLabel>
        <Highlight
          tag="BUILDING"
          title="R0 Systems"
          body="Plasma sanitization equipment for post-harvest agricultural produce. Currently in design + bench-validation stage, with first reactor unit targeted for 2026."
        />
        <Highlight
          tag="PREV. SHIPPED"
          title="PlasmaX (May 2023 — Jan 2026)"
          body="$2M seed at $8M post-money. Decentralised on-site nitrogen production for ammonia synthesis. $180K first production unit sold to CSIR-CFTRI India, 10 deployments contracted, 3 peer-reviewed publications, 1 patent filed."
        />
        <Highlight
          tag="RESEARCH"
          title="Parchment Labs"
          body="Autonomous literature-to-experiment engine — local 32B inference, HNSW retrieval, 150-agent adversarial peer review, GPU execution, LaTeX manuscript generation."
        />
        <Highlight
          tag="VERIFYING"
          title="delphi + agentbreed"
          body="Pre-registered verification loops for LLM-generated quant strategies and multi-agent LLM configuration studies. Structured rejection logs, test-gated evaluation harnesses."
        />
        <Highlight
          tag="LAB WORK"
          title="UW SEAL Lab · NIIST-CSIR India · Maze RL"
          body="Embedded sensing for U.S. Navy hull integrity, PPG drowsiness wearables, solar-cell characterization, reproducible RL baselines showing reward-driven discovery failure."
        />
      </div>

      <div>
        <SectionLabel>Selected Recognition</SectionLabel>
        <div className="recognition-list">
          {[
            "YC AI Startup School 2026 · San Francisco cohort",
            "OpenAI Parameter Golf · beat prior 2nd-place track_10min_16mb",
            "Google Scholar · 35 citations, h-index 3, i10-index 2",
            "Carnegie Mellon Venture Challenge · 2nd / 150+ teams · $4,500",
            "UW Science & Technology Showcase · Grand Prize + Best Pitch · $2,750",
            "Red Bull Basement · Runner-up",
            "Lavin Entrepreneurship Fellow · four-year selective program",
          ].map((line) => (
            <p key={line} className="recognition-item">
              {line}
            </p>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Todo (Not That Kind)</SectionLabel>
        {/* Tight, monospaced checklist. Single-line rows, no wrapping
            brackets, no trailing footnote. Hairline divider between rows for
            a printed-list feel. */}
        <ul className="todo-list font-mono">
          {[
            { done: true, text: "Sell an industrial reactor before turning 18" },
            { done: true, text: "Get a paper into a real journal" },
            { done: true, text: "Beat a Parameter Golf leaderboard track" },
            {
              done: false,
              text: "Publish the connectome benchmark after peer review",
            },
          ].map((item) => (
            <li
              key={item.text}
              className="flex items-center gap-3 py-3"
              style={{
                borderBottom: "1px solid var(--hairline)",
                color: item.done ? "var(--text-muted)" : "var(--text-primary)",
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  width: 26,
                  flexShrink: 0,
                  color: item.done ? "var(--text-muted)" : "#CC785C",
                }}
              >
                {item.done ? "[x]" : "[ ]"}
              </span>
              <span
                style={{
                  textDecoration: item.done ? "line-through" : "none",
                  textDecorationThickness: "1px",
                }}
              >
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

function Highlight({
  tag,
  title,
  body,
}: {
  tag: string;
  title: string;
  body: string;
}) {
  return (
    <div className="profile-row">
      <div>
        <p
          className="label-mono"
          style={{ color: "var(--text-muted)", fontSize: 12 }}
        >
          {tag}
        </p>
      </div>
      <div>
        <p className="body-md" style={{ fontWeight: 600, fontSize: 17 }}>
          {title}
        </p>
        <p
          className="body-md mt-2"
          style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.65 }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

/* -------------------- EXPERIENCE -------------------- */
function Experience({ hidden }: { hidden: boolean }) {
  const entries: Array<{
    date: string;
    role: string;
    org: string;
    body: string;
  }> = [
    {
      date: "2026 — Present",
      role: "Project Lead",
      org: "R0 Systems",
      body: "Plasma sanitization equipment for post-harvest agricultural produce. Bench-validation underway, first reactor unit targeted 2026.",
    },
    {
      date: "Dec 2025 — Present",
      role: "Project Lead",
      org: "Parchment Labs",
      body: "Autonomous research discovery engine — 5,000+ papers/day ingestion, local 32B inference, HNSW retrieval, 150-agent peer review, GPU execution, reproducible manuscripts.",
    },
    {
      date: "Jan 2026 — Present",
      role: "Project Lead",
      org: "delphi",
      body: "Pre-registered validation pipeline for LLM-generated quantitative strategies. Explicit promotion criteria and structured rejection logs for full auditability.",
    },
    {
      date: "Mar 2026 — Present",
      role: "Lead Author",
      org: "agentbreed",
      body: "Pre-registered multi-agent LLM configuration study across ForecastBench, LiveCodeBench, GPQA. 509 unit and fuzz tests caught 23 issues before data collection.",
    },
    {
      date: "May 2023 — Jan 2026",
      role: "Founder & CTO",
      org: "PlasmaX",
      body: "Decentralised on-site nitrogen production for ammonia synthesis. $2M seed at $8M post-money, $180K first unit sold, 10 deployments contracted, 1 patent filed, 3 peer-reviewed publications.",
    },
    {
      date: "Mar — Nov 2025",
      role: "Research Associate",
      org: "SEAL Lab, University of Washington",
      body: "Under Prof. Mamishev. PPG drowsiness wearable, 95% motion-artifact rejection. Piezoelectric breakage sensor for U.S. Navy hull integrity monitoring.",
    },
    {
      date: "Jun 2024 — Mar 2025",
      role: "Research Intern",
      org: "NIIST-CSIR, India",
      body: "Centre for Sustainable Energy Technologies, under Dr. Suraj Soman. Fabricated and characterized 20+ dye-sensitized and perovskite solar cell architectures.",
    },
  ];

  return (
    <Panel id="experience" hidden={hidden}>
      <div>
        <SectionLabel>Experience</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          {entries.map((e, i) => (
            <GlowCard
              key={i}
              glowColor="orange"
              customSize
              className="profile-card flex flex-col items-start text-left"
            >
              <p
                className="label-mono"
                style={{ color: "var(--text-muted)", fontSize: 11 }}
              >
                {e.date}
              </p>
              <h3
                className="mt-3"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 20,
                  letterSpacing: "-0.005em",
                  color: "var(--text-primary)",
                  lineHeight: 1.2,
                }}
              >
                {e.role}
              </h3>
              <p
                className="label-mono mt-1.5"
                style={{ color: "var(--text-secondary)", fontSize: 12 }}
              >
                {e.org}
              </p>
              <p
                className="body-sm mt-4"
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  lineHeight: 1.65,
                }}
              >
                {e.body}
              </p>
            </GlowCard>
          ))}
        </div>
      </div>
    </Panel>
  );
}

/* -------------------- PROJECTS -------------------- */
function Projects({ hidden }: { hidden: boolean }) {
  const featured = [
    "r0-systems",
    "parchment",
    "delphi",
    "agentbreed",
    "wireml",
    "maze-rl-baselines",
    "parameter-golf",
    "engram",
    "claude-nexus",
    "mimic",
    "forge",
    "cerulean",
    "knowledge-engine",
    "ai-agent-city",
    "icordion",
    "delulu",
    "tejas-os",
  ]
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <Panel id="projects" hidden={hidden}>
      <div>
        <SectionLabel>Selected Projects</SectionLabel>
        {/* Two-column glow card grid. Cards are left-aligned and size to
            content; the cursor paints a warm halo behind. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          {featured.map((p, i) => {
            const link = p.links?.[0];
            return (
              <GlowCard
                key={p.id}
                glowColor="orange"
                customSize
                className="profile-card flex flex-col items-start text-left"
              >
                <div
                  className="flex flex-wrap items-center gap-x-2 gap-y-1"
                  style={{ marginBottom: 6 }}
                >
                  <span
                    className="label-mono"
                    style={{ color: "var(--text-muted)", fontSize: 11 }}
                  >
                    {String(i + 1).padStart(2, "0")} · {p.date}
                  </span>
                  {link && (
                    <>
                      <span style={{ color: "var(--text-faint)" }}>·</span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--text-muted)",
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          textDecoration: "underline",
                          textUnderlineOffset: 3,
                        }}
                      >
                        {link.label.replace(/^DOI: /, "DOI ")}
                      </a>
                    </>
                  )}
                </div>
                <h3
                  className="mt-3"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 22,
                    letterSpacing: "-0.005em",
                    color: "var(--text-primary)",
                    lineHeight: 1.2,
                  }}
                >
                  {p.title}
                </h3>
                <p
                  className="body-sm mt-3"
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: 14,
                    lineHeight: 1.65,
                  }}
                >
                  {p.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.tech.slice(0, 5).map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </GlowCard>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}

/* -------------------- PUBLICATIONS -------------------- */
function Publications({ hidden }: { hidden: boolean }) {
  const pubs = publications;
  return (
    <Panel id="publications" hidden={hidden}>
      <div>
        <SectionLabel>Peer-Reviewed Publications</SectionLabel>
        <p className="body-sm" style={{ color: "var(--text-muted)" }}>
          Google Scholar · {scholarProfile.citations} citations · h-index{" "}
          {scholarProfile.hIndex} · i10-index {scholarProfile.i10Index}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {pubs.map((p, i) => (
            <GlowCard
              key={p.title}
              glowColor="orange"
              customSize
              className="profile-card flex flex-col items-start text-left"
            >
              <p
                className="label-mono"
                style={{ color: "var(--text-muted)", fontSize: 11 }}
              >
                {String(i + 1).padStart(2, "0")} · Peer-reviewed
              </p>
              <h3
                className="mt-3"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 17,
                  letterSpacing: "-0.005em",
                  color: "var(--text-primary)",
                  lineHeight: 1.3,
                }}
              >
                {p.title}
              </h3>
              <p
                className="body-sm mt-3"
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  lineHeight: 1.55,
                }}
              >
                {p.venue} · {p.year}
                {typeof p.citations === "number" ? ` · ${p.citations} citations` : ""}
              </p>
              <a
                href={`https://doi.org/${p.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4"
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.04em",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                doi.org/{p.doi}
              </a>
            </GlowCard>
          ))}
        </div>
        <p className="eyebrow mt-10" style={{ color: "var(--text-muted)" }}>
          Preprints
        </p>
        <div className="mt-4 space-y-2">
          {preprints.map((p) => (
            <p key={p.title} className="body-md" style={{ fontSize: 16 }}>
              {p.title}{" "}
              <span style={{ color: "var(--text-secondary)" }}>
                · {p.venue}
              </span>
            </p>
          ))}
        </div>
      </div>
    </Panel>
  );
}

/* -------------------- AWARDS -------------------- */
function Awards({ hidden }: { hidden: boolean }) {
  return (
    <Panel id="awards" hidden={hidden}>
      <div>
        <SectionLabel>Awards & Honors</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          {achievements.map((a) => (
            <GlowCard
              key={a.title}
              glowColor="orange"
              customSize
              className="profile-card flex flex-col items-start text-left"
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: "-0.005em",
                  color: "var(--text-primary)",
                  lineHeight: 1.25,
                }}
              >
                {a.title}
              </h3>
              <p
                className="body-sm mt-3"
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {a.description}
              </p>
            </GlowCard>
          ))}
        </div>
      </div>
    </Panel>
  );
}

/* -------------------- CONTACT -------------------- */
function Contact({ hidden }: { hidden: boolean }) {
  const channels = [
    {
      label: "Email",
      value: "naladala@uw.edu",
      href: "mailto:naladala@uw.edu",
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/tejasnaladala",
      href: "https://linkedin.com/in/tejasnaladala",
      external: true,
    },
    {
      label: "GitHub",
      value: "github.com/tejasnaladala",
      href: "https://github.com/tejasnaladala",
      external: true,
    },
    {
      label: "Resume",
      value: "Download CV (PDF)",
      href: "/resume.pdf",
      external: true,
    },
  ];

  return (
    <Panel id="contact" hidden={hidden}>
      <div>
        <SectionLabel>Contact</SectionLabel>
        <p className="body-lg" style={{ fontSize: "clamp(20px, 2vw, 24px)" }}>
          Best way to reach me: email.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {channels.map((row) => (
            <GlowCard
              key={row.label}
              glowColor="orange"
              customSize
              className="profile-card flex flex-col items-start text-left"
            >
              <p
                className="label-mono"
                style={{
                  color: "var(--text-muted)",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                }}
              >
                {row.label.toUpperCase()}
              </p>
              <a
                href={row.href}
                target={
                  row.external || row.href.startsWith("http")
                    ? "_blank"
                    : undefined
                }
                rel={
                  row.external || row.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="mt-3 block"
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  textDecoration: "none",
                  wordBreak: "break-word",
                  lineHeight: 1.35,
                }}
              >
                {row.value}
              </a>
            </GlowCard>
          ))}
        </div>

        <div className="mt-14">
          <SectionLabel>Other Surfaces</SectionLabel>
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            {[
              { href: "/work", label: "Work" },
              { href: "/thesis", label: "Thesis" },
              { href: "/stories", label: "Stories" },
              { href: "/resume", label: "Resume" },
              { href: "/gallery", label: "Gallery" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="btn-ghost">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
