"use client";

import maplibregl, { type Map, type Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";

import { useGeoJson } from "@/hooks/useInfrastructureData";
import { useFilters } from "@/hooks/useFilters";
import type { GeoJsonFeatureCollection } from "@/types/infrastructure";
import { STATUS_LABELS, getManagementLabel, getTypeLabel } from "@/utils/status";
import { cn } from "@/utils/cn";
import { registerTypeIcons, TYPE_ICON_LAYOUT, getMapPointPaint } from "@/utils/mapIcons";
import {
  applyBasemap,
  createEmptyMapStyle,
  DEFAULT_BASEMAP_ID,
  type BasemapId,
} from "@/utils/mapBasemaps";
import { setGeoJsonSourceData } from "@/utils/mapData";

const INFRASTRUCTURES_SOURCE_ID = "infrastructures";

const MAP_CENTER: [number, number] = [-48.55, -27.59];
const MAP_ZOOM = 10.5;

function buildPopupHtml(properties: GeoJsonFeatureCollection["features"][0]["properties"]) {
  const altitudeValue = properties.altitude_m_estimada ?? properties.altitude_m;
  const altitude =
    altitudeValue === null || altitudeValue === undefined
      ? "aguardando enriquecimento"
      : `${altitudeValue} m (estimada)`;

  const addressParts = [
    properties.street,
    properties.number,
    properties.neighborhood,
    properties.city ? `${properties.city} - SC` : null,
    properties.cep ? `CEP: ${properties.cep}` : null,
  ].filter(Boolean);

  return `
    <div style="min-width:220px">
      <strong>${properties.name}</strong>
      <div style="margin-top:8px"><strong>Tipo:</strong> ${getTypeLabel(properties.type)}</div>
      <div><strong>Status:</strong> ${STATUS_LABELS[properties.status]}</div>
      <div><strong>Gestão:</strong> ${getManagementLabel(properties.management)}</div>
      <div style="margin-top:8px">${addressParts.join("<br/>")}</div>
      <div style="margin-top:8px">
        <div><strong>Latitude:</strong> ${properties.latitude}</div>
        <div><strong>Longitude:</strong> ${properties.longitude}</div>
        <div><strong>Altura estimada:</strong> ${altitude}</div>
      </div>
    </div>
  `;
}

export function InfrastructureMap({
  className,
  basemapId = DEFAULT_BASEMAP_ID,
}: {
  className?: string;
  basemapId?: BasemapId;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const { filters } = useFilters();
  const { data, isLoading } = useGeoJson(filters);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

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

        map.addSource(INFRASTRUCTURES_SOURCE_ID, {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        });

        map.addLayer({
          id: "clusters",
          type: "circle",
          source: INFRASTRUCTURES_SOURCE_ID,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#334155",
          "circle-radius": ["step", ["get", "point_count"], 18, 5, 24, 10, 30],
          "circle-opacity": 0.85,
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: INFRASTRUCTURES_SOURCE_ID,
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 12,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: INFRASTRUCTURES_SOURCE_ID,
        filter: ["!", ["has", "point_count"]],
        paint: getMapPointPaint("status"),
      });

      await registerTypeIcons(map);

      map.addLayer({
        id: "unclustered-icon",
        type: "symbol",
        source: INFRASTRUCTURES_SOURCE_ID,
        filter: ["!", ["has", "point_count"]],
        layout: TYPE_ICON_LAYOUT,
      });

      map.on("click", "clusters", async (event) => {
        const features = map.queryRenderedFeatures(event.point, { layers: ["clusters"] });
        const clusterId = features[0]?.properties?.cluster_id;
        const source = map.getSource(INFRASTRUCTURES_SOURCE_ID) as maplibregl.GeoJSONSource;
        if (clusterId === undefined) return;
        try {
          const zoom = await source.getClusterExpansionZoom(clusterId);
          const geometry = features[0].geometry;
          if (geometry.type !== "Point") return;
          map.easeTo({ center: geometry.coordinates as [number, number], zoom });
        } catch {
          return;
        }
      });

      map.on("click", "unclustered-point", (event) => {
        const feature = event.features?.[0];
        if (!feature || feature.geometry.type !== "Point") return;
        const properties =
          feature.properties as GeoJsonFeatureCollection["features"][0]["properties"];

        popupRef.current
          ?.setLngLat(feature.geometry.coordinates as [number, number])
          .setHTML(buildPopupHtml(properties))
          .addTo(map);
      });

      ["clusters", "unclustered-point"].forEach((layerId) => {
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
    setGeoJsonSourceData(map, INFRASTRUCTURES_SOURCE_ID, data);
  }, [data, mapReady]);

  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-white", className)}>
      {isLoading && (
        <div className="absolute left-4 top-4 z-10 rounded-md bg-white/90 px-3 py-1 text-sm shadow">
          Carregando mapa...
        </div>
      )}
      <div ref={mapContainerRef} className="h-full min-h-[480px] w-full" />
    </div>
  );
}
