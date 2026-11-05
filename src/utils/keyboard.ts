import type { KeyboardEvent } from 'react';

/**
 * Maps arrow keys to a 2D step: `[dx, dy]` where right / up are positive.
 * Holding Shift multiplies the step by 10. Returns `null` for other keys.
 */
export const arrowKeyDelta = (
  event: Pick<KeyboardEvent, 'key' | 'shiftKey'>,
  step = 1
): [number, number] | null => {
  const s = event.shiftKey ? step * 10 : step;
  switch (event.key) {
    case 'ArrowLeft':
      return [-s, 0];
    case 'ArrowRight':
      return [s, 0];
    case 'ArrowUp':
      return [0, s];
    case 'ArrowDown':
      return [0, -s];
    default:
      return null;
  }
};

/** Treats Enter and Space as "activate", like a native button. */
export const isActivationKey = (event: Pick<KeyboardEvent, 'key'>) =>
  event.key === 'Enter' || event.key === ' ';

/**
 * Next value for a 1-D slider (`role="slider"`) key press: arrows step by
 * `step` (×10 with Shift), PageUp / PageDown by 10 steps, Home / End jump to
 * the bounds. Returns `null` for keys the slider doesn't handle.
 */
export const sliderKeyValue = (
  event: Pick<KeyboardEvent, 'key' | 'shiftKey'>,
  value: number,
  min: number,
  max: number,
  step = 1
): number | null => {
  switch (event.key) {
    case 'Home':
      return min;
    case 'End':
      return max;
    case 'PageUp':
      return Math.min(max, value + step * 10);
    case 'PageDown':
      return Math.max(min, value - step * 10);
  }
  const delta = arrowKeyDelta(event, step);
  if (!delta) return null;
  return Math.min(max, Math.max(min, value + delta[0] + delta[1]));
};
