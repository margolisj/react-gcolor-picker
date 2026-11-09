import { useRef } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';

import { usePointerDrag } from '../hooks/usePointerDrag';
import type { DragPoint } from '../hooks/usePointerDrag';
import { RADIAL_POSITIONS } from '../utils/gradient';
import type { GradientValue } from '../utils/gradient';
import { isActivationKey } from '../utils/keyboard';

interface GradientControlsProps {
  gradient: GradientValue;
  /** CSS for the preview background. */
  css: string;
  showMode: boolean;
  showAngle: boolean;
  showPosition: boolean;
  onToggleType: () => void;
  onAngleChange: (angle: number) => void;
  onRadialPositionChange: (position: string) => void;
}

const onActivate = (fn: () => void) => (event: KeyboardEvent) => {
  if (!isActivationKey(event)) return;
  event.preventDefault();
  fn();
};

/**
 * Gradient preview. Dragging on it rotates a linear gradient (snapping to 45°,
 * 22.5° with Shift, 11.25° with Ctrl); it also hosts the linear / radial
 * switch and the radial position grid.
 */
export const GradientControls = ({
  gradient,
  css,
  showMode,
  showAngle,
  showPosition,
  onToggleType,
  onAngleChange,
  onRadialPositionChange
}: GradientControlsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isLinear = gradient.type === 'linear';

  const rotateTo = ({ x, y, shiftKey, ctrlKey }: DragPoint) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const degrees = Math.abs(
      ((Math.atan2(x - cx, y - cy) - Math.PI) * 180) / Math.PI
    );
    const snap = 45 / (shiftKey ? 2 : ctrlKey ? 4 : 1);
    onAngleChange(degrees - (degrees % snap));
  };

  const startRotate = usePointerDrag({ onStart: rotateTo, onMove: rotateTo });

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!isLinear || !showAngle) return;
    const target = event.target as HTMLElement;
    if (target.closest('.gradient-mode, .gradient-pos')) return;
    startRotate(event);
  };

  return (
    <div
      className='gradient-result'
      ref={ref}
      style={{ background: css }}
      onPointerDown={onPointerDown}
    >
      {showMode && (
        <div
          className='gradient-mode'
          data-mode={gradient.type}
          role='button'
          tabIndex={0}
          aria-label={
            isLinear ? 'Switch to radial gradient' : 'Switch to linear gradient'
          }
          onClick={onToggleType}
          onKeyDown={onActivate(onToggleType)}
        />
      )}
      {showAngle && (
        <div
          className='gradient-angle'
          style={{ visibility: isLinear ? 'visible' : 'hidden' }}
        >
          <div style={{ transform: `rotate(${gradient.angle - 90}deg)` }} />
        </div>
      )}
      {showPosition && (
        <div
          className='gradient-pos'
          role='group'
          aria-label='Radial gradient position'
          style={{
            opacity: isLinear ? 0 : 1,
            visibility: isLinear ? 'hidden' : 'visible'
          }}
        >
          {RADIAL_POSITIONS.map((position) => {
            const selected = gradient.radialPosition === position.css;
            const select = () => onRadialPositionChange(position.css);
            return (
              <div
                key={position.key}
                data-pos={position.key}
                role='button'
                tabIndex={isLinear ? -1 : 0}
                aria-label={position.label}
                aria-pressed={selected}
                className={selected ? 'gradient-active' : ''}
                onClick={select}
                onKeyDown={onActivate(select)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
