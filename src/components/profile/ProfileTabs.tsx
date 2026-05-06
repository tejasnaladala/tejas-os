"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import { achievements } from "@/data/achievements";
import { publications, preprints, scholarProfile } from "@/data/publications";
import ImageRevealHero from "@/components/profile/ImageRevealHero";

/** Inline external-link arrow. Outline-only so it sits in body color. */
function ArrowOutward({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

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

function SectionHeader({
  label,
  intro,
}: {
  label: string;
  intro?: string;
}) {
  return (
    <div>
      <p className="section-label">{label}</p>
      {intro && <p className="section-intro">{intro}</p>}
    </div>
  );
}

/* -------------------- OVERVIEW -------------------- */
function Overview({ hidden }: { hidden: boolean }) {
  return (
    <Panel id="overview" hidden={hidden}>
      <div>
        <SectionLabel>Education</SectionLabel>
        <div className="profile-row profile-row-start">
          <div>
            <p className="label-mono" style={{ color: "var(--text-muted)" }}>
              2024 to 2028
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
          body="Plasma sanitization equipment for post-harvest agricultural produce. $30K validation deployment sold; first commercial reactor unit and packhouse pilots targeted 2026."
        />
        <Highlight
          tag="PREV. SHIPPED"
          title="PlasmaX"
          body="$2M seed at $8M post-money. Decentralised on-site nitrogen production for ammonia synthesis. $180K first production unit sold to CSIR-CFTRI India, 13 deployments contracted, 3 peer-reviewed publications, 2 provisional patents filed."
        />
        <Highlight
          tag="RESEARCH"
          title="Parchment Labs"
          body="Autonomous literature-to-experiment engine. Local 32B inference, HNSW retrieval, 150-agent adversarial peer review, GPU execution, LaTeX manuscript generation."
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
type ExperienceEntry = {
  date: string;
  role: string;
  org: string;
  body: string;
};

function ExperienceCard({ entry }: { entry: ExperienceEntry }) {
  return (
    <article className="grid-card">
      <p
        className="label-mono"
        style={{
          color: "var(--text-muted)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {entry.date}
      </p>
      <h3
        style={{
          marginTop: 12,
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 20,
          letterSpacing: "-0.005em",
          color: "var(--text-primary)",
          lineHeight: 1.2,
        }}
      >
        {entry.role}
      </h3>
      <p
        style={{
          marginTop: 6,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.04em",
          color: "var(--text-secondary)",
        }}
      >
        {entry.org}
      </p>
      <p
        style={{
          marginTop: 16,
          fontFamily: "var(--font-body)",
          fontSize: 14.5,
          lineHeight: 1.65,
          color: "var(--text-secondary)",
        }}
      >
        {entry.body}
      </p>
    </article>
  );
}

function Experience({ hidden }: { hidden: boolean }) {
  const entries: ExperienceEntry[] = [
    {
      date: "2026 to Present",
      role: "Founder & CEO",
      org: "R0 Systems",
      body: "Plasma sanitization equipment for post-harvest agricultural produce. $30K validation deployment sold; first commercial reactor unit and packhouse pilots targeted 2026.",
    },
    {
      date: "Dec 2025 to Present",
      role: "Project Lead",
      org: "Parchment Labs",
      body: "Autonomous research discovery engine. 5,000+ papers/day ingestion, local 32B inference, HNSW retrieval, 150-agent peer review, GPU execution, reproducible manuscripts.",
    },
    {
      date: "Jan 2026 to Present",
      role: "Project Lead",
      org: "delphi",
      body: "Pre-registered validation pipeline for LLM-generated quantitative strategies. Explicit promotion criteria and structured rejection logs for full auditability.",
    },
    {
      date: "Mar 2026 to Present",
      role: "Lead Author",
      org: "agentbreed",
      body: "Pre-registered multi-agent LLM configuration study across ForecastBench, LiveCodeBench, GPQA. 509 unit and fuzz tests caught 23 issues before data collection.",
    },
    {
      date: "Mar to Nov 2025",
      role: "Research Associate",
      org: "SEAL Lab, University of Washington",
      body: "Under Prof. Mamishev. PPG drowsiness wearable, 95% motion-artifact rejection. Piezoelectric breakage sensor for U.S. Navy hull integrity monitoring.",
    },
    {
      date: "Jun 2024 to Mar 2025",
      role: "Research Intern",
      org: "NIIST-CSIR, India",
      body: "Centre for Sustainable Energy Technologies, under Dr. Suraj Soman. Fabricated and characterized 20+ dye-sensitized and perovskite solar cell architectures.",
    },
  ];

  return (
    <Panel id="experience" hidden={hidden}>
      <div>
        <SectionHeader
          label="Experience"
          intro="Six positions across hardware ventures, autonomous research, and academic labs. Each shipping real artifacts under real deadlines."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {entries.map((entry, i) => (
            <ExperienceCard key={i} entry={entry} />
          ))}
        </div>
      </div>
    </Panel>
  );
}

/* -------------------- PROJECTS -------------------- */
function FeaturedProject() {
  const plasmax = projects.find((p) => p.id === "plasmafx");
  if (!plasmax) return null;

  // Tags chosen for brand-positioning (Deep Tech, Plasma Hardware, etc.)
  // rather than the lower-level tech stack used in the regular grid.
  const tags = ["Deep Tech", "Plasma Hardware", "Agriculture", "Nitrogen"];

  return (
    <a
      className="featured-card"
      href="https://plasmax.in"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="PlasmaX (opens in a new tab)"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className="font-mono"
          style={{
            fontSize: 10.5,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#CC785C",
            fontWeight: 600,
          }}
        >
          Featured
        </span>
        <span
          className="visit-arrow font-mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-primary)",
          }}
        >
          plasmax.in
          <ArrowOutward size={13} />
        </span>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]"
        style={{ marginTop: 24, gap: "clamp(20px, 3vw, 48px)", alignItems: "start" }}
      >
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(34px, 4.6vw, 52px)",
              letterSpacing: "-0.012em",
              lineHeight: 1.02,
              color: "var(--text-primary)",
            }}
          >
            PlasmaX
          </h3>
          <p
            className="font-mono"
            style={{
              marginTop: 10,
              fontSize: 12,
              letterSpacing: "0.06em",
              color: "var(--text-secondary)",
            }}
          >
            Founder &amp; CTO
          </p>
        </div>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 15.5,
            lineHeight: 1.65,
            color: "var(--text-secondary)",
            maxWidth: "44ch",
          }}
        >
          Decentralised on-site nitrogen production for ammonia synthesis. $2M
          seed at $8M post-money, $180K first unit sold, 13 deployments
          contracted, 2 provisional patents filed, 3 peer-reviewed publications.
        </p>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-2">
        {tags.map((t, i) => (
          <span key={t} className="flex items-center">
            <span className="chip">{t}</span>
            {i < tags.length - 1 && (
              <span
                aria-hidden="true"
                style={{
                  marginLeft: 8,
                  color: "var(--text-faint)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                }}
              >
                ·
              </span>
            )}
          </span>
        ))}
      </div>
    </a>
  );
}

/**
 * Secondary featured card. Mirrors the primary FeaturedProject layout
 * (top-row eyebrow, 2-col title+role / description, dotted tag row) at a
 * smaller scale so the visual hierarchy reads "PlasmaX (headline) + R0
 * (supporting beat)" rather than two competing cards. R0 has no public
 * website yet so there is no top-right link affordance.
 */
function SecondaryFeaturedR0() {
  const r0 = projects.find((p) => p.id === "r0-systems");
  if (!r0) return null;

  // Brand-positioning tags chosen for parity with the PlasmaX featured card.
  const tags = [
    "Deep Tech",
    "Plasma Hardware",
    "Agriculture",
    "Sanitization",
  ];

  return (
    <article className="featured-card-secondary">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className="font-mono"
          style={{
            fontSize: 10.5,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#CC785C",
            fontWeight: 600,
          }}
        >
          Current
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          2026 to Present
        </span>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]"
        style={{ marginTop: 24, gap: "clamp(20px, 3vw, 48px)", alignItems: "start" }}
      >
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(26px, 3.4vw, 38px)",
              letterSpacing: "-0.01em",
              lineHeight: 1.04,
              color: "var(--text-primary)",
            }}
          >
            R0 Systems
          </h3>
          <p
            className="font-mono"
            style={{
              marginTop: 10,
              fontSize: 12,
              letterSpacing: "0.06em",
              color: "var(--text-secondary)",
            }}
          >
            Founder &amp; CEO
          </p>
        </div>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 15,
            lineHeight: 1.6,
            color: "var(--text-secondary)",
            maxWidth: "44ch",
          }}
        >
          Plasma sanitization equipment for post-harvest agricultural produce.{" "}
          <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
            $30K validation deployment sold
          </strong>
          ; first commercial reactor unit and packhouse pilots targeted 2026.
        </p>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-2">
        {tags.map((t, i) => (
          <span key={t} className="flex items-center">
            <span className="chip">{t}</span>
            {i < tags.length - 1 && (
              <span
                aria-hidden="true"
                style={{
                  marginLeft: 8,
                  color: "var(--text-faint)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                }}
              >
                ·
              </span>
            )}
          </span>
        ))}
      </div>
    </article>
  );
}

type ProjectCardProps = {
  project: NonNullable<ReturnType<typeof projects.find>>;
  index: number;
};

function ProjectGridCard({ project, index }: ProjectCardProps) {
  const link = project.links?.[0];

  return (
    <article className="grid-card">
      {link && (
        <a
          className="grid-card-cover"
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} (opens in a new tab)`}
        />
      )}
      <div
        className="flex flex-wrap items-center gap-x-2 gap-y-1"
        style={{ marginBottom: 14 }}
      >
        <span
          className="label-mono"
          style={{
            color: "var(--text-muted)",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {String(index + 1).padStart(2, "0")} · {project.date}
        </span>
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 21,
          letterSpacing: "-0.005em",
          color: "var(--text-primary)",
          lineHeight: 1.18,
          display: "inline-flex",
          alignItems: "baseline",
          gap: 8,
        }}
      >
        {project.title}
        {link && (
          <span style={{ color: "var(--text-muted)", display: "inline-flex" }}>
            <ArrowOutward size={13} />
          </span>
        )}
      </h3>
      <p
        className="font-mono"
        style={{
          marginTop: 6,
          fontSize: 11.5,
          letterSpacing: "0.04em",
          color: "var(--text-muted)",
        }}
      >
        {project.role}
      </p>
      <p
        style={{
          marginTop: 14,
          fontFamily: "var(--font-body)",
          fontSize: 14.5,
          lineHeight: 1.65,
          color: "var(--text-secondary)",
        }}
      >
        {project.summary}
      </p>
      <div className="mt-5 flex flex-wrap gap-1.5" style={{ position: "relative", zIndex: 1 }}>
        {project.tech.slice(0, 5).map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}

function Projects({ hidden }: { hidden: boolean }) {
  // PlasmaX (primary) and R0 Systems (secondary) are featured separately;
  // the grid below lists everything else.
  const gridIds = [
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
  ];
  const grid = gridIds
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <Panel id="projects" hidden={hidden}>
      <div>
        <SectionHeader
          label="Featured Projects"
          intro="Selected work across plasma hardware, autonomous research systems, and multi-agent evaluation."
        />
        <FeaturedProject />
        <SecondaryFeaturedR0 />

        <div style={{ marginTop: "clamp(40px, 5vw, 64px)" }}>
          <p
            className="section-label"
            style={{ marginBottom: 24 }}
          >
            More Projects
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {grid.map((p, i) => (
              <ProjectGridCard key={p.id} project={p} index={i} />
            ))}
          </div>
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
        <SectionHeader
          label="Publications"
          intro="Peer-reviewed work on plasma physics, antimicrobial efficacy, and reaction kinetics, with a working preprint set."
        />

        <p
          className="font-mono"
          style={{
            marginBottom: 24,
            fontSize: 12,
            letterSpacing: "0.06em",
            color: "var(--text-muted)",
          }}
        >
          Google Scholar · {scholarProfile.citations} citations · h-index{" "}
          {scholarProfile.hIndex} · i10-index {scholarProfile.i10Index}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pubs.map((p, i) => (
            <article key={p.title} className="grid-card">
              <a
                href={`https://doi.org/${p.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="grid-card-cover"
                aria-label={`${p.title} (opens DOI in a new tab)`}
              />
              <p
                className="label-mono"
                style={{
                  color: "var(--text-muted)",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {String(i + 1).padStart(2, "0")} · Peer-reviewed
              </p>
              <h3
                style={{
                  marginTop: 12,
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 17,
                  letterSpacing: "-0.005em",
                  color: "var(--text-primary)",
                  lineHeight: 1.28,
                }}
              >
                {p.title}
              </h3>
              <p
                className="font-mono"
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  letterSpacing: "0.04em",
                  color: "var(--text-secondary)",
                }}
              >
                {p.venue} · {p.year}
                {typeof p.citations === "number" ? ` · ${p.citations} citations` : ""}
              </p>
              <span
                className="font-mono"
                style={{
                  marginTop: 16,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  color: "var(--text-muted)",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                doi.org/{p.doi}
                <ArrowOutward size={12} />
              </span>
            </article>
          ))}
        </div>

        <p
          className="section-label"
          style={{ marginTop: "clamp(40px, 5vw, 56px)", marginBottom: 16 }}
        >
          Preprints
        </p>
        <div className="space-y-2">
          {preprints.map((p) => (
            <p
              key={p.title}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15.5,
                lineHeight: 1.55,
              }}
            >
              {p.title}{" "}
              <span style={{ color: "var(--text-muted)" }}>· {p.venue}</span>
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
        <SectionHeader
          label="Awards & Honors"
          intro="Recognition from competitions, fellowships, and platform leaderboards."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {achievements.map((a) => (
            <article key={a.title} className="grid-card">
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
                style={{
                  marginTop: 12,
                  fontFamily: "var(--font-body)",
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  color: "var(--text-secondary)",
                }}
              >
                {a.description}
              </p>
            </article>
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
          {channels.map((row) => {
            const isExternal = row.external || row.href.startsWith("http");
            return (
              <article key={row.label} className="grid-card">
                <a
                  href={row.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="grid-card-cover"
                  aria-label={`${row.label}: ${row.value}${isExternal ? " (opens in a new tab)" : ""}`}
                />
                <p
                  className="label-mono"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {row.label}
                </p>
                <p
                  style={{
                    marginTop: 12,
                    display: "inline-flex",
                    alignItems: "baseline",
                    gap: 8,
                    fontFamily: "var(--font-body)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    wordBreak: "break-word",
                    lineHeight: 1.35,
                  }}
                >
                  {row.value}
                  {isExternal && (
                    <span style={{ color: "var(--text-muted)", display: "inline-flex" }}>
                      <ArrowOutward size={13} />
                    </span>
                  )}
                </p>
              </article>
            );
          })}
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
