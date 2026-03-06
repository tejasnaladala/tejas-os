import { Metadata } from "next";
import PageLayout from "@/components/shared/PageLayout";

export const metadata: Metadata = {
  title: "Blog — Tejas Naladala",
  description:
    "Thoughts on hardware, AI, and building things. Coming soon.",
};

export default function BlogPage() {
  return (
    <PageLayout>
      {/* Header */}
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
          {"> cat blog/index.md"}
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
          Blog
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            marginTop: "12px",
          }}
        >
          Thoughts on hardware, AI, and building things.
        </p>
      </div>

      {/* Empty state */}
      <div
        style={{
          border: "1px solid rgba(0, 212, 255, 0.1)",
          padding: "56px 32px",
          textAlign: "center",
          background: "rgba(0, 212, 255, 0.02)",
        }}
      >
        <p
          className="font-mono"
          style={{
            color: "var(--text-secondary)",
            fontSize: "13px",
          }}
        >
          No posts yet.
        </p>
        <p
          className="font-mono"
          style={{
            color: "var(--text-secondary)",
            fontSize: "11px",
            marginTop: "10px",
          }}
        >
          Check back soon.{" "}
          <span style={{ color: "var(--accent-cyan)" }}>RSS coming.</span>
        </p>
      </div>
    </PageLayout>
  );
}
