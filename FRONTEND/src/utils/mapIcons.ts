import type { Expression, Map } from "maplibre-gl";

import { TYPE_ICONS } from "@/utils/status";

const ICON_CANVAS_SIZE = 88;
const ICON_PREFIX = "type-icon-";

export const MAP_POINT_RADIUS = 26;

export const STATUS_MAP_BG_COLORS = {
  OK: "#dcfce7",
  ALERTA: "#ffedd5",
  CRITICA: "#fee2e2",
} as const;

export const STATUS_MAP_STROKE_COLORS = {
  OK: "#86efac",
  ALERTA: "#fdba74",
  CRITICA: "#fca5a5",
} as const;

export function getMapPointPaint(statusField: string) {
  return {
    "circle-color": [
      "match",
      ["get", statusField],
      "OK",
      STATUS_MAP_BG_COLORS.OK,
      "ALERTA",
      STATUS_MAP_BG_COLORS.ALERTA,
      "CRITICA",
      STATUS_MAP_BG_COLORS.CRITICA,
      "#f1f5f9",
    ],
    "circle-radius": MAP_POINT_RADIUS,
    "circle-stroke-width": 2,
    "circle-stroke-color": [
      "match",
      ["get", statusField],
      "OK",
      STATUS_MAP_STROKE_COLORS.OK,
      "ALERTA",
      STATUS_MAP_STROKE_COLORS.ALERTA,
      "CRITICA",
      STATUS_MAP_STROKE_COLORS.CRITICA,
      "#e2e8f0",
    ],
    "circle-opacity": 0.95,
  } as const;
}

function loadEmojiImage(map: Map, id: string, emoji: string): Promise<void> {
  if (map.hasImage(id)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = ICON_CANVAS_SIZE;
    canvas.height = ICON_CANVAS_SIZE;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas não suportado"));
      return;
    }

    ctx.clearRect(0, 0, ICON_CANVAS_SIZE, ICON_CANVAS_SIZE);
    ctx.font = `${ICON_CANVAS_SIZE * 0.76}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, ICON_CANVAS_SIZE / 2, ICON_CANVAS_SIZE / 2 + 1);

    const image = new Image();
    image.onload = () => {
      if (!map.hasImage(id)) {
        map.addImage(id, image, { pixelRatio: 2 });
      }
      resolve();
    };
    image.onerror = () => reject(new Error(`Falha ao carregar ícone ${id}`));
    image.src = canvas.toDataURL();
  });
}

export async function registerTypeIcons(map: Map): Promise<void> {
  const loads = Object.entries(TYPE_ICONS).map(([type, emoji]) =>
    loadEmojiImage(map, `${ICON_PREFIX}${type}`, emoji),
  );

  loads.push(loadEmojiImage(map, `${ICON_PREFIX}DEFAULT`, "📍"));
  await Promise.all(loads);
}

export function getTypeIconImageExpression(): Expression {
  const expression: unknown[] = ["match", ["get", "type"]];

  for (const type of Object.keys(TYPE_ICONS)) {
    expression.push(type, `${ICON_PREFIX}${type}`);
  }

  expression.push(`${ICON_PREFIX}DEFAULT`);
  return expression as Expression;
}

export const TYPE_ICON_LAYOUT = {
  "icon-image": getTypeIconImageExpression(),
  "icon-size": 0.78,
  "icon-allow-overlap": true,
} as const;
