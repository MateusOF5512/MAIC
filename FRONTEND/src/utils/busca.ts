import type { NearbyByTypeItem } from "@/types/infrastructure";

export type MacroType =
  | "SAUDE"
  | "SEGURANCA"
  | "EDUCACAO"
  | "TRANSPORTE"
  | "COMUNICACAO"
  | "ENERGIA"
  | "OUTROS";

export const MACRO_TYPE_ORDER: MacroType[] = [
  "SAUDE",
  "SEGURANCA",
  "EDUCACAO",
  "TRANSPORTE",
  "COMUNICACAO",
  "ENERGIA",
  "OUTROS",
];

export const MACRO_TYPE_LABELS: Record<MacroType, string> = {
  SAUDE: "Saúde",
  SEGURANCA: "Segurança",
  EDUCACAO: "Educação",
  TRANSPORTE: "Transporte",
  COMUNICACAO: "Comunicação",
  ENERGIA: "Energia",
  OUTROS: "Outros",
};

export const MACRO_TYPE_ICONS: Record<MacroType, string> = {
  SAUDE: "🏥",
  SEGURANCA: "🛡️",
  EDUCACAO: "🎓",
  TRANSPORTE: "🚌",
  COMUNICACAO: "📡",
  ENERGIA: "⚡",
  OUTROS: "📍",
};

export const TYPE_TO_MACRO: Record<string, MacroType> = {
  HOSPITAL: "SAUDE",
  POSTO_SAUDE: "SAUDE",
  PRONTO_ATENDIMENTO: "SAUDE",
  POLICIA_CIVIL: "SEGURANCA",
  POLICIA_MILITAR: "SEGURANCA",
  BOMBEIROS: "SEGURANCA",
  ESCOLA: "EDUCACAO",
  UNIVERSIDADE_PUBLICA: "EDUCACAO",
  INSTITUTO_FEDERAL: "EDUCACAO",
  TERMINAL_RODOVIARIO: "TRANSPORTE",
  TERMINAL_URBANO: "TRANSPORTE",
  AEROPORTO: "TRANSPORTE",
  PONTE: "TRANSPORTE",
  RODOVIA: "TRANSPORTE",
};

export function getMacroType(type: string): MacroType {
  return TYPE_TO_MACRO[type] ?? "OUTROS";
}

export function groupResultsByMacroType(
  results: NearbyByTypeItem[],
): Array<{ macroType: MacroType; items: NearbyByTypeItem[] }> {
  const groups = new Map<MacroType, NearbyByTypeItem[]>();

  for (const item of results) {
    const macroType = getMacroType(item.type);
    const items = groups.get(macroType) ?? [];
    items.push(item);
    groups.set(macroType, items);
  }

  return MACRO_TYPE_ORDER.filter((macroType) => groups.has(macroType)).map((macroType) => ({
    macroType,
    items: groups.get(macroType)!.sort((a, b) => a.distance_km - b.distance_km),
  }));
}

export function formatCepInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function isCompleteCep(value: string): boolean {
  return value.replace(/\D/g, "").length === 8;
}

export function formatDistanceKm(distanceKm: number): string {
  const km = Number(distanceKm);
  if (!Number.isFinite(km)) return "—";
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} km`;
}

export function getDistanceBadgeClassName(distanceKm: number): string {
  const km = Number(distanceKm);
  if (!Number.isFinite(km)) {
    return "bg-slate-500 text-white";
  }
  if (km <= 1) {
    return "bg-status-ok text-white";
  }
  if (km < 5) {
    return "bg-status-alerta text-white";
  }
  return "bg-status-critica text-white";
}

export function formatInfrastructureAddress(
  street: string | null,
  number: string | null,
  neighborhood: string | null,
  city: string | null,
): string {
  const streetLine = [street, number].filter(Boolean).join(", ");
  const parts = [streetLine, neighborhood, city].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "—";
}
