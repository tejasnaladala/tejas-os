"use client";

import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        borderTop: "1px solid var(--hairline)",
        padding: "40px 0 48px",
      }}
    >
      <div className="container-wide">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              className="label-mono"
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Tejas Naladala
            </p>
            <p className="body-sm mt-2" style={{ fontSize: 14 }}>
              Seattle, WA &middot; Open to interesting things.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            {[
              { href: "/work", label: "Work" },
              { href: "/thesis", label: "Thesis" },
              { href: "/stories", label: "Stories" },
              { href: "/resume", label: "Resume" },
              { href: "/gallery", label: "Gallery" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="label-mono"
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  transition: "color 200ms ease",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          className="mt-8 flex flex-col gap-2 pt-5 sm:flex-row sm:justify-between"
          style={{
            borderTop: "1px solid var(--hairline)",
            color: "var(--text-muted)",
            fontSize: 12,
          }}
        >
          <p>&copy; {year} Tejas Naladala.</p>
          <p>
            Built in Next.js.{" "}
            <span style={{ color: "var(--text-faint)" }}>v3.0 Profile</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
