"use client";

import { useKpis } from "@/hooks/useInfrastructureData";
import { useFilters } from "@/hooks/useFilters";
import { cn } from "@/utils/cn";

interface KpiCardsProps {
  className?: string;
}

const cards = [
  { key: "total", label: "Infra analisadas", tone: "border-slate-200 bg-white text-slate-900" },
  { key: "ok", label: "Infra OK", tone: "border-status-ok/20 bg-status-ok/5 text-status-ok" },
  {
    key: "alert",
    label: "Infra alerta",
    tone: "border-status-alerta/20 bg-status-alerta/5 text-status-alerta",
  },
  {
    key: "critical",
    label: "Infra crítica",
    tone: "border-status-critica/20 bg-status-critica/5 text-status-critica",
  },
] as const;

export function KpiCards({ className }: KpiCardsProps) {
  const { filters } = useFilters();
  const { data, isLoading, isError } = useKpis(filters);

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {isError && (
        <div className="col-span-full rounded-lg border border-status-critica/30 bg-status-critica/5 px-4 py-3 text-sm text-status-critica">
          Não foi possível carregar os indicadores. Verifique se o backend está rodando em{" "}
          <code className="rounded bg-white px-1">python run.py</code>.
        </div>
      )}
      {cards.map((card) => (
        <div
          key={card.key}
          className={cn("rounded-xl border p-4 shadow-sm", card.tone)}
        >
          <p className="text-sm font-medium opacity-80">{card.label}</p>
          <p className="mt-2 text-3xl font-semibold">
            {isLoading ? "..." : isError ? "—" : (data?.[card.key] ?? 0)}
          </p>
        </div>
      ))}
    </div>
  );
}
