"use client";

import { useEffect, useState } from "react";

import { useAltitudeRange } from "@/hooks/useInfrastructureData";
import { useFilters } from "@/hooks/useFilters";
import { cn } from "@/utils/cn";

export function AltitudeSlider({ className }: { className?: string }) {
  const { data: range, isLoading } = useAltitudeRange();
  const { filters, setAltitudeRange } = useFilters();
  const [localMin, setLocalMin] = useState<number | null>(null);
  const [localMax, setLocalMax] = useState<number | null>(null);

  useEffect(() => {
    if (!range) return;
    setLocalMin(filters.altitudeMin ?? range.min);
    setLocalMax(filters.altitudeMax ?? range.max);
  }, [range, filters.altitudeMin, filters.altitudeMax]);

  if (isLoading || !range || localMin === null || localMax === null) {
    return null;
  }

  const span = range.max - range.min || 1;
  const minPercent = ((localMin - range.min) / span) * 100;
  const maxPercent = ((localMax - range.min) / span) * 100;
  const isFiltered = localMin > range.min || localMax < range.max;

  const applyRange = (nextMin: number, nextMax: number) => {
    const min = Math.min(nextMin, nextMax);
    const max = Math.max(nextMin, nextMax);
    setLocalMin(min);
    setLocalMax(max);

    if (min <= range.min && max >= range.max) {
      setAltitudeRange(undefined, undefined);
      return;
    }
    setAltitudeRange(min, max);
  };

  return (
    <div
      className={cn(
        "flex h-10 min-w-[260px] items-center gap-2 rounded-md border border-border bg-white px-3",
        className
      )}
    >
      <span className="whitespace-nowrap text-xs text-muted">Alt.</span>

      <div className="relative flex h-6 flex-1 items-center">
        <div className="absolute h-1.5 w-full rounded-full bg-slate-200" />
        <div
          className="absolute h-1.5 rounded-full bg-slate-900"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(maxPercent - minPercent, 0)}%`,
          }}
        />
        <input
          type="range"
          min={range.min}
          max={range.max}
          step={1}
          value={localMin}
          onChange={(event) => applyRange(Number(event.target.value), localMax)}
          aria-label="Altura mínima estimada"
          className="range-thumb absolute inset-0 w-full cursor-pointer appearance-none bg-transparent"
        />
        <input
          type="range"
          min={range.min}
          max={range.max}
          step={1}
          value={localMax}
          onChange={(event) => applyRange(localMin, Number(event.target.value))}
          aria-label="Altura máxima estimada"
          className="range-thumb absolute inset-0 w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>

      <span className="w-14 text-right text-xs font-medium text-slate-700">
        {isFiltered ? `${localMin}–${localMax}m` : `${range.min}–${range.max}m`}
      </span>
    </div>
  );
}
