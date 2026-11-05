import { describe, expect, it } from 'vitest';

import {
  parseAlphaInput,
  parseHexInput,
  sanitizeAlphaInput,
  sanitizeHexInput
} from './input';
import { sliderKeyValue } from './keyboard';

describe('hex input', () => {
  it('keeps only hex digits, without the #, up to 8 characters', () => {
    expect(sanitizeHexInput('#zxcxz')).toBe('c');
    expect(sanitizeHexInput(' #FF00aa80ff ')).toBe('FF00aa80');
  });

  it.each([
    ['fff', 40, { hex: '#ffffff', alpha: 40 }],
    ['FF0000', 40, { hex: '#ff0000', alpha: 40 }],
    ['ff000080', 40, { hex: '#ff0000', alpha: 50 }],
    ['f008', 40, { hex: '#ff0000', alpha: 53 }]
  ])('parses %s', (draft, alpha, expected) => {
    expect(parseHexInput(draft, alpha)).toEqual(expected);
  });

  it.each(['', 'ff', 'fffff', 'fffffff', 'zzzzzz'])('rejects %j', (draft) => {
    expect(parseHexInput(draft, 100)).toBeNull();
  });
});

describe('alpha input', () => {
  it('keeps only digits, up to 3', () => {
    expect(sanitizeAlphaInput('5a0%9')).toBe('509');
  });

  it.each([
    ['0', 0],
    ['05', 5], // the old helper turned "05" into 0 via `slice(1, 1)`
    ['50', 50],
    ['100', 100],
    ['250', 100]
  ])('parses %s as %d', (draft, expected) => {
    expect(parseAlphaInput(draft)).toBe(expected);
  });

  it('returns null for an empty draft', () => {
    expect(parseAlphaInput('')).toBeNull();
  });
});

describe('sliderKeyValue', () => {
  const key = (k: string, shiftKey = false) => ({ key: k, shiftKey });

  it('steps with arrows, Shift, PageUp/PageDown, Home/End and clamps', () => {
    expect(sliderKeyValue(key('ArrowRight'), 50, 0, 100)).toBe(51);
    expect(sliderKeyValue(key('ArrowDown'), 50, 0, 100)).toBe(49);
    expect(sliderKeyValue(key('ArrowUp', true), 50, 0, 100)).toBe(60);
    expect(sliderKeyValue(key('PageDown'), 5, 0, 100)).toBe(0);
    expect(sliderKeyValue(key('Home'), 50, 0, 100)).toBe(0);
    expect(sliderKeyValue(key('End'), 50, 0, 360)).toBe(360);
    expect(sliderKeyValue(key('ArrowLeft'), 0, 0, 100)).toBe(0);
    expect(sliderKeyValue(key('a'), 50, 0, 100)).toBeNull();
  });
});
