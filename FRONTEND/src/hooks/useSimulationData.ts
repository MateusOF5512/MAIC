"use client";

import { useQuery } from "@tanstack/react-query";

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
  });
}

export function useSimulationKpis(seaLevel: number, filters: InfrastructureFilters = {}) {
  return useQuery({
    queryKey: ["simulation-kpis", seaLevel, filters],
    queryFn: () => fetchSimulationKpis(seaLevel, filters),
  });
}

export function useSimulationGeoJson(seaLevel: number, filters: InfrastructureFilters = {}) {
  return useQuery({
    queryKey: ["simulation-geojson", seaLevel, filters],
    queryFn: () => fetchSimulationGeoJson(seaLevel, filters),
  });
}
