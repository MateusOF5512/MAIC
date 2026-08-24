import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { InfrastructureFilters } from "@/types/infrastructure";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNullable(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return String(value);
}

export function buildQueryParams(
  filters: InfrastructureFilters
): Record<string, string | number> {
  const params: Record<string, string | number> = {};

  if (filters.status) params.status = filters.status;
  if (filters.type && filters.type !== "all") params.type = filters.type;
  if (filters.city && filters.city !== "all") params.city = filters.city;
  if (filters.neighborhood && filters.neighborhood !== "all") {
    params.neighborhood = filters.neighborhood;
  }
  if (filters.search) params.search = filters.search;
  if (filters.management && filters.management !== "all") {
    params.management = filters.management;
  }
  if (filters.altitudeMin !== undefined) params.altitude_min = filters.altitudeMin;
  if (filters.altitudeMax !== undefined) params.altitude_max = filters.altitudeMax;

  return params;
}
