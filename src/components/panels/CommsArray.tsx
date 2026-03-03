"use client";

import { SITE_CONFIG } from "@/lib/constants";

export default function CommsArray() {
  return (
    <div className="space-y-6">
      <h3 className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--accent-cyan)" }}>
        Transmission Hub
      </h3>
      <p className="font-mono text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        Open a communication channel. All frequencies are monitored.
      </p>

      <div className="space-y-3">
        {/* Email */}
        <a
          href={`mailto:${SITE_CONFIG.email}`}
          className="flex items-center gap-3 p-3 rounded-sm transition-all duration-200 no-underline"
          style={{
            background: "rgba(0, 212, 255, 0.03)",
            border: "1px solid rgba(0, 212, 255, 0.1)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0, 212, 255, 0.3)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(0, 212, 255, 0.1)";
          }}
        >
          <span className="text-lg" role="img" aria-label="email">&#x1F4E7;</span>
          <div>
            <div className="font-mono text-[11px] font-bold" style={{ color: "var(--text-primary)" }}>
              Email
            </div>
            <div className="font-mono text-[10px]" style={{ color: "var(--accent-cyan)" }}>
              {SITE_CONFIG.email}
            </div>
          </div>
        </a>

        {/* Social links */}
        {Object.entries(SITE_CONFIG.social).map(([platform, url]) => (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-sm transition-all duration-200 no-underline"
            style={{
              background: "rgba(0, 212, 255, 0.03)",
              border: "1px solid rgba(0, 212, 255, 0.1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(0, 212, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(0, 212, 255, 0.1)";
            }}
          >
            <span className="text-lg" role="img" aria-label={platform}>
              {platform === "github" ? "\uD83D\uDC19" : platform === "linkedin" ? "\uD83D\uDCBC" : "\uD83D\uDCF8"}
            </span>
            <div>
              <div className="font-mono text-[11px] font-bold capitalize" style={{ color: "var(--text-primary)" }}>
                {platform}
              </div>
              <div className="font-mono text-[10px]" style={{ color: "var(--accent-cyan)" }}>
                {url.replace("https://", "")}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Resume link */}
      <div className="pt-2">
        <a
          href="/resume"
          className="font-mono text-[11px] tracking-wider uppercase inline-block"
          style={{ color: "var(--accent-amber)" }}
        >
          &#x1F4C4; View Full Resume &rarr;
        </a>
      </div>
    </div>
  );
}
