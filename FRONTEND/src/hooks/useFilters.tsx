"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import type { InfrastructureFilters } from "@/types/infrastructure";

interface FiltersContextValue {
  filters: InfrastructureFilters;
  setFilter: (key: keyof InfrastructureFilters, value: string | undefined) => void;
  setAltitudeRange: (min?: number, max?: number) => void;
  clearFilters: () => void;
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<InfrastructureFilters>({});

  const setFilter = useCallback((key: keyof InfrastructureFilters, value: string | undefined) => {
    setFilters((current) => {
      const next = { ...current };
      if (!value || value === "all") {
        delete next[key];
        return next;
      }
      if (key === "status") {
        next.status = value as InfrastructureFilters["status"];
      } else if (key === "type") {
        next.type = value;
      } else if (key === "city") {
        next.city = value;
      } else if (key === "neighborhood") {
        next.neighborhood = value;
      } else if (key === "search") {
        next.search = value;
      } else if (key === "management") {
        next.management = value;
      }
      return next;
    });
  }, []);

  const setAltitudeRange = useCallback((min?: number, max?: number) => {
    setFilters((current) => {
      const next = { ...current };
      if (min === undefined) delete next.altitudeMin;
      else next.altitudeMin = min;
      if (max === undefined) delete next.altitudeMax;
      else next.altitudeMax = max;
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => setFilters({}), []);

  const value = useMemo(
    () => ({
      filters,
      setFilter,
      setAltitudeRange,
      clearFilters,
    }),
    [filters, setFilter, setAltitudeRange, clearFilters]
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error("useFilters must be used within FiltersProvider");
  }
  return context;
}
