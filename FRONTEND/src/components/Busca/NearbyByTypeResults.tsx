"use client";

import { MapPin, Navigation } from "lucide-react";

import { StatusBadge } from "@/components/StatusBadge/StatusBadge";
import type { NearbyByTypeItem, NearbyByTypeResponse } from "@/types/infrastructure";
import {
  formatDistanceKm,
  formatInfrastructureAddress,
  groupResultsByMacroType,
  MACRO_TYPE_ICONS,
  MACRO_TYPE_LABELS,
} from "@/utils/busca";
import { cn } from "@/utils/cn";
import { getManagementLabel, getTypeIcon, getTypeLabel } from "@/utils/status";

function ResultSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 2 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-3">
          <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((__, cardIndex) => (
              <div
                key={cardIndex}
                className="animate-pulse rounded-xl border border-border bg-white p-4"
              >
                <div className="h-4 w-1/3 rounded bg-slate-200" />
                <div className="mt-3 h-5 w-2/3 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-full rounded bg-slate-100" />
                <div className="mt-4 h-6 w-1/4 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function NearbyResultCard({ item }: { item: NearbyByTypeItem }) {
  const infra = item.infrastructure;
  const distanceKm = Number(item.distance_km);
  const distanceLabel = formatDistanceKm(distanceKm);

  return (
    <article
      className={cn(
        "flex flex-col rounded-xl border border-border bg-white p-4 shadow-sm",
        "transition-shadow hover:shadow-md",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <span aria-hidden className="text-lg">
            {getTypeIcon(item.type)}
          </span>
          {getTypeLabel(item.type)}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
            "bg-status-ok text-white",
            distanceKm > 1 && distanceKm < 5 && "bg-status-alerta",
            distanceKm >= 5 && "bg-status-critica",
            !Number.isFinite(distanceKm) && "bg-slate-500",
          )}
        >
          {distanceLabel}
        </span>
      </div>

      <h3 className="mt-3 text-base font-medium text-slate-900">{infra.name}</h3>

      {infra.city ? (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden />
          {infra.city}
        </p>
      ) : null}

      <p className="mt-2 text-sm text-slate-600">
        {formatInfrastructureAddress(infra.street, infra.number, infra.neighborhood, null)}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <StatusBadge status={infra.status} />
        <span>{getManagementLabel(infra.management)}</span>
      </div>
    </article>
  );
}

interface NearbyByTypeResultsProps {
  data: NearbyByTypeResponse | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isFetched: boolean;
  errorMessage: string | null;
  hasSearched: boolean;
}

export function NearbyByTypeResults({
  data,
  isLoading,
  isFetching,
  isFetched,
  errorMessage,
  hasSearched,
}: NearbyByTypeResultsProps) {
  if (!hasSearched) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-slate-50 px-6 py-16 text-center">
        <div className="max-w-md">
          <MapPin className="mx-auto h-10 w-10 text-slate-400" />
          <p className="mt-4 text-sm text-slate-600">
            Digite seu CEP e clique em Pesquisar. Use os filtros acima para refinar quais tipos e
            infraestruturas aparecem nos resultados.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading && !data) {
    return <ResultSkeleton />;
  }

  if (errorMessage) {
    return (
      <div
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        {errorMessage}
      </div>
    );
  }

  if (isFetched && data && data.results.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-white px-4 py-8 text-center text-sm text-slate-600">
        Nenhuma infraestrutura encontrada com os filtros selecionados.
      </div>
    );
  }

  if (!data) return null;

  const groupedResults = groupResultsByMacroType(data.results);
  const macroTypeCount = groupedResults.length;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col gap-6">
      {isFetching ? (
        <div className="absolute right-0 top-0 z-10 rounded-md bg-white/90 px-3 py-1 text-xs text-slate-600 shadow">
          Atualizando resultados...
        </div>
      ) : null}

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        <div className="flex items-start gap-2">
          <Navigation className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Origem: CEP {data.origin.cep}</p>
            {data.origin.address ? (
              <p className="mt-0.5 text-emerald-800">{data.origin.address}</p>
            ) : null}
            <p className="mt-1 text-xs text-emerald-700">
              {data.results.length} tipos em {macroTypeCount} macrotipos · distância em linha reta
              (aproximada)
            </p>
          </div>
        </div>
      </div>

      {groupedResults.map(({ macroType, items }) => (
        <section key={macroType} className="space-y-3">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <span aria-hidden className="text-xl">
              {MACRO_TYPE_ICONS[macroType]}
            </span>
            <h2 className="text-base font-semibold text-slate-900">
              {MACRO_TYPE_LABELS[macroType]}
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {items.length} {items.length === 1 ? "tipo" : "tipos"}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <NearbyResultCard key={item.type} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
