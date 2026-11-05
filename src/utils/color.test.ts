import { describe, expect, it } from 'vitest';

import {
  colorKey,
  formatColor,
  hexToHsv,
  hsvToHex,
  isGradientString,
  parseSolid,
  toHexAlpha
} from './color';

describe('parseSolid', () => {
  it.each([
    ['#FFF', { hex: '#ffffff', alpha: 100 }],
    ['rgba(0, 0, 0, 0.5)', { hex: '#000000', alpha: 50 }],
    ['hsl(0, 100%, 50%)', { hex: '#ff0000', alpha: 100 }],
    ['rebeccapurple', { hex: '#663399', alpha: 100 }],
    ['transparent', { hex: '#000000', alpha: 0 }],
    ['  #00ff0080  ', { hex: '#00ff00', alpha: 50 }]
  ])('parses %s', (input, expected) => {
    expect(parseSolid(input)).toEqual(expected);
  });

  it.each([undefined, '', 'nope', 'linear-gradient(red 0%, blue 100%)'])(
    'returns null for %j',
    (input) => {
      expect(parseSolid(input)).toBeNull();
    }
  );

  it('toHexAlpha falls back to white', () => {
    expect(toHexAlpha('')).toEqual({ hex: '#ffffff', alpha: 100 });
  });
});

describe('formatColor', () => {
  const semiRed = { hex: '#ff0000', alpha: 50 };

  it.each([
    ['rgb', 'rgba(255, 0, 0, 0.5)'],
    ['hsl', 'hsla(0, 100%, 50%, 0.5)'],
    ['hex', '#ff000080']
  ] as const)('formats as %s', (format, expected) => {
    expect(formatColor(semiRed, format)).toBe(expected);
  });

  it('uses 6-digit hex for opaque colors', () => {
    expect(formatColor({ hex: '#ff0000', alpha: 100 }, 'hex')).toBe('#ff0000');
  });

  it.each([
    ['rgb', 'rgb(255, 0, 0)'],
    ['hsl', 'hsl(0, 100%, 50%)'],
    ['hex', '#ff0000']
  ] as const)(
    'drops alpha for %s when includeAlpha is false',
    (format, expected) => {
      expect(formatColor(semiRed, format, false)).toBe(expected);
    }
  );

  it('accepts color strings', () => {
    expect(formatColor('rgba(0, 0, 255, 0.25)', 'hex')).toBe('#0000ff40');
  });
});

describe('hsv helpers', () => {
  it('round-trips a saturated color', () => {
    expect(hsvToHex(hexToHsv('#3366cc'))).toBe('#3366cc');
  });

  it.each(['#000000', '#ffffff', '#808080'])(
    'keeps the previous hue for the achromatic color %s',
    (hex) => {
      expect(hexToHsv(hex, 210).h).toBe(210);
    }
  );
});

describe('misc', () => {
  it('detects gradient strings', () => {
    expect(isGradientString('radial-gradient(circle, red, blue)')).toBe(true);
    expect(isGradientString('background: linear-gradient(red, blue)')).toBe(
      true
    );
    expect(isGradientString('#fff')).toBe(false);
    expect(isGradientString(undefined)).toBe(false);
  });

  it('colorKey compares colors across notations', () => {
    expect(colorKey('#FF6900')).toBe(colorKey('rgb(255, 105, 0)'));
    expect(colorKey('#FF6900')).not.toBe(colorKey('rgba(255, 105, 0, 0.5)'));
  });
});
