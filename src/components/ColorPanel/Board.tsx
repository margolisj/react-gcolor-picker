import { useRef } from 'react';
import type { KeyboardEvent } from 'react';

import { usePointerDrag } from '../../hooks/usePointerDrag';
import type { DragPoint } from '../../hooks/usePointerDrag';
import { hsvToHex } from '../../utils/color';
import type { Hsv } from '../../utils/color';
import { arrowKeyDelta } from '../../utils/keyboard';
import { clamp, round } from '../../utils/math';

interface BoardProps {
  hsv: Hsv;
  height: number;
  onChange: (saturation: number, brightness: number) => void;
}

/** Saturation (x) / brightness (y) area. */
export const Board = ({ hsv, height, onChange }: BoardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const moveTo = ({ x, y }: DragPoint) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const saturation = clamp((x - rect.left) / (rect.width || 1), 0, 1);
    const brightness = 1 - clamp((y - rect.top) / (rect.height || 1), 0, 1);
    onChange(saturation, brightness);
  };

  const onPointerDown = usePointerDrag({ onStart: moveTo, onMove: moveTo });

  const onKeyDown = (event: KeyboardEvent) => {
    const delta = arrowKeyDelta(event);
    if (!delta) return;
    event.preventDefault();
    onChange(
      clamp(hsv.s + delta[0] / 100, 0, 1),
      clamp(hsv.v + delta[1] / 100, 0, 1)
    );
  };

  const saturation = round(hsv.s * 100);
  const brightness = round(hsv.v * 100);

  return (
    <div className='color-picker-panel-board' ref={ref}>
      <div
        className='color-picker-panel-board-hsv'
        style={{
          backgroundColor: hsvToHex({ h: hsv.h, s: 1, v: 1 }),
          height,
          minHeight: height
        }}
      >
        <div className='color-picker-panel-board-value' />
        <div className='color-picker-panel-board-saturation' />
      </div>
      <span
        style={{
          left: `calc(${hsv.s * 100}% - 7px)`,
          top: `calc(${(1 - hsv.v) * 100}% - 7px)`,
          backgroundColor: hsvToHex(hsv)
        }}
      />
      <div
        className='color-picker-panel-board-handler'
        role='slider'
        tabIndex={0}
        aria-label='Saturation and brightness'
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={saturation}
        aria-valuetext={`Saturation ${saturation}%, brightness ${brightness}%`}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};
