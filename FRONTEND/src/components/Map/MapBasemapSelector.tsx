"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BASEMAP_OPTIONS, type BasemapId } from "@/utils/mapBasemaps";
import { cn } from "@/utils/cn";

interface MapBasemapSelectorProps {
  value: BasemapId;
  onChange: (value: BasemapId) => void;
  className?: string;
}

export function MapBasemapSelector({ value, onChange, className }: MapBasemapSelectorProps) {
  return (
    <div className={cn("min-w-[140px]", className)}>
      <Select value={value} onValueChange={(next) => onChange(next as BasemapId)}>
        <SelectTrigger aria-label="Tipo de mapa" className="h-10">
          <SelectValue placeholder="Mapa" />
        </SelectTrigger>
        <SelectContent>
          {BASEMAP_OPTIONS.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
