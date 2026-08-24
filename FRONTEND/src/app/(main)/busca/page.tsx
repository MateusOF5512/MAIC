"use client";

import { CepSearchForm } from "@/components/Busca/CepSearchForm";
import { NearbyByTypeResults } from "@/components/Busca/NearbyByTypeResults";
import { useNearbySearch } from "@/hooks/useNearbySearch";

export default function BuscaPage() {
  const { search, data, isLoading, isFetching, isFetched, errorMessage, hasSearched } =
    useNearbySearch();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <CepSearchForm onSearch={search} isLoading={isLoading || isFetching} />

      <NearbyByTypeResults
        data={data}
        isLoading={isLoading}
        isFetching={isFetching}
        isFetched={isFetched}
        errorMessage={errorMessage}
        hasSearched={hasSearched}
      />
    </div>
  );
}
