import type { GeoJSONSource, Map } from "maplibre-gl";

import type { GeoJsonFeatureCollection } from "@/types/infrastructure";

export function setGeoJsonSourceData(
  map: Map,
  sourceId: string,
  data: GeoJsonFeatureCollection,
): boolean {
  const source = map.getSource(sourceId) as GeoJSONSource | undefined;
  if (!source) return false;
  source.setData(data);
  return true;
}
