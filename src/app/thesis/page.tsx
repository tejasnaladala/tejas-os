import { Metadata } from "next";
import PageLayout from "@/components/shared/PageLayout";
import { thesisEntries, ThesisEntry } from "@/data/thesis";

export const metadata: Metadata = {
  title: "Thesis - Tejas Naladala",
  description:
    "Technical philosophy on hardware, engineering, startups, and building real things.",
};

function ThesisCard({ entry, isLast }: { entry: ThesisEntry; isLast: boolean }) {
  const accentColor = {
    cyan: "var(--accent-cyan)",
    green: "var(--accent-green)",
    amber: "var(--accent-amber)",
  }[entry.accent];

  return (
    <div
      style={{
        display: "flex",
        gap: "28px",
        paddingBottom: isLast ? 0 : "40px",
        borderBottom: isLast
          ? "none"
          : "1px solid rgba(0, 212, 255, 0.06)",
        marginBottom: isLast ? 0 : "40px",
      }}
    >
      {/* Number */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "48px",
          fontWeight: 700,
          color: accentColor,
          opacity: 0.2,
          lineHeight: 1,
          minWidth: "56px",
          userSelect: "none",
        }}
      >
        {String(entry.number).padStart(2, "0")}
      </div>

      {/* Content */}
      <div>
        <h2
          className="font-mono"
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "1px",
            marginBottom: "12px",
            lineHeight: 1.4,
          }}
        >
          {entry.title}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            color: "var(--text-secondary)",
            lineHeight: 1.8,
            maxWidth: "640px",
          }}
        >
          {entry.body}
        </p>
      </div>
    </div>
  );
}

export default function ThesisPage() {
  return (
    <PageLayout>
      {/* Header */}
      <div style={{ marginBottom: "56px" }}>
        <p
          className="font-mono"
          style={{
            color: "var(--accent-green)",
            fontSize: "11px",
            letterSpacing: "3px",
            marginBottom: "12px",
          }}
        >
          {"> cat thesis.md"}
        </p>
        <h1
          className="font-mono"
          style={{
            color: "var(--text-primary)",
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "2px",
            lineHeight: 1.2,
          }}
        >
          Things I believe to be true.
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            marginTop: "12px",
            lineHeight: 1.7,
          }}
        >
          Working hypotheses. Subject to revision upon contact with new data.
        </p>
      </div>

      {/* Entries */}
      <div>
        {thesisEntries.map((entry, i) => (
          <ThesisCard
            key={entry.number}
            entry={entry}
            isLast={i === thesisEntries.length - 1}
          />
        ))}
      </div>
    </PageLayout>
  );
}
