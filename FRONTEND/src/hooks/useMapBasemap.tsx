"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { DEFAULT_BASEMAP_ID, type BasemapId } from "@/utils/mapBasemaps";

interface MapBasemapContextValue {
  basemapId: BasemapId;
  setBasemapId: (value: BasemapId) => void;
  colorByType: boolean;
  setColorByType: (value: boolean) => void;
}

const MapBasemapContext = createContext<MapBasemapContextValue | null>(null);

export function MapBasemapProvider({ children }: { children: ReactNode }) {
  const [basemapId, setBasemapId] = useState<BasemapId>(DEFAULT_BASEMAP_ID);
  const [colorByType, setColorByType] = useState(false);

  const value = useMemo(
    () => ({
      basemapId,
      setBasemapId,
      colorByType,
      setColorByType,
    }),
    [basemapId, colorByType],
  );

  return <MapBasemapContext.Provider value={value}>{children}</MapBasemapContext.Provider>;
}

export function useMapBasemap() {
  const context = useContext(MapBasemapContext);
  if (!context) {
    throw new Error("useMapBasemap must be used within MapBasemapProvider");
  }
  return context;
}
