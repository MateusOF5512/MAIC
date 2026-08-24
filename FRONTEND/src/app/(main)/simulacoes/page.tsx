"use client";

import { SeaLevelSlider } from "@/components/Filters/SeaLevelSlider";
import { SimulationMap } from "@/components/Map/SimulationMap";
import { useMapBasemap } from "@/hooks/useMapBasemap";
import { useSimulationControls } from "@/hooks/useSimulationControls";

export default function SimulacoesPage() {
  const { seaLevel, setSeaLevel } = useSimulationControls();
  const { basemapId } = useMapBasemap();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
        Simulação de elevação do mar com base na altura estimada das infraestruturas. Ajuste o
        nível do mar para visualizar impactos:{" "}
        <strong>OK</strong> longe do mar, <strong>Alerta</strong> até 1 m acima do nível,{" "}
        <strong>Crítica</strong> no nível ou abaixo.
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
        <SeaLevelSlider value={seaLevel} onChange={setSeaLevel} />
      </div>

      <SimulationMap seaLevel={seaLevel} basemapId={basemapId} className="min-h-[480px] flex-1" />
    </div>
  );
}
