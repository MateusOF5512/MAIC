"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  fetchAltitudeRange,
  fetchDashboardCharts,
  fetchFilterOptions,
  fetchGeoJson,
  fetchInfrastructures,
  fetchKpis,
} from "@/services/api";
import type { InfrastructureFilters } from "@/types/infrastructure";

export function useKpis(filters: InfrastructureFilters) {
  return useQuery({
    queryKey: ["kpis", filters],
    queryFn: () => fetchKpis(filters),
    placeholderData: keepPreviousData,
  });
}

export function useInfrastructures(filters: InfrastructureFilters) {
  return useQuery({
    queryKey: ["infrastructures", filters],
    queryFn: () => fetchInfrastructures(filters),
    placeholderData: keepPreviousData,
  });
}

export function useGeoJson(filters: InfrastructureFilters) {
  return useQuery({
    queryKey: ["geojson", filters],
    queryFn: () => fetchGeoJson(filters),
    placeholderData: keepPreviousData,
  });
}

export function useFilterOptions() {
  return useQuery({
    queryKey: ["filter-options"],
    queryFn: fetchFilterOptions,
    staleTime: 5 * 60_000,
  });
}

export function useAltitudeRange() {
  return useQuery({
    queryKey: ["altitude-range"],
    queryFn: fetchAltitudeRange,
    staleTime: 5 * 60_000,
  });
}

export function useDashboardCharts(filters: InfrastructureFilters) {
  return useQuery({
    queryKey: ["dashboard-charts", filters],
    queryFn: () => fetchDashboardCharts(filters),
    placeholderData: keepPreviousData,
  });
}
