import axios from "axios";

import type {
  AltitudeRangeResponse,
  DashboardChartsResponse,
  FilterOptions,
  GeoJsonFeatureCollection,
  Infrastructure,
  InfrastructureFilters,
  KpiResponse,
  NearbyByTypeResponse,
} from "@/types/infrastructure";
import { buildQueryParams } from "@/utils/cn";

const serverApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8091";

export const api = axios.create({
  baseURL: typeof window === "undefined" ? serverApiUrl : "",
});

export async function fetchDashboardCharts(
  filters: InfrastructureFilters = {},
): Promise<DashboardChartsResponse> {
  const { data } = await api.get<DashboardChartsResponse>("/api/v1/dashboard/charts", {
    params: buildQueryParams(filters),
  });
  return data;
}

export async function fetchKpis(filters: InfrastructureFilters = {}): Promise<KpiResponse> {
  const { data } = await api.get<KpiResponse>("/api/v1/kpis", {
    params: buildQueryParams(filters),
  });
  return data;
}

export async function fetchInfrastructures(
  filters: InfrastructureFilters = {}
): Promise<Infrastructure[]> {
  const { data } = await api.get<Infrastructure[]>("/api/v1/infrastructures", {
    params: buildQueryParams(filters),
  });
  return data;
}

export async function fetchGeoJson(
  filters: InfrastructureFilters = {}
): Promise<GeoJsonFeatureCollection> {
  const { data } = await api.get<GeoJsonFeatureCollection>(
    "/api/v1/infrastructures/geojson",
    {
      params: buildQueryParams(filters),
    }
  );
  return data;
}

export async function fetchFilterOptions(): Promise<FilterOptions> {
  const { data } = await api.get<FilterOptions>("/api/v1/infrastructures/options/filters");
  return data;
}

export async function fetchAltitudeRange(): Promise<AltitudeRangeResponse> {
  const { data } = await api.get<AltitudeRangeResponse>(
    "/api/v1/infrastructures/options/altitude"
  );
  return data;
}

export async function fetchSeaLevelRange(): Promise<AltitudeRangeResponse> {
  const { data } = await api.get<AltitudeRangeResponse>("/api/v1/simulations/sea-level/range");
  return data;
}

export async function fetchSimulationKpis(
  seaLevel: number,
  filters: InfrastructureFilters = {},
): Promise<KpiResponse> {
  const { data } = await api.get<KpiResponse>("/api/v1/simulations/kpis", {
    params: { sea_level: seaLevel, ...buildQueryParams(filters) },
  });
  return data;
}

export async function fetchSimulationGeoJson(
  seaLevel: number,
  filters: InfrastructureFilters = {},
): Promise<GeoJsonFeatureCollection> {
  const { data } = await api.get<GeoJsonFeatureCollection>("/api/v1/simulations/geojson", {
    params: { sea_level: seaLevel, ...buildQueryParams(filters) },
  });
  return data;
}

export async function fetchNearbyByType(
  cep: string,
  filters: InfrastructureFilters = {},
): Promise<NearbyByTypeResponse> {
  const { data } = await api.get<NearbyByTypeResponse>(
    "/api/v1/infrastructures/nearby-by-type",
    { params: { cep, ...buildQueryParams(filters) } },
  );
  return data;
}
