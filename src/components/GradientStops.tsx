import { useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';

import { usePointerDrag } from '../hooks/usePointerDrag';
import { MIN_STOPS, stopsPreview } from '../utils/gradient';
import type { GradientStop } from '../utils/gradient';
import { sliderKeyValue } from '../utils/keyboard';
import { clamp, round } from '../utils/math';

/** Dragging a stop this far (px) below the track removes it on release. */
const REMOVE_DISTANCE = 80;

interface GradientStopsProps {
  stops: GradientStop[];
  active: number;
  onSelect: (index: number) => void;
  onMove: (index: number, position: number) => void;
  onAdd: (position: number) => void;
  onRemove: (index: number) => void;
}

/**
 * Stop markers: click the track to add a stop, drag a marker to move it, and
 * remove it by double-clicking, pressing Delete, or dragging it off the track.
 */
export const GradientStops = ({
  stops,
  active,
  onSelect,
  onMove,
  onAdd,
  onRemove
}: GradientStopsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragIndex = useRef<number | null>(null);
  const [draggedOff, setDraggedOff] = useState(false);
  const canRemove = stops.length > MIN_STOPS;

  const measure = (x: number, y: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      position: round(clamp((x - rect.left) / (rect.width || 1), 0, 1), 2),
      off: canRemove && y - rect.top > REMOVE_DISTANCE
    };
  };

  const startDrag = usePointerDrag({
    onMove: ({ x, y }) => {
      const index = dragIndex.current;
      const m = measure(x, y);
      if (index === null || !m) return;
      setDraggedOff(m.off);
      if (!m.off) onMove(index, m.position);
    },
    onEnd: ({ x, y }) => {
      const index = dragIndex.current;
      dragIndex.current = null;
      setDraggedOff(false);
      if (index !== null && measure(x, y)?.off) onRemove(index);
    }
  });

  const onMarkerPointerDown = (
    event: PointerEvent<HTMLDivElement>,
    index: number
  ) => {
    dragIndex.current = index;
    onSelect(index);
    startDrag(event);
  };

  const onMarkerKeyDown = (event: KeyboardEvent, index: number) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      if (canRemove) onRemove(index);
      return;
    }
    const current = round(stops[index].position * 100);
    const next = sliderKeyValue(event, current, 0, 100);
    if (next === null) return;
    event.preventDefault();
    onMove(index, next / 100);
  };

  return (
    <div className='gradient-stops' ref={ref}>
      <div
        className='gradient-stop-preview'
        style={{ background: stopsPreview(stops) }}
        onClick={(e) => {
          const m = measure(e.clientX, e.clientY);
          if (m) onAdd(m.position);
        }}
      />
      <div className='gradient-stop-marker'>
        {stops.map((stop, index) => {
          const isActive = index === active;
          const percent = round(stop.position * 100, 2);
          let className = 'gradient-marker';
          if (isActive) className += draggedOff ? ' hide' : ' active';
          return (
            <div
              key={index}
              className={className}
              style={{ left: `${percent}%`, color: stop.color }}
              role='slider'
              tabIndex={0}
              aria-label={`Color stop ${index + 1}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={round(percent)}
              aria-valuetext={`${stop.color} at ${percent}%`}
              onPointerDown={(e) => onMarkerPointerDown(e, index)}
              onFocus={() => onSelect(index)}
              onDoubleClick={() => canRemove && onRemove(index)}
              onKeyDown={(e) => onMarkerKeyDown(e, index)}
            />
          );
        })}
      </div>
    </div>
  );
};
