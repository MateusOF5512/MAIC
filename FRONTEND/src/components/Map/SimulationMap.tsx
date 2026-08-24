"use client";

import maplibregl, { type Map, type Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";

import { useSimulationGeoJson } from "@/hooks/useSimulationData";
import { useFilters } from "@/hooks/useFilters";
import type { GeoJsonFeatureCollection } from "@/types/infrastructure";
import { cn } from "@/utils/cn";
import {
  STATUS_LABELS,
  getManagementLabel,
  getTypeLabel,
} from "@/utils/status";
import { registerTypeIcons, TYPE_ICON_LAYOUT, getMapPointPaint } from "@/utils/mapIcons";
import {
  applyBasemap,
  createEmptyMapStyle,
  DEFAULT_BASEMAP_ID,
  type BasemapId,
} from "@/utils/mapBasemaps";
import { setGeoJsonSourceData } from "@/utils/mapData";

const SIMULATION_SOURCE_ID = "simulation-infrastructures";

const MAP_CENTER: [number, number] = [-48.55, -27.59];
const MAP_ZOOM = 10.5;

type SimulationProperties = GeoJsonFeatureCollection["features"][0]["properties"] & {
  simulation_status?: "OK" | "ALERTA" | "CRITICA";
  sea_level?: number;
};

function buildSimulationPopupHtml(properties: SimulationProperties) {
  const altitude = properties.altitude_m_estimada ?? properties.altitude_m;
  const addressParts = [
    properties.street,
    properties.number,
    properties.neighborhood,
    properties.city ? `${properties.city} - SC` : null,
  ].filter(Boolean);

  const simulationStatus = properties.simulation_status ?? "OK";

  return `
    <div style="min-width:240px">
      <strong>${properties.name}</strong>
      <div style="margin-top:8px"><strong>Tipo:</strong> ${getTypeLabel(properties.type)}</div>
      <div><strong>Impacto simulado:</strong> ${STATUS_LABELS[simulationStatus]}</div>
      <div><strong>Nível do mar:</strong> ${properties.sea_level ?? "—"} m</div>
      <div><strong>Altura estimada:</strong> ${altitude ?? "—"} m</div>
      <div><strong>Gestão:</strong> ${getManagementLabel(properties.management)}</div>
      <div style="margin-top:8px">${addressParts.join("<br/>")}</div>
    </div>
  `;
}

export function SimulationMap({
  seaLevel,
  className,
  basemapId = DEFAULT_BASEMAP_ID,
}: {
  seaLevel: number;
  className?: string;
  basemapId?: BasemapId;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const { filters } = useFilters();
  const { data, isLoading } = useSimulationGeoJson(seaLevel, filters);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: createEmptyMapStyle(),
      center: MAP_CENTER,
      zoom: MAP_ZOOM,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    popupRef.current = new maplibregl.Popup({
      closeButton: true,
      closeOnClick: true,
      maxWidth: "320px",
    });

    map.on("load", () => {
      void (async () => {
        applyBasemap(map, basemapId);

        map.addSource(SIMULATION_SOURCE_ID, {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        });

        map.addLayer({
          id: "points",
          type: "circle",
          source: SIMULATION_SOURCE_ID,
          paint: getMapPointPaint("simulation_status"),
        });

        await registerTypeIcons(map);

        map.addLayer({
          id: "point-icons",
          type: "symbol",
          source: SIMULATION_SOURCE_ID,
          layout: TYPE_ICON_LAYOUT,
        });

      map.on("click", "points", (event) => {
        const feature = event.features?.[0];
        if (!feature || feature.geometry.type !== "Point") return;
        const properties = feature.properties as SimulationProperties;
        popupRef.current
          ?.setLngLat(feature.geometry.coordinates as [number, number])
          .setHTML(buildSimulationPopupHtml(properties))
          .addTo(map);
      });

      ["points"].forEach((layerId) => {
        map.on("mouseenter", layerId, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layerId, () => {
          map.getCanvas().style.cursor = "";
        });
      });

      setMapReady(true);
      })();
    });

    mapRef.current = map;
    return () => {
      setMapReady(false);
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    applyBasemap(map, basemapId);
  }, [basemapId, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !data) return;
    setGeoJsonSourceData(map, SIMULATION_SOURCE_ID, data);
  }, [data, mapReady]);

  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-white", className)}>
      {isLoading && (
        <div className="absolute left-4 top-4 z-10 rounded-md bg-white/90 px-3 py-1 text-sm shadow">
          Atualizando simulação...
        </div>
      )}
      <div ref={mapContainerRef} className="h-full min-h-[480px] w-full" />
    </div>
  );
}
