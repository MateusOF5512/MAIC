"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { InfrastructureMap } from "@/components/Map/InfrastructureMap";
import { SimulationMap } from "@/components/Map/SimulationMap";
import { useMapBasemap } from "@/hooks/useMapBasemap";
import { useSimulationControls } from "@/hooks/useSimulationControls";
import { cn } from "@/utils/cn";

export function PersistentMapHost() {
  const pathname = usePathname();
  const isMapa = pathname === "/mapa";
  const isSimulacoes = pathname.startsWith("/simulacoes");
  const { basemapId } = useMapBasemap();
  const { seaLevel } = useSimulationControls();
  const [infraMounted, setInfraMounted] = useState(false);
  const [simMounted, setSimMounted] = useState(false);

  useEffect(() => {
    if (isMapa) {
      setInfraMounted(true);
    }
  }, [isMapa]);

  useEffect(() => {
    if (isSimulacoes) {
      setSimMounted(true);
    }
  }, [isSimulacoes]);

  if (!infraMounted && !simMounted) {
    return null;
  }

  return (
    <>
      {infraMounted ? (
        <div className={cn("flex min-h-0 flex-1 flex-col", !isMapa && "hidden")}>
          <InfrastructureMap
            visible={isMapa}
            basemapId={basemapId}
            className="min-h-[480px] flex-1"
          />
        </div>
      ) : null}

      {simMounted ? (
        <div className={cn("flex min-h-0 flex-1 flex-col", !isSimulacoes && "hidden")}>
          <SimulationMap
            visible={isSimulacoes}
            seaLevel={seaLevel}
            basemapId={basemapId}
            className="min-h-[480px] flex-1"
          />
        </div>
      ) : null}
    </>
  );
}
