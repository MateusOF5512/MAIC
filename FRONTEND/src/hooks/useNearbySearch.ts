"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { useFilters } from "@/hooks/useFilters";
import { fetchNearbyByType } from "@/services/api";

function normalizeCep(rawCep: string): string | null {
  const digits = rawCep.replace(/\D/g, "");
  if (digits.length !== 8) return null;
  return digits;
}

export function useNearbySearch() {
  const { filters } = useFilters();
  const [searchCep, setSearchCep] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["nearby-by-type", searchCep, filters],
    queryFn: () => fetchNearbyByType(searchCep!, filters),
    enabled: searchCep !== null,
    retry: false,
    placeholderData: keepPreviousData,
  });

  const search = useCallback((rawCep: string) => {
    const normalized = normalizeCep(rawCep);
    if (!normalized) {
      return { ok: false as const, error: "CEP inválido. Informe 8 dígitos." };
    }
    setSearchCep(normalized);
    return { ok: true as const };
  }, []);

  const getErrorMessage = (): string | null => {
    if (query.error) {
      const axiosError = query.error as { response?: { data?: { detail?: string } } };
      return axiosError.response?.data?.detail ?? "Não foi possível realizar a busca.";
    }
    return null;
  };

  return {
    search,
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isFetched: query.isFetched,
    errorMessage: getErrorMessage(),
    hasSearched: searchCep !== null,
  };
}
