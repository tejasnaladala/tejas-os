"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/thesis", label: "thesis" },
  { href: "/work", label: "work" },
  { href: "/gallery", label: "gallery" },
  { href: "/arcade", label: "arcade" },
  { href: "/stories", label: "stories" },
  { href: "/ocean", label: "ocean" },
];

const SOCIAL_LINKS = [
  { href: SITE_CONFIG.social.linkedin, label: "linkedin" },
  { href: SITE_CONFIG.social.github, label: "github" },
  { href: SITE_CONFIG.social.instagram, label: "instagram" },
];

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="font-mono"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 24px",
        background: "rgba(10, 15, 26, 0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(0, 212, 255, 0.08)",
      }}
    >
      {/* Brand */}
      <Link
        href="/"
        style={{
          color: "var(--accent-cyan)",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "3px",
          textDecoration: "none",
          textShadow: "0 0 12px rgba(0, 212, 255, 0.4)",
          whiteSpace: "nowrap",
        }}
      >
        TEJAS NALADALA
      </Link>

      {/* Page links */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              color: isActive(href)
                ? "var(--accent-cyan)"
                : "var(--text-secondary)",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase" as const,
              textDecoration: "none",
              borderBottom: isActive(href)
                ? "1px solid var(--accent-cyan)"
                : "1px solid transparent",
              paddingBottom: "2px",
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isActive(href)) {
                e.currentTarget.style.color = "var(--accent-cyan)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(href)) {
                e.currentTarget.style.color = "var(--text-secondary)";
              }
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Social + resume */}
      <div
        style={{
          display: "flex",
          gap: "14px",
          alignItems: "center",
        }}
      >
        {SOCIAL_LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--text-secondary)",
              fontSize: "10px",
              letterSpacing: "1.5px",
              textTransform: "uppercase" as const,
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            {label}
          </a>
        ))}
        <Link
          href="/resume"
          style={{
            color: "var(--accent-amber)",
            fontSize: "10px",
            letterSpacing: "1.5px",
            textTransform: "uppercase" as const,
            textDecoration: "none",
            border: "1px solid rgba(255, 176, 0, 0.3)",
            padding: "3px 10px",
            transition: "background 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 176, 0, 0.1)";
            e.currentTarget.style.borderColor = "rgba(255, 176, 0, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(255, 176, 0, 0.3)";
          }}
        >
          resume
        </Link>
      </div>
    </nav>
  );
}
