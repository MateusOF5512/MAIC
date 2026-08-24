"use client";

import { InfrastructureMap } from "@/components/Map/InfrastructureMap";
import { useMapBasemap } from "@/hooks/useMapBasemap";

export default function MapaPage() {
  const { basemapId } = useMapBasemap();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <InfrastructureMap basemapId={basemapId} className="min-h-[480px] flex-1" />
    </div>
  );
}
