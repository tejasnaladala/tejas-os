"use client";
import { useRef, useEffect, useCallback } from "react";

export function useGameLoop(callback: (deltaTime: number) => void, running: boolean) {
  const callbackRef = useRef(callback);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  callbackRef.current = callback;

  const loop = useCallback((time: number) => {
    const delta = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 0;
    lastTimeRef.current = time;
    callbackRef.current(Math.min(delta, 0.1));
    frameRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (running) {
      lastTimeRef.current = 0;
      frameRef.current = requestAnimationFrame(loop);
    }
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [running, loop]);
}
