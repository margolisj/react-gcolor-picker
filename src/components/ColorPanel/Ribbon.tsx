import { useRef } from 'react';
import type { KeyboardEvent } from 'react';

import { usePointerDrag } from '../../hooks/usePointerDrag';
import type { DragPoint } from '../../hooks/usePointerDrag';
import { hsvToHex } from '../../utils/color';
import { sliderKeyValue } from '../../utils/keyboard';
import { clamp, round } from '../../utils/math';

interface RibbonProps {
  hue: number;
  onChange: (hue: number) => void;
}

/** Hue slider (0–360). */
export const Ribbon = ({ hue, onChange }: RibbonProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const moveTo = ({ x }: DragPoint) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    onChange(clamp((x - rect.left) / (rect.width || 1), 0, 1) * 360);
  };

  const onPointerDown = usePointerDrag({ onStart: moveTo, onMove: moveTo });

  const onKeyDown = (event: KeyboardEvent) => {
    const next = sliderKeyValue(event, hue, 0, 360);
    if (next === null) return;
    event.preventDefault();
    onChange(next);
  };

  return (
    <div
      className='color-picker-panel-ribbon'
      ref={ref}
      role='slider'
      tabIndex={0}
      aria-label='Hue'
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={round(hue)}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
    >
      <div className='color-picker-panel-ribbon-bg' />
      <span
        style={{
          left: `${(hue / 360) * 100}%`,
          backgroundColor: hsvToHex({ h: hue, s: 1, v: 1 })
        }}
      />
      <div className='color-picker-panel-ribbon-handler' />
    </div>
  );
};
