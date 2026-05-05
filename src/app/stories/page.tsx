"use client";

import { useState } from "react";
import PageLayout from "@/components/shared/PageLayout";
import { brainTeasers, stories, BrainTeaser } from "@/data/stories";

/**
 * Editorial gate panel for stories. Restraint over neon, the gate is now a
 * single hairline card, the warning is set in the display serif, and the form
 * uses the same styled inputs as ContactCTA.
 */
export default function StoriesPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const teaser: BrainTeaser = brainTeasers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = inputValue.trim().toLowerCase();
    if (normalized === teaser.answer) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setInputValue("");
    }
  };

  if (!unlocked) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-xl">
          <p className="eyebrow" style={{ marginBottom: 16 }}>Restricted</p>
          <h1
            className="display"
            style={{ fontSize: "clamp(44px, 6.4vw, 80px)", lineHeight: 1.05 }}
          >
            <em>Access</em><br />required.
          </h1>
          <p className="body-lg mt-5" style={{ fontSize: "clamp(17px, 1.6vw, 20px)" }}>
            Borderline illegal, for the love of engineering. Solve the puzzle to
            proceed.
          </p>

          <div
            className="mt-10"
            style={{
              border: "1px solid var(--hairline-strong)",
              borderRadius: "var(--radius-md)",
              background: "var(--surface)",
              padding: "clamp(24px, 3vw, 32px)",
            }}
          >
            <p
              className="eyebrow mb-3"
              style={{ color: "#CC785C" }}
            >
              Authentication challenge
            </p>
            <p className="body-md" style={{ color: "var(--text-primary)", fontSize: 16, lineHeight: 1.6 }}>
              {teaser.question}
            </p>
            {showHint && (
              <p
                className="body-sm mt-4"
                style={{ color: "#CC785C", opacity: 0.9 }}
              >
                Hint: {teaser.hint}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError(false);
                }}
                placeholder="Enter answer"
                autoFocus
                className="flex-1 bg-transparent outline-none"
                style={{
                  border: `1px solid ${error ? "#d49494" : "var(--hairline-strong)"}`,
                  borderRadius: "var(--radius-sm)",
                  padding: "11px 14px",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                }}
              />
              <button type="submit" className="btn-primary">
                Submit
              </button>
            </div>
          </form>

          {error && (
            <p
              className="body-sm mt-3"
              style={{ color: "#d49494" }}
            >
              Access denied. Try again.
            </p>
          )}

          <button
            onClick={() => setShowHint(!showHint)}
            className="btn-ghost mt-4"
          >
            {showHint ? "Hide hint" : "Need a hint?"}
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <header className="page-header">
        <p className="eyebrow">Field notes</p>
        <h1 className="display">
          Borderline <em>illegal,</em><br />for the love of <em>engineering.</em>
        </h1>
        <p className="body-lg">
          Stories from the lab, the dorm, and everywhere in between. Names
          changed, details slightly exaggerated. You know how it is.
        </p>
      </header>

      <div className="space-y-12">
        {stories.map((story, i) => (
          <article key={story.id}>
            <header className="mb-5 flex items-baseline gap-4">
              <span
                className="font-mono"
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#CC785C",
                }}
              >
                {String(i + 1).padStart(2, "0")} ·
              </span>
              <h2
                className="display"
                style={{ fontSize: "clamp(26px, 3.2vw, 36px)", lineHeight: 1.15 }}
              >
                {story.title}
              </h2>
            </header>
            <div className="space-y-4 max-w-[640px]">
              {story.paragraphs.map((p, j) => (
                <p
                  key={j}
                  className="body-md"
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: 16,
                    lineHeight: 1.7,
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
            {i < stories.length - 1 && (
              <div className="divider-hair mt-10" />
            )}
          </article>
        ))}
      </div>
    </PageLayout>
  );
}
