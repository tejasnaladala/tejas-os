import { Metadata } from "next";
import PageLayout from "@/components/shared/PageLayout";
import { thesisEntries, thesisTagline, ThesisEntry } from "@/data/thesis";

export const metadata: Metadata = {
  title: "Thesis | Tejas Naladala",
  description:
    "Working hypotheses on hardware, engineering, startups, and shipping things.",
};

function ThesisCard({ entry }: { entry: ThesisEntry }) {
  return (
    <article
      className="grid grid-cols-12 gap-6 py-10 md:py-12"
      style={{ borderBottom: "1px solid var(--hairline)" }}
    >
      <div className="col-span-12 md:col-span-2">
        <p
          className="display"
          style={{
            fontSize: "clamp(36px, 4.4vw, 56px)",
            color: "#CC785C",
            lineHeight: 1,
          }}
        >
          {String(entry.number).padStart(2, "0")}
        </p>
      </div>
      <div className="col-span-12 md:col-span-10">
        <h2
          className="display mb-4"
          style={{ fontSize: "clamp(26px, 3vw, 36px)", lineHeight: 1.18 }}
        >
          {entry.title}
        </h2>
        <p
          className="body-md max-w-2xl"
          style={{ fontSize: 16, lineHeight: 1.7 }}
        >
          {entry.body}
        </p>
      </div>
    </article>
  );
}

export default function ThesisPage() {
  return (
    <PageLayout>
      <header className="page-header">
        <p className="eyebrow">Thesis</p>
        <h1 className="display">
          {thesisTagline}
        </h1>
        <p className="body-lg">
          Working hypotheses. Subject to revision upon contact with new data.
        </p>
      </header>

      <div style={{ borderTop: "1px solid var(--hairline)" }}>
        {thesisEntries.map((entry) => (
          <ThesisCard key={entry.number} entry={entry} />
        ))}
      </div>
    </PageLayout>
  );
}
