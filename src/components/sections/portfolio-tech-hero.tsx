"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Cpu,
  CircuitBoard,
  BrainCircuit,
  RadioTower,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Technical-identity hero card. Sits below the profile tabs as a "what I
 * actually build" beat - circuits, agents, plasma, signal traces.
 *
 * Spacing overhaul (post-iteration):
 *   - The two-column grid only kicks in at >= 1200px (xl). At lg the card
 *     stacks: copy on top, circuit visual below. The previous lg-2col layout
 *     forced the headline to wrap into 4 mono-style lines that felt cramped
 *     against the visual on the right.
 *   - Headline scaled down to clamp(24px, 34px). Reads as a confident sentence,
 *     not a hero billboard fighting the nameplate above it.
 *   - Inner padding scales smoothly from 24px (mobile) to 64px (xl).
 *   - Sub-stack vertical rhythm uses 32px between major blocks instead of
 *     mt-10 / mt-12 mixed values.
 *   - Label chips are full-width 4-up at xl, 2-up at sm, 1-up on phones.
 */

type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  className?: string;
};

const technicalLabels = [
  { label: "AI Agents", icon: BrainCircuit },
  { label: "Embedded Systems", icon: Cpu },
  { label: "Plasma Hardware", icon: CircuitBoard },
  { label: "Autonomous Research", icon: RadioTower },
];

/**
 * Terminal-style status panel that fills the right column under the circuit
 * visual. Mono key/value pairs with a blinking cursor and an animated signal
 * waveform across the bottom - feels like a small system telemetry readout
 * rather than empty white space.
 */
function SystemStatus() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        border: "1px solid var(--hairline)",
        background:
          "linear-gradient(180deg, rgba(245,244,239,0.5) 0%, rgba(240,239,233,0.65) 100%)",
        padding: "20px 22px 0",
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.22em",
            color: "var(--text-muted)",
          }}
        >
          System status
        </span>
        <span
          className="flex items-center gap-2 font-mono uppercase"
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            color: "var(--text-muted)",
          }}
        >
          <motion.span
            aria-hidden="true"
            className="inline-block rounded-full"
            style={{ width: 6, height: 6, background: "#2f7a3a" }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          online
        </span>
      </div>

      <ul
        className="space-y-2.5"
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: 12,
          color: "var(--text-secondary)",
        }}
      >
        {[
          ["sys", "PlasmaX-prod-01"],
          ["deploy", "shipping units"],
          ["papers", "3 peer-reviewed"],
          ["patent", "1 filed"],
          ["raised", "$2M institutional"],
        ].map(([k, v]) => (
          <li key={k} className="flex items-baseline gap-3">
            <span
              style={{
                color: "var(--text-muted)",
                width: 64,
                flexShrink: 0,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: 10,
              }}
            >
              {k}
            </span>
            <span style={{ color: "var(--text-primary)" }}>{v}</span>
          </li>
        ))}
        <li className="flex items-baseline gap-3">
          <span
            style={{
              color: "var(--text-muted)",
              width: 64,
              flexShrink: 0,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: 10,
            }}
          >
            now
          </span>
          <span style={{ color: "#CC785C" }}>
            shipping{" "}
            <motion.span
              aria-hidden="true"
              className="inline-block"
              style={{
                width: 8,
                height: 13,
                background: "#CC785C",
                marginLeft: 2,
                verticalAlign: "-2px",
              }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.05, repeat: Infinity }}
            />
          </span>
        </li>
      </ul>

      {/* Animated signal trace at the bottom */}
      <svg
        viewBox="0 0 400 40"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{
          display: "block",
          width: "100%",
          height: 36,
          marginTop: 18,
          opacity: 0.6,
        }}
      >
        <motion.path
          d="M0 20 Q 25 4, 50 20 T 100 20 T 150 20 T 200 20 T 250 20 T 300 20 T 350 20 T 400 20"
          stroke="#CC785C"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, x: [0, -50] }}
          transition={{
            pathLength: { duration: 1.4, ease: "easeOut" },
            x: { duration: 6, repeat: Infinity, ease: "linear" },
          }}
        />
        <motion.path
          d="M0 28 Q 16 18, 32 28 T 64 28 T 96 28 T 128 28 T 160 28 T 192 28 T 224 28 T 256 28 T 288 28 T 320 28 T 352 28 T 384 28 T 416 28"
          stroke="rgba(10,10,10,0.35)"
          strokeWidth="0.75"
          fill="none"
          animate={{ x: [0, -32] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
}

function CircuitVisual() {
  return (
    <div
      className="relative h-full min-h-[300px] w-full overflow-hidden rounded-2xl"
      style={{
        border: "1px solid var(--hairline)",
        background:
          "linear-gradient(180deg, rgba(245,244,239,0.4) 0%, rgba(240,239,233,0.6) 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,10,10,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,10,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(204,120,92,0.18), transparent 55%)",
        }}
      />

      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl"
        style={{
          width: 120,
          height: 120,
          border: "1px solid rgba(204,120,92,0.55)",
          background: "rgba(204,120,92,0.06)",
          boxShadow: "0 0 80px rgba(204,120,92,0.18)",
        }}
      >
        <div
          className="absolute inset-3 rounded-md"
          style={{ border: "1px dashed rgba(10,10,10,0.18)" }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.16em]"
          style={{ color: "var(--text-muted)" }}
        >
          NLD-01
        </div>
      </div>

      {[
        { left: "20%", top: "30%", c: "#CC785C" },
        { right: "24%", top: "38%", c: "#0a0a0a" },
        { bottom: "28%", left: "34%", c: "#CC785C" },
        { bottom: "34%", right: "30%", c: "#0a0a0a" },
      ].map((n, i) => (
        <div
          key={i}
          className="absolute h-2 w-2 rounded-full"
          style={{
            ...n,
            background: n.c,
            boxShadow: `0 0 18px ${
              n.c === "#CC785C" ? "rgba(204,120,92,0.7)" : "rgba(10,10,10,0.6)"
            }`,
          }}
        />
      ))}

      <motion.div
        className="absolute h-px w-[60%]"
        style={{
          left: "20%",
          top: "30%",
          background:
            "linear-gradient(to right, transparent, rgba(204,120,92,0.65), transparent)",
        }}
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
      <motion.div
        className="absolute h-px w-[40%]"
        style={{
          left: "34%",
          top: "65%",
          background:
            "linear-gradient(to right, transparent, rgba(10,10,10,0.45), transparent)",
        }}
        animate={{ opacity: [0.15, 0.7, 0.15] }}
        transition={{ duration: 3.2, repeat: Infinity }}
      />
      <motion.div
        className="absolute h-px w-[50%]"
        style={{
          right: "10%",
          top: "50%",
          background:
            "linear-gradient(to right, transparent, rgba(204,120,92,0.5), transparent)",
        }}
        animate={{ opacity: [0.1, 0.7, 0.1] }}
        transition={{ duration: 4.0, repeat: Infinity }}
      />

      <div
        className="pointer-events-none absolute rounded-full font-mono uppercase"
        style={{
          left: 24,
          top: 24,
          padding: "6px 14px",
          fontSize: 10,
          letterSpacing: "0.24em",
          color: "var(--text-muted)",
          border: "1px solid var(--hairline)",
          background: "rgba(245,244,239,0.7)",
          backdropFilter: "blur(4px)",
        }}
      >
        Live system
      </div>
      <div
        className="pointer-events-none absolute rounded-full font-mono"
        style={{
          right: 24,
          bottom: 24,
          padding: "6px 14px",
          fontSize: 10,
          letterSpacing: "0.04em",
          color: "var(--text-muted)",
          border: "1px solid var(--hairline)",
          background: "rgba(245,244,239,0.7)",
          backdropFilter: "blur(4px)",
        }}
      >
        agents / signals / hardware
      </div>
    </div>
  );
}

export function PortfolioTechHero({
  eyebrow = "AI / ELECTRONICS / AGENTS / RESEARCH",
  title = "I build intelligent systems across software, hardware, and autonomous agents.",
  subtitle = "My work sits at the edge of AI research, embedded systems, plasma hardware, agentic software, and startup execution. I prototype fast, test aggressively, and turn raw technical ideas into working systems.",
  primaryCta = { label: "View projects", href: "/work" },
  secondaryCta = { label: "Read my work", href: "/thesis" },
  className,
}: Props) {
  return (
    <section
      className={cn("relative w-full", className)}
      style={{
        color: "var(--text-primary)",
        paddingTop: 128,
        paddingBottom: 128,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(204,120,92,0.4), transparent)",
        }}
      />

      <div className="container-wide">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            border: "1px solid var(--hairline)",
            background: "rgba(245,244,239,0.62)",
            backdropFilter: "blur(6px)",
            boxShadow:
              "0 1px 0 rgba(0,0,0,0.03), 0 24px 48px -24px rgba(91,42,24,0.18)",
          }}
        >
          {/* Stack on lg, only split at xl. Padding scales generously so the
              card never feels jammed against its border. */}
          <div
            className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(420px,520px)]"
            style={{
              padding: "clamp(32px, 6vw, 88px)",
              columnGap: "clamp(40px, 5vw, 80px)",
              rowGap: "clamp(56px, 7vw, 88px)",
              minHeight: 480,
              alignItems: "center",
            }}
          >
            {/* LEFT: copy column. Generous internal vertical rhythm. */}
            <div className="relative z-10">
              <p
                className="eyebrow"
                style={{ color: "var(--text-muted)", marginBottom: 24 }}
              >
                {eyebrow}
              </p>
              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08 }}
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: "clamp(26px, 3vw, 38px)",
                  lineHeight: 1.22,
                  letterSpacing: "-0.012em",
                  maxWidth: "30ch",
                }}
              >
                {title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.16 }}
                className="body-md"
                style={{
                  marginTop: 40,
                  color: "var(--text-secondary)",
                  maxWidth: "60ch",
                  fontSize: 16,
                  lineHeight: 1.78,
                }}
              >
                {subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.24 }}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
                style={{ marginTop: 56 }}
              >
                <a href={primaryCta.href} className="btn-primary group">
                  {primaryCta.label}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a href={secondaryCta.href} className="btn-secondary">
                  {secondaryCta.label}
                </a>
              </motion.div>

              {/* Icon stacked above label so the label gets the full chip
                  width on its own row. nowrap was bleeding "AUTONOMOUS
                  RESEARCH" past the right border. Stacked layout + 2-up
                  grid gives each label about 250-300px of comfortable measure. */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.32 }}
                className="grid grid-cols-1 sm:grid-cols-2"
                style={{ marginTop: 72, gap: 16 }}
              >
                {technicalLabels.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-xl"
                      style={{
                        padding: "20px 22px",
                        minHeight: 96,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: 14,
                        border: "1px solid var(--hairline)",
                        background: "rgba(245,244,239,0.55)",
                        color: "var(--text-secondary)",
                        overflow: "hidden",
                      }}
                    >
                      <Icon
                        className="h-5 w-5 flex-shrink-0"
                        style={{ color: "#CC785C" }}
                      />
                      <span
                        className="font-mono uppercase block"
                        style={{
                          fontSize: 12,
                          letterSpacing: "0.12em",
                          color: "var(--text-primary)",
                          lineHeight: 1.35,
                          // `normal` instead of `break-word` so AUTONOMOUS
                          // wraps at the space, not mid-word
                          wordBreak: "normal",
                          overflowWrap: "normal",
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* RIGHT: circuit visual stacked over a system-status terminal
                panel. The status panel fills the empty space the right
                column had before. */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.18 }}
              className="relative flex flex-col"
              style={{ gap: 20, minHeight: 360 }}
            >
              <div className="relative" style={{ minHeight: 320 }}>
                <CircuitVisual />
              </div>
              <SystemStatus />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
