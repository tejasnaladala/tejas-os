"use client";

import { useOceanStore } from "@/stores/oceanStore";
import { STATIONS } from "@/lib/constants";
import { StationId } from "@/types";

/**
 * Provides discovery-related computed values.
 * - discoveredCount: number of stations discovered
 * - totalStations: total stations (excluding trench for main count)
 * - allMainDiscovered: true if all 5 main stations discovered
 * - isDiscovered: check if a specific station is discovered
 */
export function useDiscovery() {
  const discoveredStations = useOceanStore((s) => s.discoveredStations);

  const mainStations = STATIONS.filter((s) => s.id !== "trench");
  const discoveredCount = mainStations.filter((s) =>
    discoveredStations.has(s.id)
  ).length;
  const totalStations = mainStations.length; // 5
  const allMainDiscovered = discoveredCount >= totalStations;

  const isDiscovered = (id: StationId): boolean => discoveredStations.has(id);

  return {
    discoveredCount,
    totalStations,
    allMainDiscovered,
    isDiscovered,
    discoveredStations,
  };
}
