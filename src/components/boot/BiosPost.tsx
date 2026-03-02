"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BOOT_CONFIG } from "@/lib/constants";

interface BiosPostProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  "TejasOS BIOS v1.0.28",
  "Copyright (c) 2026 Tejas Naladala. All rights reserved.",
  "",
  "RAM_CHECK",
  "Loading Embedded Systems Modules............ OK",
  "Loading AI Agents........................... OK",
  "Loading Founder Mode........................ OK",
  "Initializing PlasmaX Reactor................ OK",
  "Calibrating Underwater ROV.................. OK",
  "",
  "All systems nominal.",
  "",
  "Press any key to continue or wait for auto-boot...",
];

export default function BiosPost({ onComplete }: BiosPostProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [ramValue, setRamValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const autoBootTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ramTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (autoBootTimerRef.current) clearTimeout(autoBootTimerRef.current);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (ramTimerRef.current) clearInterval(ramTimerRef.current);
  }, []);

  // Skip handler
  const handleSkip = useCallback(() => {
    if (skipped) return;
    setSkipped(true);
    cleanup();

    const finalLines = BOOT_LINES.map((line) => {
      if (line === "RAM_CHECK") {
        return `Checking RAM.............. ${BOOT_CONFIG.ramTarget} MB OK`;
      }
      return line;
    });

    setDisplayedLines(finalLines);
    setRamValue(BOOT_CONFIG.ramTarget);
    setIsComplete(true);
  }, [skipped, cleanup]);

  // Listen for keypress/click to skip
  useEffect(() => {
    const onKey = () => handleSkip();
    const onClick = () => handleSkip();

    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, [handleSkip]);

  // Auto-boot timer after completion
  useEffect(() => {
    if (isComplete) {
      autoBootTimerRef.current = setTimeout(() => {
        onComplete();
      }, 1500);

      return () => {
        if (autoBootTimerRef.current) clearTimeout(autoBootTimerRef.current);
      };
    }
  }, [isComplete, onComplete]);

  // RAM counting animation
  useEffect(() => {
    if (skipped) return;

    const currentLine = BOOT_LINES[currentLineIndex];
    if (currentLine !== "RAM_CHECK") return;

    // Start RAM counting
    const step = 512;
    let current = 0;

    ramTimerRef.current = setInterval(() => {
      current += step;
      if (current >= BOOT_CONFIG.ramTarget) {
        current = BOOT_CONFIG.ramTarget;
        if (ramTimerRef.current) clearInterval(ramTimerRef.current);

        // Finish the RAM line and move on
        setRamValue(BOOT_CONFIG.ramTarget);
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = `Checking RAM.............. ${BOOT_CONFIG.ramTarget} MB OK`;
          return updated;
        });

        // Move to next line
        setTimeout(() => {
          setCurrentLineIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }, 200);
      } else {
        setRamValue(current);
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = `Checking RAM.............. ${current} MB`;
          return updated;
        });
      }
    }, BOOT_CONFIG.ramStepMs);

    return () => {
      if (ramTimerRef.current) clearInterval(ramTimerRef.current);
    };
  }, [currentLineIndex, skipped]);

  // Character-by-character typing
  useEffect(() => {
    if (skipped) return;
    if (currentLineIndex >= BOOT_LINES.length) {
      setIsComplete(true);
      return;
    }

    const currentLine = BOOT_LINES[currentLineIndex];

    // Handle empty lines
    if (currentLine === "") {
      setDisplayedLines((prev) => [...prev, ""]);
      setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, 100);
      return;
    }

    // Handle RAM check line (handled by separate effect)
    if (currentLine === "RAM_CHECK") {
      if (displayedLines.length <= currentLineIndex) {
        setDisplayedLines((prev) => [...prev, "Checking RAM.............. 0 MB"]);
      }
      return;
    }

    // Type characters one at a time
    if (currentCharIndex === 0 && displayedLines.length <= currentLineIndex) {
      setDisplayedLines((prev) => [...prev, ""]);
    }

    if (currentCharIndex < currentLine.length) {
      const jitter =
        BOOT_CONFIG.typeSpeedMs.min +
        Math.random() * (BOOT_CONFIG.typeSpeedMs.max - BOOT_CONFIG.typeSpeedMs.min);

      typingTimerRef.current = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = currentLine.slice(0, currentCharIndex + 1);
          return updated;
        });
        setCurrentCharIndex((prev) => prev + 1);
      }, jitter);

      return () => {
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      };
    } else {
      // Line complete, move to next
      setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, 150);
    }
  }, [currentLineIndex, currentCharIndex, skipped, displayedLines.length]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div className="fixed inset-0 z-50 bg-black p-6 overflow-hidden">
      <div className="font-mono text-sm leading-relaxed">
        {displayedLines.map((line, i) => (
          <div key={i} className="text-accent-green glow-green min-h-[1.5em]">
            {line}
          </div>
        ))}
        {!isComplete && (
          <span className="text-accent-green cursor-blink inline-block w-2 h-4 bg-accent-green ml-0.5" />
        )}
      </div>
    </div>
  );
}
