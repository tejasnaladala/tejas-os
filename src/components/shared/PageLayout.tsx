"use client";

import Nav from "@/components/editorial/Nav";
import SiteFooter from "@/components/editorial/SiteFooter";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}

/**
 * Editorial page wrapper used by all sub-pages (work, stories, thesis, resume,
 * gallery). Inherits the new Nav and SiteFooter so the brand language stays
 * consistent across the site.
 */
export default function PageLayout({ children, className, wide }: PageLayoutProps) {
  return (
    <div
      className={className}
      style={{
        background: "var(--bg)",
        color: "var(--text-primary)",
        minHeight: "100vh",
      }}
    >
      <Nav />
      <main
        id="main-content"
        className="container-wide"
        style={{
          maxWidth: wide ? "1180px" : "880px",
          paddingTop: "var(--page-top)",
          paddingBottom: "var(--page-bottom)",
        }}
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
