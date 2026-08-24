import type { Map as MapLibreMap } from "maplibre-gl";

export type BasemapId = "esri-topo" | "osm" | "esri-satellite";

export const DEFAULT_BASEMAP_ID: BasemapId = "osm";

export interface BasemapOption {
  id: BasemapId;
  label: string;
}

interface BasemapRuntimeConfig {
  tiles: string[];
  tileSize: number;
  attribution: string;
  maxzoom?: number;
}

const BASEMAP_TILES: Record<BasemapId, BasemapRuntimeConfig> = {
  osm: {
    tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
    tileSize: 256,
    attribution: "© OpenStreetMap contributors",
    maxzoom: 19,
  },
  "esri-topo": {
    tiles: [
      "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    ],
    tileSize: 256,
    attribution: "Tiles © Esri — Esri, USGS, NOAA",
    maxzoom: 19,
  },
  "esri-satellite": {
    tiles: [
      "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    ],
    tileSize: 256,
    attribution: "Tiles © Esri — Esri, Maxar, Earthstar Geographics",
    maxzoom: 19,
  },
};

export const BASEMAP_OPTIONS: BasemapOption[] = [
  { id: "esri-topo", label: "Esri" },
  { id: "osm", label: "OSM" },
  { id: "esri-satellite", label: "Satélite" },
];

export function getBasemapConfig(basemapId: BasemapId): BasemapRuntimeConfig {
  return BASEMAP_TILES[basemapId];
}

export function applyBasemap(map: MapLibreMap, basemapId: BasemapId): void {
  const config = getBasemapConfig(basemapId);

  if (map.getLayer("basemap-layer")) {
    map.removeLayer("basemap-layer");
  }

  if (map.getSource("basemap")) {
    map.removeSource("basemap");
  }

  map.addSource("basemap", {
    type: "raster",
    tiles: config.tiles,
    tileSize: config.tileSize,
    attribution: config.attribution,
    maxzoom: config.maxzoom,
  });

  const firstOverlayLayer = map.getStyle()?.layers?.[0]?.id;
  map.addLayer(
    {
      id: "basemap-layer",
      type: "raster",
      source: "basemap",
    },
    firstOverlayLayer,
  );
}

export function createEmptyMapStyle() {
  return {
    version: 8 as const,
    sources: {},
    layers: [],
  };
}
