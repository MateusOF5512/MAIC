import type { Metadata } from "next";

import { Sidebar } from "@/components/Sidebar/Sidebar";
import { FiltersProvider } from "@/hooks/useFilters";
import { MapBasemapProvider } from "@/hooks/useMapBasemap";
import { SimulationControlsProvider } from "@/hooks/useSimulationControls";
import { QueryProvider } from "@/components/providers/QueryProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "MAIC — Monitoramento e Análise de Infraestrutura Crítica",
  description: "Plataforma MAIC para monitoramento e análise de infraestrutura crítica",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          <FiltersProvider>
            <MapBasemapProvider>
              <SimulationControlsProvider>
                <div className="flex min-h-screen flex-col lg:flex-row">
                  <Sidebar />
                  <main className="flex-1 overflow-auto">{children}</main>
                </div>
              </SimulationControlsProvider>
            </MapBasemapProvider>
          </FiltersProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
