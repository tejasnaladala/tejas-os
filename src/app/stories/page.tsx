"use client";

import { useState, useMemo } from "react";
import PageLayout from "@/components/shared/PageLayout";
import { brainTeasers, stories, BrainTeaser } from "@/data/stories";

export default function StoriesPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const teaser: BrainTeaser = useMemo(() => {
    return brainTeasers[Math.floor(Math.random() * brainTeasers.length)];
  }, []);

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
        <div style={{ maxWidth: "600px", margin: "0 auto", paddingTop: "40px" }}>
          <p
            className="font-mono"
            style={{
              color: "var(--accent-green)",
              fontSize: "11px",
              letterSpacing: "3px",
              marginBottom: "12px",
            }}
          >
            {"> sudo cat /restricted/stories"}
          </p>

          <h1
            className="font-mono"
            style={{
              color: "#ff3366",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "2px",
              marginBottom: "8px",
            }}
          >
            ACCESS RESTRICTED
          </h1>

          <p
            style={{
              color: "var(--text-secondary)",
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              marginBottom: "40px",
              lineHeight: 1.7,
            }}
          >
            borderline illegal, for the love of engineering.
            <br />
            solve the puzzle to proceed.
          </p>

          {/* Puzzle card */}
          <div
            style={{
              padding: "24px",
              border: "1px solid rgba(255, 51, 102, 0.15)",
              background: "rgba(255, 51, 102, 0.02)",
              marginBottom: "24px",
            }}
          >
            <p
              className="font-mono"
              style={{
                fontSize: "10px",
                letterSpacing: "3px",
                color: "var(--accent-amber)",
                marginBottom: "16px",
                textTransform: "uppercase",
              }}
            >
              {"// AUTHENTICATION CHALLENGE"}
            </p>
            <p
              className="font-mono"
              style={{
                fontSize: "14px",
                color: "var(--text-primary)",
                lineHeight: 1.8,
              }}
            >
              {teaser.question}
            </p>

            {showHint && (
              <p
                className="font-mono"
                style={{
                  fontSize: "11px",
                  color: "var(--accent-amber)",
                  marginTop: "12px",
                  opacity: 0.7,
                }}
              >
                hint: {teaser.hint}
              </p>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span
                className="font-mono"
                style={{ color: "var(--accent-green)", fontSize: "13px" }}
              >
                {">"}
              </span>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError(false);
                }}
                placeholder="enter answer"
                autoFocus
                className="font-mono"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  borderBottom: `1px solid ${error ? "#ff3366" : "rgba(0, 212, 255, 0.2)"}`,
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  padding: "8px 4px",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                className="font-mono"
                style={{
                  background: "rgba(0, 212, 255, 0.1)",
                  border: "1px solid rgba(0, 212, 255, 0.3)",
                  color: "var(--accent-cyan)",
                  padding: "8px 16px",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  cursor: "pointer",
                }}
              >
                SUBMIT
              </button>
            </div>
          </form>

          {error && (
            <p
              className="font-mono"
              style={{
                color: "#ff3366",
                fontSize: "11px",
                marginTop: "12px",
              }}
            >
              access denied. try again.
            </p>
          )}

          <button
            onClick={() => setShowHint(!showHint)}
            className="font-mono"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-secondary)",
              fontSize: "10px",
              marginTop: "16px",
              cursor: "pointer",
              letterSpacing: "2px",
              padding: 0,
            }}
          >
            {showHint ? "HIDE HINT" : "NEED A HINT?"}
          </button>
        </div>
      </PageLayout>
    );
  }

  // Unlocked view
  return (
    <PageLayout>
      <div style={{ marginBottom: "48px" }}>
        <p
          className="font-mono"
          style={{
            color: "var(--accent-green)",
            fontSize: "11px",
            letterSpacing: "3px",
            marginBottom: "12px",
          }}
        >
          {"> access granted. welcome."}
        </p>
        <h1
          className="font-mono"
          style={{
            color: "var(--text-primary)",
            fontSize: "24px",
            fontWeight: 700,
            letterSpacing: "2px",
            lineHeight: 1.3,
          }}
        >
          borderline illegal, for the love of engineering
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
          stories from the lab, the dorm, and everywhere in between.
          names changed, details slightly exaggerated. you know how it is.
        </p>
      </div>

      {stories.map((story, i) => (
        <div
          key={story.id}
          style={{
            paddingBottom: i === stories.length - 1 ? 0 : "40px",
            borderBottom:
              i === stories.length - 1
                ? "none"
                : "1px solid rgba(0, 212, 255, 0.06)",
            marginBottom: i === stories.length - 1 ? 0 : "40px",
          }}
        >
          <h2
            className="font-mono"
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--accent-cyan)",
              letterSpacing: "1px",
              marginBottom: "16px",
            }}
          >
            {story.title}
          </h2>
          {story.paragraphs.map((p, j) => (
            <p
              key={j}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                color: "var(--text-secondary)",
                lineHeight: 1.8,
                marginBottom: "16px",
                maxWidth: "640px",
              }}
            >
              {p}
            </p>
          ))}
        </div>
      ))}
    </PageLayout>
  );
}
