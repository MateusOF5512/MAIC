export type InfrastructureStatus = "OK" | "ALERTA" | "CRITICA";

export interface Infrastructure {
  id: string;
  name: string;
  type: string;
  status: InfrastructureStatus;
  latitude: number | null;
  longitude: number | null;
  altitude_m: number | null;
  altitude_m_estimada: number | null;
  cep: string | null;
  city: string | null;
  neighborhood: string | null;
  street: string | null;
  number: string | null;
  management: string | null;
  source: string | null;
  source_updated_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface KpiResponse {
  total: number;
  ok: number;
  alert: number;
  critical: number;
}

export interface AltitudeRangeResponse {
  min: number;
  max: number;
}

export interface InfrastructureFilters {
  status?: InfrastructureStatus;
  type?: string;
  city?: string;
  neighborhood?: string;
  search?: string;
  management?: string;
  altitudeMin?: number;
  altitudeMax?: number;
}

export interface FilterOptions {
  cities: string[];
  neighborhoods: string[];
  types: string[];
  managements: string[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
  key?: string | null;
}

export interface DashboardChartsResponse {
  by_type: ChartDataPoint[];
  by_management: ChartDataPoint[];
  by_city: ChartDataPoint[];
  by_neighborhood: ChartDataPoint[];
}

export interface GeoJsonFeatureCollection {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
}

export interface GeoJsonFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    id: string;
    name: string;
    type: string;
    status: InfrastructureStatus;
    latitude: number;
    longitude: number;
    altitude_m: number | null;
    altitude_m_estimada: number | null;
    management: string | null;
    cep: string | null;
    city: string | null;
    neighborhood: string | null;
    street: string | null;
    number: string | null;
  };
}

export interface NavItem {
  href: string;
  label: string;
  underConstruction?: boolean;
}

export interface NearbyOrigin {
  cep: string;
  latitude: number;
  longitude: number;
  address: string | null;
}

export interface NearbyByTypeItem {
  type: string;
  distance_km: number;
  infrastructure: Infrastructure;
}

export interface NearbyByTypeResponse {
  origin: NearbyOrigin;
  results: NearbyByTypeItem[];
}
