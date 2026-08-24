"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { useSeaLevelRange } from "@/hooks/useSimulationData";

interface SimulationControlsContextValue {
  seaLevel: number;
  setSeaLevel: (value: number) => void;
}

const SimulationControlsContext = createContext<SimulationControlsContextValue | null>(null);

export function SimulationControlsProvider({ children }: { children: ReactNode }) {
  const { data: range } = useSeaLevelRange();
  const [seaLevel, setSeaLevel] = useState(0);

  useEffect(() => {
    if (range) {
      setSeaLevel(range.min);
    }
  }, [range]);

  const value = useMemo(
    () => ({
      seaLevel,
      setSeaLevel,
    }),
    [seaLevel],
  );

  return (
    <SimulationControlsContext.Provider value={value}>
      {children}
    </SimulationControlsContext.Provider>
  );
}

export function useSimulationControls() {
  const context = useContext(SimulationControlsContext);
  if (!context) {
    throw new Error("useSimulationControls must be used within SimulationControlsProvider");
  }
  return context;
}
