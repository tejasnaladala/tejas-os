"use client";

import { useEffect } from "react";
import { useWindowStore } from "@/stores/windowStore";

export function useKeyboardNav() {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl+` (backtick/backquote) - open terminal
      if (e.ctrlKey && (e.key === "`" || e.key === "~" || e.code === "Backquote")) {
        e.preventDefault();
        useWindowStore.getState().openWindow("terminal");
        return;
      }

      // Escape - close active window
      if (e.key === "Escape") {
        const activeWindowId = useWindowStore.getState().activeWindowId;
        if (activeWindowId) {
          e.preventDefault();
          useWindowStore.getState().closeWindow(activeWindowId);
        }
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
