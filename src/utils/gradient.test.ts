import { describe, expect, it } from 'vitest';

import { DEFAULT_COLORS } from '../constants';
import {
  addStop,
  DEFAULT_GRADIENT,
  gradientFromValue,
  parseGradient,
  removeStop,
  serializeGradient,
  stopsPreview,
  updateStop
} from './gradient';
import type { GradientValue } from './gradient';

const positions = (value: string) =>
  parseGradient(value)?.stops.map((s) => s.position);

describe('parseGradient', () => {
  it('parses a linear gradient with an angle and stops', () => {
    expect(
      parseGradient(
        'linear-gradient(45deg, #ff0000 0%, rgba(0, 0, 255, 0.5) 100%)'
      )
    ).toEqual({
      type: 'linear',
      angle: 45,
      radialPosition: 'circle at center',
      stops: [
        { color: 'rgb(255, 0, 0)', position: 0 },
        { color: 'rgba(0, 0, 255, 0.5)', position: 1 }
      ]
    });
  });

  it('keeps fractional stop positions (old parser truncated 8.5% to 8%)', () => {
    expect(positions('linear-gradient(90deg, red 8.5%, blue 91.25%)')).toEqual([
      0.085, 0.9125
    ]);
  });

  it.each([
    ['to top', 0],
    ['to right', 90],
    ['to bottom', 180],
    ['to left', 270],
    ['to top right', 45],
    ['to left  top', 315],
    ['0.25turn', 90],
    ['100grad', 90],
    ['-90deg', 270],
    ['450deg', 90],
    [`${Math.PI}rad`, 180]
  ])('converts the direction %s to %d degrees', (direction, angle) => {
    expect(
      parseGradient(`linear-gradient(${direction}, red 0%, blue 100%)`)?.angle
    ).toBe(angle);
  });

  it('defaults to 180deg when no direction is given', () => {
    const g = parseGradient('linear-gradient(red 0%, blue 100%)');
    expect(g?.angle).toBe(180);
    expect(g?.stops).toHaveLength(2);
  });

  it.each([
    ['circle at center', 'circle at center'],
    ['circle at top left', 'circle at left top'],
    ['circle at right', 'circle at right'],
    ['ellipse at bottom', 'circle at center bottom'],
    ['circle', 'circle at center'],
    ['circle at 20% 30%', 'circle at center']
  ])('normalizes the radial shape "%s" to "%s"', (shape, expected) => {
    const g = parseGradient(`radial-gradient(${shape}, red 0%, blue 100%)`);
    expect(g?.type).toBe('radial');
    expect(g?.radialPosition).toBe(expected);
  });

  it('accepts a CSS declaration wrapper', () => {
    expect(
      parseGradient(
        'background-image: linear-gradient(90deg, red 0%, blue 100%);'
      )?.angle
    ).toBe(90);
  });

  describe('stop positions follow the CSS rules', () => {
    it('defaults the first and last stops to 0% and 100%', () => {
      expect(positions('linear-gradient(red, blue)')).toEqual([0, 1]);
    });

    it('spreads stops without a position evenly between their neighbours', () => {
      expect(positions('linear-gradient(red, green, blue)')).toEqual([
        0, 0.5, 1
      ]);
      expect(
        positions('linear-gradient(red 10%, green, yellow, blue 70%)')
      ).toEqual([0.1, 0.3, 0.5, 0.7]);
    });

    it('expands double-position stops', () => {
      expect(positions('linear-gradient(red 0% 20%, blue 100%)')).toEqual([
        0, 0.2, 1
      ]);
    });

    it('raises a position that is smaller than an earlier one', () => {
      expect(positions('linear-gradient(red 50%, blue 20%)')).toEqual([
        0.5, 0.5
      ]);
    });

    it('clamps positions to 0–100%', () => {
      expect(positions('linear-gradient(red -10%, blue 120%)')).toEqual([0, 1]);
    });
  });

  it.each([
    ['empty', ''],
    ['a solid color', '#ff0000'],
    ['an unsupported gradient', 'conic-gradient(red, blue)'],
    [
      'unbalanced parentheses',
      'linear-gradient(90deg, rgb(0, 0, 0 0%, red 100%)'
    ],
    ['a single stop', 'linear-gradient(90deg, red 0%)'],
    ['an invalid color', 'linear-gradient(90deg, notacolor 0%, red 100%)'],
    [
      'non-percentage positions',
      'linear-gradient(90deg, red 10px, blue 100px)'
    ],
    [
      'multiple backgrounds',
      'linear-gradient(red, blue), linear-gradient(red, blue)'
    ]
  ])('returns null for %s', (_, value) => {
    expect(parseGradient(value)).toBeNull();
  });

  it('parses every built-in default gradient', () => {
    const gradients = DEFAULT_COLORS.filter((c) => c.includes('gradient'));
    expect(gradients.length).toBeGreaterThan(0);
    for (const g of gradients) expect(parseGradient(g), g).not.toBeNull();
  });
});

describe('serializeGradient', () => {
  const gradient: GradientValue = {
    type: 'linear',
    angle: 180,
    radialPosition: 'circle at center',
    stops: [
      { color: 'rgba(0, 0, 255, 0.5)', position: 1 },
      { color: 'rgb(255, 0, 0)', position: 0.085 }
    ]
  };

  it('keeps the 0.0.9 output shape and sorts stops by position', () => {
    expect(serializeGradient(gradient)).toBe(
      'linear-gradient(180deg, rgb(255, 0, 0) 8.50%,rgba(0, 0, 255, 0.5) 100.00%)'
    );
  });

  it('formats stop colors', () => {
    expect(serializeGradient(gradient, 'hex')).toBe(
      'linear-gradient(180deg, #ff0000 8.50%,#0000ff80 100.00%)'
    );
    expect(serializeGradient(gradient, 'hsl')).toBe(
      'linear-gradient(180deg, hsl(0, 100%, 50%) 8.50%,hsla(240, 100%, 50%, 0.5) 100.00%)'
    );
  });

  it('drops alpha when includeAlpha is false', () => {
    expect(serializeGradient(gradient, 'rgb', false)).toBe(
      'linear-gradient(180deg, rgb(255, 0, 0) 8.50%,rgb(0, 0, 255) 100.00%)'
    );
  });

  it('writes the radial position for radial gradients', () => {
    expect(
      serializeGradient({
        ...gradient,
        type: 'radial',
        radialPosition: 'circle at left top'
      })
    ).toMatch(/^radial-gradient\(circle at left top, /);
  });

  it('round-trips through parseGradient', () => {
    const value =
      'radial-gradient(circle at right bottom, rgb(255, 0, 0) 12.50%,rgba(0, 0, 255, 0.25) 87.00%)';
    expect(serializeGradient(parseGradient(value)!)).toBe(value);
  });

  it('previews stops left to right', () => {
    expect(stopsPreview(gradient.stops)).toBe(
      'linear-gradient(to right, rgb(255, 0, 0) 8.5%, rgba(0, 0, 255, 0.5) 100%)'
    );
  });
});

describe('gradientFromValue', () => {
  it('builds a black → color gradient from a solid color', () => {
    expect(gradientFromValue('#ff0000').stops).toEqual([
      { color: 'rgb(0, 0, 0)', position: 0 },
      { color: 'rgb(255, 0, 0)', position: 1 }
    ]);
  });

  it.each([undefined, '', 'transparent', 'not a color'])(
    'falls back to the default gradient for %j',
    (value) => {
      expect(gradientFromValue(value)).toEqual(DEFAULT_GRADIENT);
    }
  );

  it('returns a fresh copy of the default', () => {
    const a = gradientFromValue('');
    a.stops[0].color = 'changed';
    expect(DEFAULT_GRADIENT.stops[0].color).toBe('rgb(0, 0, 0)');
  });
});

describe('stop editing helpers', () => {
  const base = parseGradient('linear-gradient(90deg, red 0%, blue 100%)')!;

  it('updateStop patches one stop and clamps its position', () => {
    const next = updateStop(base, 1, {
      position: 1.5,
      color: 'rgb(0, 255, 0)'
    });
    expect(next.stops[1]).toEqual({ color: 'rgb(0, 255, 0)', position: 1 });
    expect(next.stops[0]).toBe(base.stops[0]);
  });

  it('addStop inserts in position order and returns the new index', () => {
    const { gradient, index } = addStop(base, {
      color: 'rgb(0, 255, 0)',
      position: 0.4
    });
    expect(index).toBe(1);
    expect(gradient.stops.map((s) => s.position)).toEqual([0, 0.4, 1]);
  });

  it('removeStop never goes below two stops', () => {
    expect(removeStop(base, 0)).toBeNull();
    const three = addStop(base, {
      color: 'rgb(0, 255, 0)',
      position: 0.5
    }).gradient;
    expect(removeStop(three, 1)?.stops).toEqual(base.stops);
  });
});
