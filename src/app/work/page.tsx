import { Metadata } from "next";
import PageLayout from "@/components/shared/PageLayout";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work - Tejas Naladala",
  description:
    "Companies founded, research conducted, and projects shipped.",
};

const founded = projects.filter((p) => p.role.includes("Founder"));
const research = projects.filter((p) =>
  ["seal-lab", "niist"].includes(p.id)
);
const openSource = projects.filter((p) => p.id === "forge");

const TEJAS_OS = {
  title: "TejasOS - This Portfolio",
  role: "Creator",
  date: "Mar 2026",
  description:
    "CRT-styled developer portfolio with an embedded underwater ROV game, 6 arcade mini-games, and retro terminal aesthetic.",
  metrics: ["Next.js 16 + React 19, Zustand, Framer Motion"],
  tech: ["Next.js", "React 19", "TypeScript", "Framer Motion", "Zustand"],
  links: [{ label: "GitHub", url: "https://github.com/tejasnaladala/tejas-os" }],
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-mono"
      style={{
        color: "var(--accent-amber)",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "4px",
        textTransform: "uppercase",
        marginBottom: "24px",
        marginTop: "48px",
      }}
    >
      {"// "}{children}
    </h2>
  );
}

interface WorkEntryProps {
  title: string;
  role: string;
  date: string;
  description: string;
  metrics?: string[];
  tech: string[];
  links?: { label: string; url: string }[];
  isLast?: boolean;
}

function WorkEntry({
  title,
  role,
  date,
  description,
  metrics,
  tech,
  links,
  isLast,
}: WorkEntryProps) {
  const firstSentence = description.match(/^[^.!?]+[.!?]/)?.[0] || description;
  const titleLink = links?.[0]?.url;

  return (
    <div
      style={{
        paddingBottom: isLast ? 0 : "28px",
        borderBottom: isLast
          ? "none"
          : "1px solid rgba(0, 212, 255, 0.04)",
        marginBottom: isLast ? 0 : "28px",
      }}
    >
      {/* Title row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "16px",
          marginBottom: "4px",
        }}
      >
        <div>
          {titleLink ? (
            <a
              href={titleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono"
              style={{
                color: "var(--text-primary)",
                fontSize: "15px",
                fontWeight: 700,
                textDecoration: "none",
                borderBottom: "1px solid rgba(200, 214, 229, 0.2)",
                transition: "border-color 0.2s",
              }}
            >
              {title}
            </a>
          ) : (
            <span
              className="font-mono"
              style={{
                color: "var(--text-primary)",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              {title}
            </span>
          )}
          <span
            className="font-mono"
            style={{
              color: "var(--accent-cyan)",
              fontSize: "11px",
              marginLeft: "10px",
            }}
          >
            {role}
          </span>
        </div>
        <span
          className="font-mono"
          style={{
            color: "var(--text-secondary)",
            fontSize: "11px",
            whiteSpace: "nowrap",
          }}
        >
          {date}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "13px",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
          marginTop: "6px",
        }}
      >
        {firstSentence}
      </p>

      {/* Key metric */}
      {metrics && metrics[0] && (
        <p
          className="font-mono"
          style={{
            fontSize: "11px",
            color: "var(--accent-green)",
            marginTop: "8px",
          }}
        >
          {"▸ "}{metrics[0]}
        </p>
      )}

      {/* Tech tags */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          marginTop: "10px",
        }}
      >
        {tech.map((t) => (
          <span
            key={t}
            className="font-mono"
            style={{
              fontSize: "9px",
              letterSpacing: "1px",
              color: "var(--text-secondary)",
              border: "1px solid rgba(0, 212, 255, 0.1)",
              padding: "2px 8px",
              textTransform: "uppercase",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function WorkPage() {
  return (
    <PageLayout>
      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <p
          className="font-mono"
          style={{
            color: "var(--accent-green)",
            fontSize: "11px",
            letterSpacing: "3px",
            marginBottom: "12px",
          }}
        >
          {"> ls work/"}
        </p>
        <h1
          className="font-mono"
          style={{
            color: "var(--text-primary)",
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "2px",
          }}
        >
          {"What I've built."}
        </h1>
      </div>

      {/* Companies I Built */}
      <SectionTitle>Companies I Built</SectionTitle>
      <div>
        {founded.map((p, i) => (
          <WorkEntry
            key={p.id}
            title={p.title}
            role={p.role}
            date={p.date}
            description={p.description}
            metrics={p.metrics}
            tech={p.tech}
            links={p.links}
            isLast={i === founded.length - 1}
          />
        ))}
      </div>

      {/* Research */}
      <SectionTitle>Research</SectionTitle>
      <div>
        {research.map((p, i) => (
          <WorkEntry
            key={p.id}
            title={p.title}
            role={p.role}
            date={p.date}
            description={p.description}
            metrics={p.metrics}
            tech={p.tech}
            links={p.links}
            isLast={i === research.length - 1}
          />
        ))}
      </div>

      {/* Open Source */}
      <SectionTitle>Open Source &amp; Side Projects</SectionTitle>
      <div>
        {openSource.map((p) => (
          <WorkEntry
            key={p.id}
            title={p.title}
            role={p.role}
            date={p.date}
            description={p.description}
            metrics={p.metrics}
            tech={p.tech}
            links={p.links}
          />
        ))}
        <WorkEntry
          title={TEJAS_OS.title}
          role={TEJAS_OS.role}
          date={TEJAS_OS.date}
          description={TEJAS_OS.description}
          metrics={TEJAS_OS.metrics}
          tech={TEJAS_OS.tech}
          links={TEJAS_OS.links}
          isLast
        />
      </div>
    </PageLayout>
  );
}
