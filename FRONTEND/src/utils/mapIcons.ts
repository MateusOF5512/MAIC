import type {
  CircleLayerSpecification,
  Map as MaplibreMap,
  SymbolLayerSpecification,
} from "maplibre-gl";

import { getMacroType, MACRO_TYPE_ORDER, type MacroType } from "@/utils/busca";
import { TYPE_ICONS } from "@/utils/status";

const TYPE_ALIASES: Record<string, keyof typeof TYPE_ICONS> = {
  Hospital: "HOSPITAL",
  "Hospital/Maternidade": "HOSPITAL",
  Escola: "ESCOLA",
  "Polícia Civil": "POLICIA_CIVIL",
  "Polícia Militar": "POLICIA_MILITAR",
  Transporte: "TERMINAL_RODOVIARIO",
  Aeroporto: "AEROPORTO",
  "Ponte/Rodovia": "PONTE",
};

const ICON_CANVAS_SIZE = 88;
const ICON_PREFIX = "type-icon-";
const emojiDataUrlCache = new Map<string, string>();

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

const MACRO_HUES: Record<MacroType, number> = {
  SAUDE: 210,
  SEGURANCA: 355,
  EDUCACAO: 145,
  TRANSPORTE: 275,
  COMUNICACAO: 185,
  ENERGIA: 38,
  OUTROS: 215,
};

function hslToHex(h: number, s: number, l: number): string {
  const sat = s / 100;
  const light = l / 100;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = light - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function buildTypeColorMaps(): {
  fill: Record<string, string>;
  stroke: Record<string, string>;
} {
  const typesByMacro = new Map<MacroType, string[]>();

  for (const type of Object.keys(TYPE_ICONS)) {
    const macro = getMacroType(type);
    const types = typesByMacro.get(macro) ?? [];
    types.push(type);
    typesByMacro.set(macro, types);
  }

  for (const types of typesByMacro.values()) {
    types.sort();
  }

  const fill: Record<string, string> = {};
  const stroke: Record<string, string> = {};

  for (const macro of MACRO_TYPE_ORDER) {
    const types = typesByMacro.get(macro);
    if (!types?.length) continue;

    const hue = MACRO_HUES[macro];
    const isMuted = macro === "OUTROS";

    types.forEach((type, index) => {
      const saturation = isMuted ? 18 + index * 4 : 52 + index * 8;
      fill[type] = hslToHex(hue, saturation, 90 - index * 5);
      stroke[type] = hslToHex(hue, Math.min(saturation + 8, 85), 72 - index * 5);
    });
  }

  return { fill, stroke };
}

const TYPE_COLOR_MAPS = buildTypeColorMaps();

export const TYPE_MAP_FILL_COLORS = TYPE_COLOR_MAPS.fill;
export const TYPE_MAP_STROKE_COLORS = TYPE_COLOR_MAPS.stroke;

type CircleColorExpression = NonNullable<CircleLayerSpecification["paint"]>["circle-color"];

function buildTypeMatchExpression(
  colors: Record<string, string>,
  fallback: string,
): CircleColorExpression {
  const expression: unknown[] = ["match", ["get", "type"]];

  for (const [type, color] of Object.entries(colors)) {
    expression.push(type, color);
  }

  for (const [alias, code] of Object.entries(TYPE_ALIASES)) {
    const color = colors[code];
    if (color) {
      expression.push(alias, color);
    }
  }

  expression.push(fallback);
  return expression as CircleColorExpression;
}

type CirclePaint = NonNullable<CircleLayerSpecification["paint"]>;

export function getMapPointPaintByType(): CirclePaint {
  return {
    "circle-color": buildTypeMatchExpression(TYPE_MAP_FILL_COLORS, "#f1f5f9"),
    "circle-radius": MAP_POINT_RADIUS,
    "circle-stroke-width": 2,
    "circle-stroke-color": buildTypeMatchExpression(TYPE_MAP_STROKE_COLORS, "#e2e8f0"),
    "circle-opacity": 0.95,
  };
}

export function applyMapPointPaint(
  map: MaplibreMap,
  colorByType: boolean,
  statusField = "status",
): void {
  if (!map.getLayer("points")) return;

  if (colorByType) {
    const paint = getMapPointPaintByType();
    map.setPaintProperty("points", "circle-color", paint["circle-color"]);
    map.setPaintProperty("points", "circle-stroke-color", paint["circle-stroke-color"]);
    return;
  }

  const paint = getMapPointPaint(statusField);
  map.setPaintProperty("points", "circle-color", paint["circle-color"]);
  map.setPaintProperty("points", "circle-stroke-color", paint["circle-stroke-color"]);
}

export function getMapPointPaint(statusField: string): CirclePaint {
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
  };
}

function createEmojiDataUrl(emoji: string): string {
  const cached = emojiDataUrlCache.get(emoji);
  if (cached) {
    return cached;
  }

  const canvas = document.createElement("canvas");
  canvas.width = ICON_CANVAS_SIZE;
  canvas.height = ICON_CANVAS_SIZE;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas não suportado");
  }

  ctx.clearRect(0, 0, ICON_CANVAS_SIZE, ICON_CANVAS_SIZE);
  ctx.font = `${ICON_CANVAS_SIZE * 0.76}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, ICON_CANVAS_SIZE / 2, ICON_CANVAS_SIZE / 2 + 1);

  const dataUrl = canvas.toDataURL();
  emojiDataUrlCache.set(emoji, dataUrl);
  return dataUrl;
}

function loadEmojiImage(map: MaplibreMap, id: string, emoji: string): Promise<void> {
  if (map.hasImage(id)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (!map.hasImage(id)) {
        map.addImage(id, image, { pixelRatio: 2 });
      }
      resolve();
    };
    image.onerror = () => reject(new Error(`Falha ao carregar ícone ${id}`));
    image.src = createEmojiDataUrl(emoji);
  });
}

export async function registerTypeIcons(map: MaplibreMap): Promise<void> {
  const loads = Object.entries(TYPE_ICONS).map(([type, emoji]) =>
    loadEmojiImage(map, `${ICON_PREFIX}${type}`, emoji),
  );

  loads.push(loadEmojiImage(map, `${ICON_PREFIX}DEFAULT`, "📍"));
  await Promise.all(loads);
}

type SymbolIconLayout = NonNullable<SymbolLayerSpecification["layout"]>;
type IconImageExpression = NonNullable<SymbolIconLayout["icon-image"]>;

export function getTypeIconImageExpression(): IconImageExpression {
  const expression: unknown[] = ["match", ["get", "type"]];

  for (const type of Object.keys(TYPE_ICONS)) {
    expression.push(type, `${ICON_PREFIX}${type}`);
  }

  for (const [alias, code] of Object.entries(TYPE_ALIASES)) {
    expression.push(alias, `${ICON_PREFIX}${code}`);
  }

  expression.push(`${ICON_PREFIX}DEFAULT`);
  return expression as IconImageExpression;
}

export const TYPE_ICON_LAYOUT: SymbolIconLayout = {
  "icon-image": getTypeIconImageExpression(),
  "icon-size": 0.78,
  "icon-allow-overlap": true,
};
