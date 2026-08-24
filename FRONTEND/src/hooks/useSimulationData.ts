"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  fetchSeaLevelRange,
  fetchSimulationGeoJson,
  fetchSimulationKpis,
} from "@/services/api";
import type { InfrastructureFilters } from "@/types/infrastructure";

export function useSeaLevelRange() {
  return useQuery({
    queryKey: ["sea-level-range"],
    queryFn: fetchSeaLevelRange,
    staleTime: 5 * 60_000,
  });
}

export function useSimulationKpis(seaLevel: number, filters: InfrastructureFilters = {}) {
  return useQuery({
    queryKey: ["simulation-kpis", seaLevel, filters],
    queryFn: () => fetchSimulationKpis(seaLevel, filters),
    placeholderData: keepPreviousData,
  });
}

export function useSimulationGeoJson(
  seaLevel: number,
  filters: InfrastructureFilters = {},
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["simulation-geojson", seaLevel, filters],
    queryFn: () => fetchSimulationGeoJson(seaLevel, filters),
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? true,
  });
}
