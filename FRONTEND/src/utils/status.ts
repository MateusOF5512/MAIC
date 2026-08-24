import type { InfrastructureStatus } from "@/types/infrastructure";

export const STATUS_LABELS: Record<InfrastructureStatus, string> = {
  OK: "OK",
  ALERTA: "Alerta",
  CRITICA: "Crítica",
};

export const STATUS_COLORS: Record<InfrastructureStatus, string> = {
  OK: "#16a34a",
  ALERTA: "#ea580c",
  CRITICA: "#dc2626",
};

export const STATUS_BG_CLASSES: Record<InfrastructureStatus, string> = {
  OK: "bg-status-ok/10 text-status-ok border-status-ok/30",
  ALERTA: "bg-status-alerta/10 text-status-alerta border-status-alerta/30",
  CRITICA: "bg-status-critica/10 text-status-critica border-status-critica/30",
};

export const TYPE_LABELS: Record<string, string> = {
  HOSPITAL: "Hospital",
  ESCOLA: "Escola",
  POLICIA_CIVIL: "Polícia Civil",
  POLICIA_MILITAR: "Polícia Militar",
  TERMINAL_RODOVIARIO: "Terminal rodoviário",
  TERMINAL_URBANO: "Terminal urbano",
  AEROPORTO: "Aeroporto",
  PONTE: "Ponte",
  UNIVERSIDADE_PUBLICA: "Universidade pública",
  INSTITUTO_FEDERAL: "Instituto federal",
  POSTO_SAUDE: "Posto de saúde",
  RODOVIA: "Rodovia",
  BOMBEIROS: "Corpo de Bombeiros",
  PRONTO_ATENDIMENTO: "Pronto atendimento",
};

export const TYPE_ICONS: Record<string, string> = {
  HOSPITAL: "🏥",
  ESCOLA: "🏫",
  POLICIA_CIVIL: "🚔",
  POLICIA_MILITAR: "👮",
  TERMINAL_RODOVIARIO: "🚌",
  TERMINAL_URBANO: "🚏",
  AEROPORTO: "🛫",
  PONTE: "🌉",
  UNIVERSIDADE_PUBLICA: "🎓",
  INSTITUTO_FEDERAL: "📚",
  POSTO_SAUDE: "💉",
  RODOVIA: "🚗",
  BOMBEIROS: "🚒",
  PRONTO_ATENDIMENTO: "🩺",
};

export function getTypeIcon(type: string): string {
  return TYPE_ICONS[type] ?? "📍";
}

export function getTypeLabel(type: string): string {
  return TYPE_LABELS[type] ?? type.replaceAll("_", " ");
}

export function getManagementLabel(management: string | null | undefined): string {
  if (!management) return "—";
  return management.replaceAll("_", " ");
}
