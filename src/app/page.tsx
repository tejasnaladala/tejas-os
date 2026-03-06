import Link from "next/link";
import PageLayout from "@/components/shared/PageLayout";
import { bio } from "@/data/bio";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";

const ASCII_TEJAS = `████████╗███████╗     ██╗ █████╗ ███████╗
╚══██╔══╝██╔════╝     ██║██╔══██╗██╔════╝
   ██║   █████╗       ██║███████║███████╗
   ██║   ██╔══╝  ██   ██║██╔══██║╚════██║
   ██║   ███████╗╚█████╔╝██║  ██║███████║
   ╚═╝   ╚══════╝ ╚════╝ ╚═╝  ╚═╝╚══════╝`;

const ASCII_NALADALA = `███╗   ██╗ █████╗ ██╗      █████╗ ██████╗  █████╗ ██╗      █████╗
████╗  ██║██╔══██╗██║     ██╔══██╗██╔══██╗██╔══██╗██║     ██╔══██╗
██╔██╗ ██║███████║██║     ███████║██║  ██║███████║██║     ███████║
██║╚██╗██║██╔══██║██║     ██╔══██║██║  ██║██╔══██║██║     ██╔══██║
██║ ╚████║██║  ██║███████╗██║  ██║██████╔╝██║  ██║███████╗██║  ██║
╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝`;

const NAV_ITEMS = [
  { href: "/thesis", label: "THESIS", color: "var(--accent-cyan)" },
  { href: "/work", label: "WORK", color: "var(--accent-green)" },
  { href: "/gallery", label: "GALLERY", color: "var(--accent-amber)" },
  { href: "/arcade", label: "ARCADE", color: "var(--accent-red)" },
  { href: "/ocean", label: "OCEAN", color: "var(--accent-cyan)" },
];

export default function Home() {
  return (
    <PageLayout>
      {/* Visually hidden but crawlable structured content for SEO + screen readers */}
      <div
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: 0,
        }}
        aria-label="Portfolio content"
      >
        <h1>Tejas Naladala - Hardware Engineer, AI Builder, Startup Founder</h1>
        <p>{bio.tagline}</p>
        <p>{bio.full}</p>

        <h2>Projects</h2>
        {projects.map((p) => (
          <article key={p.id}>
            <h3>{p.title}</h3>
            <p>{p.role} | {p.date}</p>
            <p>{p.description}</p>
            <ul>
              {p.metrics.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
            <p>Technologies: {p.tech.join(", ")}</p>
          </article>
        ))}

        <h2>Skills</h2>
        {skillCategories.map((cat) => (
          <section key={cat.name}>
            <h3>{cat.name}</h3>
            <ul>
              {cat.skills.map((s) => (
                <li key={s.name}>
                  {s.name} - {s.level}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* ASCII Art Name */}
      <div
        style={{
          marginTop: "16px",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        {/* Desktop: ASCII art */}
        <div
          className="hidden md:block"
          style={{
            overflowX: "auto",
            padding: "8px 0",
          }}
        >
          <pre
            className="font-mono glow-cyan"
            style={{
              fontSize: "12px",
              lineHeight: "18px",
              letterSpacing: "2px",
              color: "var(--accent-cyan)",
              display: "inline-block",
              textAlign: "left",
              animation: "crt-flicker 8s ease-in-out infinite",
            }}
          >
            {ASCII_TEJAS}
          </pre>
          <div style={{ height: "8px" }} />
          <pre
            className="font-mono glow-cyan"
            style={{
              fontSize: "12px",
              lineHeight: "18px",
              letterSpacing: "2px",
              color: "var(--accent-cyan)",
              display: "inline-block",
              textAlign: "left",
              animation: "crt-flicker 8s ease-in-out infinite",
            }}
          >
            {ASCII_NALADALA}
          </pre>
        </div>

        {/* Mobile: plain text */}
        <h1
          className="block md:hidden font-mono"
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "var(--accent-cyan)",
            letterSpacing: "4px",
            textShadow: "0 0 20px rgba(0, 212, 255, 0.4)",
          }}
        >
          TEJAS NALADALA
        </h1>
      </div>

      {/* Subtitle */}
      <p
        className="font-mono"
        style={{
          textAlign: "center",
          color: "var(--text-secondary)",
          fontSize: "12px",
          letterSpacing: "4px",
          textTransform: "uppercase",
          marginBottom: "48px",
        }}
      >
        Hardware Engineer &middot; AI Builder &middot; Startup Founder
      </p>

      {/* Terminal status block */}
      <div
        style={{
          maxWidth: "520px",
          margin: "0 auto 48px",
          padding: "20px 24px",
          background: "rgba(0, 212, 255, 0.02)",
          border: "1px solid rgba(0, 212, 255, 0.08)",
        }}
      >
        <div className="font-mono" style={{ fontSize: "12px", lineHeight: 2 }}>
          <p>
            <span style={{ color: "var(--accent-green)" }}>{">"}</span>{" "}
            <span style={{ color: "var(--text-secondary)" }}>whoami</span>
          </p>
          <p style={{ color: "var(--text-primary)", paddingLeft: "16px" }}>
            tejas. founder, engineer, ships hardware and AI systems
          </p>
          <p style={{ marginTop: "8px" }}>
            <span style={{ color: "var(--accent-green)" }}>{">"}</span>{" "}
            <span style={{ color: "var(--text-secondary)" }}>status</span>
          </p>
          <p style={{ color: "var(--text-primary)", paddingLeft: "16px" }}>
            3 active ventures &middot; 3 papers &middot; $2M raised &middot; Lavin Fellow
          </p>
          <p style={{ marginTop: "8px" }}>
            <span style={{ color: "var(--accent-green)" }}>{">"}</span>{" "}
            <span className="cursor-blink" style={{ color: "var(--accent-cyan)" }}>_</span>
          </p>
        </div>
      </div>

      {/* Quick nav links */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        {NAV_ITEMS.map(({ href, label, color }) => (
          <Link
            key={href}
            href={href}
            className="font-mono"
            style={{
              fontSize: "11px",
              letterSpacing: "3px",
              color,
              border: `1px solid ${color}33`,
              padding: "8px 20px",
              textDecoration: "none",
              transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
            }}
          >
            {"[ "}{label}{" ]"}
          </Link>
        ))}
      </div>

      {/* Vital Signs - sidelined compact strip */}
      <div
        className="font-mono"
        style={{
          maxWidth: "600px",
          margin: "0 auto 32px",
          padding: "10px 16px",
          fontSize: "10px",
          letterSpacing: "1px",
          color: "var(--text-secondary)",
          borderTop: "1px solid rgba(0, 255, 136, 0.06)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "6px 20px",
        }}
      >
        <span><span style={{ color: "var(--accent-green)", opacity: 0.6 }}>TRAINING</span> 6d/wk PPL</span>
        <span><span style={{ color: "var(--accent-green)", opacity: 0.6 }}>MACROS</span> 2800cal/180g</span>
        <span><span style={{ color: "var(--accent-green)", opacity: 0.6 }}>SIDE_QUEST</span> beatboxer</span>
      </div>
    </PageLayout>
  );
}
