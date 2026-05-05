"use client";

import { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

/**
 * Lazy-loaded Spline scene wrapper. Used as ambient 3D for the landing.
 * Falls back to a neutral cream rectangle while the runtime warms up.
 */
export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className={`flex h-full w-full items-center justify-center ${className ?? ""}`}>
          <div className="h-2 w-24 animate-pulse bg-[var(--hairline)]" />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
