"use client";

import { motion } from "framer-motion";
import Navigation from "./Navigation";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}

export default function PageLayout({ children, className, wide }: PageLayoutProps) {
  return (
    <div
      className={`crt-page min-h-screen ${className ?? ""}`}
      style={{
        background: "var(--bg-panel)",
        color: "var(--text-primary)",
      }}
    >
      <Navigation />
      <motion.main
        id="main-content"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          maxWidth: wide ? "1100px" : "860px",
          margin: "0 auto",
          padding: "48px 24px 96px",
        }}
      >
        {children}
      </motion.main>
    </div>
  );
}
