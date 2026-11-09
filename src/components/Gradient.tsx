import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';

import {
  isGradientString,
  parseSolid,
  toHexAlpha,
  toRgbString
} from '../utils/color';
import type { HexAlpha } from '../utils/color';
import {
  addStop,
  gradientFromValue,
  parseGradient,
  removeStop,
  serializeGradient,
  updateStop
} from '../utils/gradient';
import type { GradientValue } from '../utils/gradient';
import { ColorPanel } from './ColorPanel/ColorPanel';
import { DefaultColorsPanel } from './DefaultColorsPanel';
import { GradientControls } from './GradientControls';
import { GradientStops } from './GradientStops';
import { InputRgba } from './InputRgba';
import type { ColorApplier, PanelProps } from './panelTypes';

export interface GradientPanelProps extends PanelProps {
  showGradientResult: boolean;
  showGradientStops: boolean;
  showGradientMode: boolean;
  showGradientAngle: boolean;
  showGradientPosition: boolean;
}

interface GradientState {
  gradient: GradientValue;
  /** Index into `gradient.stops` of the stop being edited. */
  active: number;
}

const lastIndex = (gradient: GradientValue) => gradient.stops.length - 1;

export const Gradient = forwardRef<ColorApplier, GradientPanelProps>(
  function Gradient(
    {
      value,
      revision,
      format,
      showAlpha,
      showInputs,
      colorBoardHeight,
      defaultColors,
      emit,
      showGradientResult,
      showGradientStops,
      showGradientMode,
      showGradientAngle,
      showGradientPosition
    },
    ref
  ) {
    const [state, setState] = useState<GradientState>(() => {
      const gradient = gradientFromValue(value);
      return { gradient, active: lastIndex(gradient) };
    });
    const [syncedRevision, setSyncedRevision] = useState(revision);

    // Adopt external value changes; keep the active stop when it still exists.
    if (revision !== syncedRevision) {
      setSyncedRevision(revision);
      const gradient = gradientFromValue(value);
      setState({
        gradient,
        active: Math.min(state.active, lastIndex(gradient))
      });
    }

    const { gradient, active } = state;
    const activeStop = gradient.stops[active];
    const activeColor = toHexAlpha(activeStop.color);

    const commit = (next: GradientValue, nextActive = active) => {
      setState({
        gradient: next,
        active: Math.min(nextActive, lastIndex(next))
      });
      emit(serializeGradient(next, format, showAlpha));
    };

    const setActiveColor = (color: HexAlpha) =>
      commit(updateStop(gradient, active, { color: toRgbString(color) }));

    useImperativeHandle(ref, () => ({
      applyColor: (input) => {
        if (isGradientString(input)) {
          const parsed = parseGradient(input);
          if (parsed) commit(parsed);
          return;
        }
        const solid = parseSolid(input);
        if (solid) setActiveColor(solid);
      }
    }));

    const swatches = useMemo(
      () =>
        [...new Set(defaultColors)].filter((c) => parseGradient(c) !== null),
      [defaultColors]
    );
    const currentKey = serializeGradient(gradient);
    const activeSwatch = swatches.findIndex((c) => {
      const parsed = parseGradient(c);
      return parsed !== null && serializeGradient(parsed) === currentKey;
    });

    return (
      <div className='colorpicker'>
        <ColorPanel
          hex={activeColor.hex}
          alpha={activeColor.alpha}
          showAlpha={showAlpha}
          colorBoardHeight={colorBoardHeight}
          onChange={setActiveColor}
        />
        {showInputs && (
          <InputRgba
            hex={activeColor.hex}
            alpha={activeColor.alpha}
            showAlpha={showAlpha}
            onCommit={setActiveColor}
          />
        )}
        <div className='gradient-interaction'>
          {showGradientResult && (
            <GradientControls
              gradient={gradient}
              css={serializeGradient(gradient)}
              showMode={showGradientMode}
              showAngle={showGradientAngle}
              showPosition={showGradientPosition}
              onToggleType={() =>
                commit({
                  ...gradient,
                  type: gradient.type === 'linear' ? 'radial' : 'linear'
                })
              }
              onAngleChange={(angle) => commit({ ...gradient, angle })}
              onRadialPositionChange={(radialPosition) =>
                commit({ ...gradient, radialPosition })
              }
            />
          )}
          {showGradientStops && (
            <GradientStops
              stops={gradient.stops}
              active={active}
              onSelect={(index) =>
                setState((s) =>
                  s.active === index ? s : { ...s, active: index }
                )
              }
              onMove={(index, position) =>
                commit(updateStop(gradient, index, { position }), index)
              }
              onAdd={(position) => {
                const added = addStop(gradient, {
                  color: activeStop.color,
                  position
                });
                commit(added.gradient, added.index);
              }}
              onRemove={(index) => {
                const next = removeStop(gradient, index);
                if (next) commit(next, lastIndex(next));
              }}
            />
          )}
        </div>
        <DefaultColorsPanel
          colors={swatches}
          activeIndex={activeSwatch}
          type='gradient'
          onSelect={(c) => {
            const parsed = parseGradient(c);
            if (parsed) commit(parsed, lastIndex(parsed));
          }}
        />
      </div>
    );
  }
);
