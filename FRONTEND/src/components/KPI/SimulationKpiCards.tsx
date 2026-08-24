"use client";

import { useSimulationKpis } from "@/hooks/useSimulationData";
import { useFilters } from "@/hooks/useFilters";
import { cn } from "@/utils/cn";

interface SimulationKpiCardsProps {
  seaLevel: number;
  className?: string;
}

const cards = [
  { key: "total", label: "Infra analisadas", tone: "border-slate-200 bg-white text-slate-900" },
  { key: "ok", label: "Longe do mar", tone: "border-status-ok/20 bg-status-ok/5 text-status-ok" },
  {
    key: "alert",
    label: "Próximo do mar (≤1 m)",
    tone: "border-status-alerta/20 bg-status-alerta/5 text-status-alerta",
  },
  {
    key: "critical",
    label: "Na altura ou submersa",
    tone: "border-status-critica/20 bg-status-critica/5 text-status-critica",
  },
] as const;

export function SimulationKpiCards({ seaLevel, className }: SimulationKpiCardsProps) {
  const { filters } = useFilters();
  const { data, isLoading, isError } = useSimulationKpis(seaLevel, filters);

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {isError && (
        <div className="col-span-full rounded-lg border border-status-critica/30 bg-status-critica/5 px-4 py-3 text-sm text-status-critica">
          Não foi possível carregar os indicadores da simulação.
        </div>
      )}
      {cards.map((card) => (
        <div key={card.key} className={cn("rounded-xl border p-4 shadow-sm", card.tone)}>
          <p className="text-sm font-medium opacity-80">{card.label}</p>
          <p className="mt-2 text-3xl font-semibold">
            {isLoading ? "..." : isError ? "—" : (data?.[card.key] ?? 0)}
          </p>
        </div>
      ))}
    </div>
  );
}
