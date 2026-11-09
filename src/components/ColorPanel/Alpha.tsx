import { useRef } from 'react';
import type { KeyboardEvent } from 'react';

import { usePointerDrag } from '../../hooks/usePointerDrag';
import type { DragPoint } from '../../hooks/usePointerDrag';
import { hexToRgb } from '../../utils/color';
import { sliderKeyValue } from '../../utils/keyboard';
import { clamp, round } from '../../utils/math';

interface AlphaProps {
  hex: string;
  /** 0–100. */
  alpha: number;
  onChange: (alpha: number) => void;
}

/** Opacity slider (0–100). */
export const Alpha = ({ hex, alpha, onChange }: AlphaProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { r, g, b } = hexToRgb(hex);

  const moveTo = ({ x }: DragPoint) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onChange(round(clamp((x - rect.left) / (rect.width || 1), 0, 1) * 100));
  };

  const onPointerDown = usePointerDrag({ onStart: moveTo, onMove: moveTo });

  const onKeyDown = (event: KeyboardEvent) => {
    const next = sliderKeyValue(event, alpha, 0, 100);
    if (next === null) return;
    event.preventDefault();
    onChange(next);
  };

  return (
    <div
      className='color-picker-panel-alpha'
      ref={ref}
      role='slider'
      tabIndex={0}
      aria-label='Alpha'
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={alpha}
      aria-valuetext={`${alpha}%`}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
    >
      <div
        className='color-picker-panel-alpha-bg'
        style={{
          background: `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0), rgba(${r}, ${g}, ${b}, 1))`
        }}
      />
      <span
        style={{
          left: `${alpha}%`,
          backgroundColor: `rgba(${r}, ${g}, ${b}, ${(alpha || 1) / 100})`
        }}
      />
      <div className='color-picker-panel-alpha-handler' />
    </div>
  );
};
