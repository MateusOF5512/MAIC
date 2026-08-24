"use client";

import { usePathname } from "next/navigation";

import { FiltersExpander } from "@/components/Filters/FiltersExpander";
import { SeaLevelSlider } from "@/components/Filters/SeaLevelSlider";
import { PersistentMapHost } from "@/components/Layout/PersistentMapHost";
import { KpiCards } from "@/components/KPI/KpiCards";
import { SimulationKpiCards } from "@/components/KPI/SimulationKpiCards";
import { useSimulationControls } from "@/hooks/useSimulationControls";

export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSimulationPage = pathname.startsWith("/simulacoes");
  const isBuscaPage = pathname.startsWith("/busca");
  const { seaLevel, setSeaLevel } = useSimulationControls();

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 p-4 lg:p-6">
      {!isBuscaPage && (isSimulationPage ? <SimulationKpiCards seaLevel={seaLevel} /> : <KpiCards />)}
      <FiltersExpander
        trailing={
          isSimulationPage ? (
            <SeaLevelSlider value={seaLevel} onChange={setSeaLevel} />
          ) : undefined
        }
      />
      <div className="flex min-h-0 flex-1 flex-col">
        {children}
        <PersistentMapHost />
      </div>
    </div>
  );
}
