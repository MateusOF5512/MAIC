"use client";

import { useEffect, useState } from "react";

import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useSeaLevelRange } from "@/hooks/useSimulationData";
import { cn } from "@/utils/cn";

interface SeaLevelSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function SeaLevelSlider({ value, onChange, className }: SeaLevelSliderProps) {
  const { data: range, isLoading } = useSeaLevelRange();
  const [localValue, setLocalValue] = useState(value);
  const debouncedOnChange = useDebouncedCallback(onChange, 200);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  if (isLoading || !range) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex h-10 min-w-[280px] items-center gap-3 rounded-md border border-border bg-white px-3",
        className
      )}
    >
      <span className="whitespace-nowrap text-xs font-medium text-slate-700">Nível do mar</span>
      <input
        type="range"
        min={range.min}
        max={range.max}
        step={0.5}
        value={localValue}
        onChange={(event) => {
          const next = Number(event.target.value);
          setLocalValue(next);
          debouncedOnChange(next);
        }}
        aria-label="Nível do mar em metros"
        className="h-1.5 min-w-[120px] flex-1 cursor-pointer accent-sky-700"
      />
      <span className="w-12 text-right text-xs font-semibold text-sky-800">{localValue} m</span>
    </div>
  );
}
