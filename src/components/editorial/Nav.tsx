"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Minimalist top bar for sub-pages. The landing handles its own tabs and does
 * not render this Nav. Sub-pages render this so the visitor can always get
 * back home.
 *
 * Audit note: matches the Aayam-style light minimalist aesthetic. Hairline
 * underline only when scrolled.
 */
const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/thesis", label: "Thesis" },
  { href: "/stories", label: "Stories" },
  { href: "/resume", label: "Resume" },
  { href: "/gallery", label: "Gallery" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-200"
      style={{
        background: scrolled ? "rgba(245, 244, 239, 0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(14px) saturate(120%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px) saturate(120%)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--hairline)"
          : "1px solid transparent",
      }}
    >
      <nav
        className="container-wide flex items-center justify-between"
        style={{ height: 64 }}
        aria-label="Primary"
      >
        <Link
          href="/"
          className="label-mono"
          style={{
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-primary)",
          }}
        >
          Tejas Naladala
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="label-mono"
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: active ? "var(--text-primary)" : "var(--text-muted)",
                  borderBottom: active
                    ? "2px solid var(--text-primary)"
                    : "2px solid transparent",
                  paddingBottom: 2,
                  transition: "color 200ms ease, border-color 200ms ease",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <a
          href="mailto:naladala@uw.edu"
          className="btn-secondary"
          style={{ fontSize: 13, padding: "9px 16px" }}
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
