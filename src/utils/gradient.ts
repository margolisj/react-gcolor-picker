import type { ColorFormat } from '../types';
import { formatColor, parseSolid, toRgbString } from './color';
import { clamp, round } from './math';

export type GradientType = 'linear' | 'radial';

export interface GradientStop {
  /** `rgb(...)` / `rgba(...)` string. */
  color: string;
  /** 0–1. */
  position: number;
}

export interface GradientValue {
  type: GradientType;
  /** Angle of a linear gradient in degrees. Kept while in radial mode so toggling back restores it. */
  angle: number;
  /** One of `RADIAL_POSITIONS[].css`. Kept while in linear mode. */
  radialPosition: string;
  /** Stops in insertion order (index = identity); serialized sorted by position. */
  stops: GradientStop[];
}

export const RADIAL_POSITIONS = [
  { key: 'tl', css: 'circle at left top', label: 'Top left' },
  { key: 'tm', css: 'circle at center top', label: 'Top' },
  { key: 'tr', css: 'circle at right top', label: 'Top right' },
  { key: 'l', css: 'circle at left', label: 'Left' },
  { key: 'm', css: 'circle at center', label: 'Center' },
  { key: 'r', css: 'circle at right', label: 'Right' },
  { key: 'bl', css: 'circle at left bottom', label: 'Bottom left' },
  { key: 'bm', css: 'circle at center bottom', label: 'Bottom' },
  { key: 'br', css: 'circle at right bottom', label: 'Bottom right' }
] as const;

const DEFAULT_ANGLE = 180;
const DEFAULT_RADIAL_POSITION = 'circle at center';

export const DEFAULT_GRADIENT: Readonly<GradientValue> = Object.freeze({
  type: 'linear',
  angle: DEFAULT_ANGLE,
  radialPosition: DEFAULT_RADIAL_POSITION,
  stops: [
    { color: 'rgb(0, 0, 0)', position: 0 },
    { color: 'rgba(183, 80, 174, 0.92)', position: 1 }
  ]
});

const cloneGradient = (g: Readonly<GradientValue>): GradientValue => ({
  ...g,
  stops: g.stops.map((s) => ({ ...s }))
});

/* -------------------------------------------------------------------------- */
/* Parsing                                                                    */
/* -------------------------------------------------------------------------- */

/** Splits on commas that are not inside parentheses. Returns `null` if parentheses are unbalanced. */
const splitTopLevel = (input: string): string[] | null => {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth < 0) return null;
    } else if (ch === ',' && depth === 0) {
      parts.push(input.slice(start, i).trim());
      start = i + 1;
    }
  }
  if (depth !== 0) return null;
  parts.push(input.slice(start).trim());
  return parts;
};

const NUMBER = String.raw`[+-]?(?:\d+\.?\d*|\.\d+)`;
const ANGLE_RE = new RegExp(`^(${NUMBER})(deg|grad|rad|turn)$`, 'i');
const STOP_RE = new RegExp(
  `^([\\s\\S]*?)(?:\\s+(${NUMBER})%)?(?:\\s+(${NUMBER})%)?$`
);

const ANGLE_UNIT_TO_DEG: Record<string, number> = {
  deg: 1,
  grad: 0.9,
  rad: 180 / Math.PI,
  turn: 360
};

const SIDE_TO_ANGLE: Record<string, number> = {
  'to top': 0,
  'to top right': 45,
  'to right top': 45,
  'to right': 90,
  'to right bottom': 135,
  'to bottom right': 135,
  'to bottom': 180,
  'to bottom left': 225,
  'to left bottom': 225,
  'to left': 270,
  'to left top': 315,
  'to top left': 315
};

const normalizeAngle = (deg: number) => round(((deg % 360) + 360) % 360, 2);

/** Angle (deg) for a linear gradient's first argument, or `null` if it isn't a direction. */
const parseLinearDirection = (token: string): number | null => {
  const t = token.trim().toLowerCase().replace(/\s+/g, ' ');
  const angle = t.match(ANGLE_RE);
  if (angle) {
    return normalizeAngle(Number(angle[1]) * ANGLE_UNIT_TO_DEG[angle[2]]);
  }
  return t in SIDE_TO_ANGLE ? SIDE_TO_ANGLE[t] : null;
};

/** Canonical `circle at …` for a radial gradient's first argument, or `null` if it isn't a shape/position. */
const parseRadialShape = (token: string): string | null => {
  const t = token.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!/^(?:circle|ellipse|closest-|farthest-|at )/.test(t)) return null;
  const at = t.match(/(?:^|\s)at (.+)$/);
  if (!at) return DEFAULT_RADIAL_POSITION;

  let x = 'center';
  let y = 'center';
  for (const word of at[1].split(' ')) {
    if (word === 'left' || word === 'right') x = word;
    else if (word === 'top' || word === 'bottom') y = word;
    else if (word !== 'center') return DEFAULT_RADIAL_POSITION; // lengths / percentages aren't supported
  }
  return y === 'center' ? `circle at ${x}` : `circle at ${x} ${y}`;
};

interface RawStop {
  color: string;
  position?: number;
}

/** A color stop: `<color> [<pos>] [<pos>]` (percentages only). */
const parseStop = (token: string): RawStop[] | null => {
  const match = token.trim().match(STOP_RE);
  if (!match) return null;
  const solid = parseSolid(match[1]);
  if (!solid) return null;
  const color = toRgbString(solid);
  const positions = [match[2], match[3]]
    .filter((p): p is string => p !== undefined)
    .map((p) => Number(p) / 100);
  if (positions.length === 0) return [{ color }];
  return positions.map((position) => ({ color, position }));
};

/**
 * Fixes up stop positions the way CSS does: the first / last default to 0% / 100%,
 * stops without a position are spread evenly between their neighbours, and a
 * position smaller than an earlier one is raised to match it.
 */
const resolvePositions = (raw: RawStop[]): GradientStop[] => {
  const positions = raw.map((s) => s.position);
  const last = positions.length - 1;
  positions[0] ??= 0;
  positions[last] ??= 1;

  let max = -Infinity;
  for (let i = 0; i <= last; i++) {
    const p = positions[i];
    if (p === undefined) continue;
    max = Math.max(max, p);
    positions[i] = max;
  }

  for (let i = 1; i < last; i++) {
    if (positions[i] !== undefined) continue;
    const prev = i - 1;
    let next = i + 1;
    while (positions[next] === undefined) next++;
    const from = positions[prev] as number;
    const to = positions[next] as number;
    for (let k = i; k < next; k++) {
      positions[k] = from + ((to - from) * (k - prev)) / (next - prev);
    }
  }

  return raw.map((s, i) => ({
    color: s.color,
    position: round(clamp(positions[i] as number, 0, 1), 4)
  }));
};

/**
 * Parses a `linear-gradient(...)` / `radial-gradient(...)` string.
 * Also accepts a leading `background:` / `background-image:` and trailing `;`.
 * Returns `null` if the string isn't a gradient this picker can edit.
 */
export const parseGradient = (
  input: string | undefined
): GradientValue | null => {
  if (!input) return null;
  const str = input
    .trim()
    .replace(/^background(?:-image)?\s*:\s*/i, '')
    .replace(/;\s*$/, '')
    .trim();
  const match = str.match(/^(linear|radial)-gradient\s*\(([\s\S]*)\)$/i);
  if (!match) return null;

  const type = match[1].toLowerCase() as GradientType;
  const parts = splitTopLevel(match[2]);
  if (!parts || parts.length === 0) return null;

  let angle = DEFAULT_ANGLE;
  let radialPosition = DEFAULT_RADIAL_POSITION;
  let firstStop = 0;

  if (type === 'linear') {
    const direction = parseLinearDirection(parts[0]);
    if (direction !== null) {
      angle = direction;
      firstStop = 1;
    }
  } else {
    const shape = parseRadialShape(parts[0]);
    if (shape !== null) {
      radialPosition = shape;
      firstStop = 1;
    }
  }

  const raw: RawStop[] = [];
  for (const part of parts.slice(firstStop)) {
    const stops = parseStop(part);
    if (!stops) return null;
    raw.push(...stops);
  }
  if (raw.length < 2) return null;

  return { type, angle, radialPosition, stops: resolvePositions(raw) };
};

/**
 * Gradient to edit for any picker value: a parsed gradient, a black → color
 * gradient for solid colors, or the default gradient.
 */
export const gradientFromValue = (value: string | undefined): GradientValue => {
  const parsed = parseGradient(value);
  if (parsed) return parsed;

  const solid =
    value && value.trim().toLowerCase() !== 'transparent'
      ? parseSolid(value)
      : null;
  const gradient = cloneGradient(DEFAULT_GRADIENT);
  if (solid) gradient.stops[1].color = toRgbString(solid);
  return gradient;
};

/* -------------------------------------------------------------------------- */
/* Serializing                                                                */
/* -------------------------------------------------------------------------- */

/** Stops sorted by position (stable, so equal positions keep their order). */
export const sortedStops = (stops: GradientStop[]) =>
  stops
    .map((stop, index) => ({ stop, index }))
    .sort((a, b) => a.stop.position - b.stop.position || a.index - b.index)
    .map(({ stop }) => stop);

const formatPercent = (position: number) =>
  `${round(position * 100, 2).toFixed(2)}%`;

/** Serializes a gradient, formatting stop colors with `format`. */
export const serializeGradient = (
  gradient: GradientValue,
  format: ColorFormat = 'rgb',
  includeAlpha = true
): string => {
  const head =
    gradient.type === 'linear'
      ? `${round(gradient.angle, 2)}deg`
      : gradient.radialPosition;
  const stops = sortedStops(gradient.stops)
    .map(
      (stop) =>
        `${formatColor(stop.color, format, includeAlpha)} ${formatPercent(stop.position)}`
    )
    .join(',');
  return `${gradient.type}-gradient(${head}, ${stops})`;
};

/** Left-to-right preview of the stops, used behind the stop markers. */
export const stopsPreview = (stops: GradientStop[]) =>
  `linear-gradient(to right, ${sortedStops(stops)
    .map((stop) => `${stop.color} ${round(stop.position * 100, 2)}%`)
    .join(', ')})`;

/* -------------------------------------------------------------------------- */
/* Editing (pure helpers)                                                     */
/* -------------------------------------------------------------------------- */

export const MIN_STOPS = 2;

export const updateStop = (
  gradient: GradientValue,
  index: number,
  patch: Partial<GradientStop>
): GradientValue => ({
  ...gradient,
  stops: gradient.stops.map((stop, i) =>
    i === index
      ? {
          ...stop,
          ...patch,
          position: round(clamp(patch.position ?? stop.position, 0, 1), 4)
        }
      : stop
  )
});

/** Inserts a stop, keeping the array sorted by position. Returns the new stop's index. */
export const addStop = (
  gradient: GradientValue,
  stop: GradientStop
): { gradient: GradientValue; index: number } => {
  const position = round(clamp(stop.position, 0, 1), 4);
  const stops = [...gradient.stops];
  let index = stops.findIndex((s) => s.position > position);
  if (index === -1) index = stops.length;
  stops.splice(index, 0, { color: stop.color, position });
  return { gradient: { ...gradient, stops }, index };
};

/** Removes a stop. Returns `null` when the gradient would drop below two stops. */
export const removeStop = (
  gradient: GradientValue,
  index: number
): GradientValue | null =>
  gradient.stops.length <= MIN_STOPS
    ? null
    : { ...gradient, stops: gradient.stops.filter((_, i) => i !== index) };
