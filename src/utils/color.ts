import tinycolor from 'tinycolor2';

import type { ColorFormat } from '../types';

/** A solid color: `hex` is `#rrggbb` (lowercase), `alpha` is 0–100. */
export interface HexAlpha {
  hex: string;
  alpha: number;
}

/** HSV color: `h` is 0–360, `s` and `v` are 0–1. */
export interface Hsv {
  h: number;
  s: number;
  v: number;
}

export const DEFAULT_SOLID: HexAlpha = { hex: '#ffffff', alpha: 100 };

const GRADIENT_RE = /(?:linear|radial)-gradient\s*\(/i;

export const isGradientString = (value: string | undefined): boolean =>
  !!value && GRADIENT_RE.test(value);

/** Parses any solid CSS color tinycolor understands. Returns `null` for gradients / invalid input. */
export const parseSolid = (value: string | undefined): HexAlpha | null => {
  if (!value || isGradientString(value)) return null;
  const color = tinycolor(value.trim());
  if (!color.isValid()) return null;
  return {
    hex: color.toHexString(),
    alpha: Math.round(color.getAlpha() * 100)
  };
};

/** Like `parseSolid`, but falls back to white for empty / invalid input. */
export const toHexAlpha = (value: string | undefined): HexAlpha =>
  parseSolid(value) ?? DEFAULT_SOLID;

const toTinycolor = (color: HexAlpha | string) =>
  typeof color === 'string'
    ? tinycolor(color)
    : tinycolor(color.hex).setAlpha(color.alpha / 100);

/**
 * Formats a color for output. When `includeAlpha` is false the color is made
 * opaque, so every format behaves the same way when the alpha UI is hidden.
 */
export const formatColor = (
  color: HexAlpha | string,
  format: ColorFormat,
  includeAlpha = true
): string => {
  const c = toTinycolor(color);
  if (!includeAlpha) c.setAlpha(1);
  switch (format) {
    case 'hex':
      return c.getAlpha() < 1 ? c.toHex8String() : c.toHexString();
    case 'hsl':
      return c.toHslString();
    case 'rgb':
    default:
      return c.toRgbString();
  }
};

/** `rgb(...)` / `rgba(...)` string, used for gradient stops internally. */
export const toRgbString = (color: HexAlpha | string): string =>
  toTinycolor(color).toRgbString();

/** Normalized key for comparing colors regardless of their notation. */
export const colorKey = (color: HexAlpha | string): string =>
  toTinycolor(color).toHex8String();

/**
 * HSV for a hex color. Achromatic colors (grays, black) have no hue, so the
 * previous hue is kept and the hue slider doesn't jump back to red.
 */
export const hexToHsv = (hex: string, fallbackHue = 0): Hsv => {
  const { h, s, v } = tinycolor(hex).toHsv();
  return { h: s === 0 || v === 0 ? fallbackHue : h, s, v };
};

export const hsvToHex = ({ h, s, v }: Hsv): string =>
  tinycolor({ h, s, v }).toHexString();

/** `{ r, g, b }` of a hex color. */
export const hexToRgb = (hex: string) => {
  const { r, g, b } = tinycolor(hex).toRgb();
  return { r, g, b };
};
