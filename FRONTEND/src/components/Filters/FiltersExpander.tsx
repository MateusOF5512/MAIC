"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { InfrastructureFiltersBar } from "@/components/Filters/InfrastructureFiltersBar";
import { useFilters } from "@/hooks/useFilters";
import { cn } from "@/utils/cn";

export function FiltersExpander({
  className,
  trailing,
}: {
  className?: string;
  trailing?: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBuscaPage = pathname.startsWith("/busca");
  const [open, setOpen] = useState(false);
  const { filters } = useFilters();

  const activeCount = useMemo(() => {
    return Object.entries(filters).filter(([, value]) => value !== undefined && value !== "").length;
  }, [filters]);

  return (
    <div className={cn("rounded-xl border border-border bg-white shadow-sm", className)}>
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
          aria-expanded={open}
        >
          <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            Filtros
            {activeCount > 0 ? (
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
                {activeCount}
              </span>
            ) : null}
          </span>
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 text-slate-500 transition-transform", open && "rotate-180")}
          />
        </button>
        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </div>

      {open ? (
        <div className="border-t border-border px-4 py-4">
          <InfrastructureFiltersBar
            showSearch
            showNeighborhood
            showManagement
            showAltitude
            showBasemap={!isBuscaPage}
          />
        </div>
      ) : null}
    </div>
  );
}
