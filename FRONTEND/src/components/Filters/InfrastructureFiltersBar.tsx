"use client";

import { useFilterOptions } from "@/hooks/useInfrastructureData";
import { useFilters } from "@/hooks/useFilters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/cn";
import { getManagementLabel, getTypeLabel } from "@/utils/status";

import { AltitudeSlider } from "./AltitudeSlider";
import { MapBasemapSelector } from "@/components/Map/MapBasemapSelector";
import { useMapBasemap } from "@/hooks/useMapBasemap";

interface InfrastructureFiltersBarProps {
  showSearch?: boolean;
  showNeighborhood?: boolean;
  showManagement?: boolean;
  showAltitude?: boolean;
  showBasemap?: boolean;
  className?: string;
}

const statusOptions = [
  { value: "all", label: "Todos os status" },
  { value: "OK", label: "OK" },
  { value: "ALERTA", label: "Alerta" },
  { value: "CRITICA", label: "Crítica" },
];

export function InfrastructureFiltersBar({
  showSearch = false,
  showNeighborhood = false,
  showManagement = false,
  showAltitude = false,
  showBasemap = false,
  className,
}: InfrastructureFiltersBarProps) {
  const { filters, setFilter } = useFilters();
  const { data: options } = useFilterOptions();
  const { basemapId, setBasemapId } = useMapBasemap();

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {showSearch && (
        <input
          type="search"
          placeholder="Buscar infraestrutura..."
          value={filters.search ?? ""}
          onChange={(event) => setFilter("search", event.target.value || undefined)}
          className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 lg:max-w-sm"
        />
      )}

      <FilterSelect
        label="Tipo"
        value={filters.type ?? "all"}
        onChange={(value) => setFilter("type", value)}
        options={[
          { value: "all", label: "Todos os tipos" },
          ...(options?.types ?? []).map((type) => ({
            value: type,
            label: getTypeLabel(type),
          })),
        ]}
      />

      <FilterSelect
        label="Status"
        value={filters.status ?? "all"}
        onChange={(value) => setFilter("status", value)}
        options={statusOptions}
      />

      <FilterSelect
        label="Cidade"
        value={filters.city ?? "all"}
        onChange={(value) => setFilter("city", value)}
        options={[
          { value: "all", label: "Todas as cidades" },
          ...(options?.cities ?? []).map((city) => ({ value: city, label: city })),
        ]}
      />

      {showNeighborhood && (
        <FilterSelect
          label="Bairro"
          value={filters.neighborhood ?? "all"}
          onChange={(value) => setFilter("neighborhood", value)}
          options={[
            { value: "all", label: "Todos os bairros" },
            ...(options?.neighborhoods ?? []).map((neighborhood) => ({
              value: neighborhood,
              label: neighborhood,
            })),
          ]}
        />
      )}

      {showManagement && (
        <FilterSelect
          label="Gestão"
          value={filters.management ?? "all"}
          onChange={(value) => setFilter("management", value)}
          options={[
            { value: "all", label: "Todas as gestões" },
            ...(options?.managements ?? []).map((management) => ({
              value: management,
              label: getManagementLabel(management),
            })),
          ]}
        />
      )}

      {showBasemap ? <MapBasemapSelector value={basemapId} onChange={setBasemapId} /> : null}

      {showAltitude ? <AltitudeSlider className="w-full sm:ml-auto sm:max-w-xs" /> : null}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string | undefined) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="w-full min-w-[180px] lg:w-auto">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger aria-label={label}>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
