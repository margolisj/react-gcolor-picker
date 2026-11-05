import tinycolor from 'tinycolor2';

import type { HexAlpha } from './color';
import { clamp } from './math';

const HEX_INPUT_RE = /^(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** Keeps only hex digits (dropping a leading `#`), max 8 characters (`rrggbbaa`). */
export const sanitizeHexInput = (value: string) =>
  value
    .trim()
    .replace(/^#/, '')
    .replace(/[^0-9a-f]/gi, '')
    .slice(0, 8);

/** Keeps only digits, max 3 characters. */
export const sanitizeAlphaInput = (value: string) =>
  value.replace(/\D/g, '').slice(0, 3);

/**
 * Parses a hex input draft (without `#`). 3 / 6 digit values keep `alpha`;
 * 4 / 8 digit values carry their own alpha. Returns `null` if invalid.
 */
export const parseHexInput = (
  draft: string,
  alpha: number
): HexAlpha | null => {
  if (!HEX_INPUT_RE.test(draft)) return null;
  const color = tinycolor(`#${draft}`);
  if (!color.isValid()) return null;
  const hasAlpha = draft.length === 4 || draft.length === 8;
  return {
    hex: color.toHexString(),
    alpha: hasAlpha ? Math.round(color.getAlpha() * 100) : alpha
  };
};

/** Parses an alpha input draft, clamped to 0–100. Returns `null` if empty / invalid. */
export const parseAlphaInput = (draft: string): number | null => {
  const value = Number.parseInt(draft, 10);
  return Number.isNaN(value) ? null : clamp(value, 0, 100);
};

export const stripHash = (hex: string) => hex.replace(/^#/, '');
