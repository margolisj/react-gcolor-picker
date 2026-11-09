import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';

import { colorKey, formatColor, parseSolid, toHexAlpha } from '../utils/color';
import type { HexAlpha } from '../utils/color';
import { ColorPanel } from './ColorPanel/ColorPanel';
import { DefaultColorsPanel } from './DefaultColorsPanel';
import { InputRgba } from './InputRgba';
import type { ColorApplier, PanelProps } from './panelTypes';

export const Solid = forwardRef<ColorApplier, PanelProps>(function Solid(
  {
    value,
    revision,
    format,
    showAlpha,
    showInputs,
    colorBoardHeight,
    defaultColors,
    emit
  },
  ref
) {
  const [color, setColor] = useState<HexAlpha>(() => toHexAlpha(value));
  const [syncedRevision, setSyncedRevision] = useState(revision);

  if (revision !== syncedRevision) {
    setSyncedRevision(revision);
    setColor(toHexAlpha(value));
  }

  const change = (next: HexAlpha) => {
    setColor(next);
    emit(formatColor(next, format, showAlpha));
  };

  useImperativeHandle(ref, () => ({
    applyColor: (input) => {
      const parsed = parseSolid(input);
      if (parsed) change(parsed);
    }
  }));

  const swatches = useMemo(
    () => [...new Set(defaultColors)].filter((c) => parseSolid(c) !== null),
    [defaultColors]
  );
  const currentKey = colorKey(color);
  const activeSwatch = swatches.findIndex((c) => colorKey(c) === currentKey);

  return (
    <div className='colorpicker'>
      <ColorPanel
        hex={color.hex}
        alpha={color.alpha}
        showAlpha={showAlpha}
        colorBoardHeight={colorBoardHeight}
        onChange={change}
      />
      {showInputs && (
        <InputRgba
          hex={color.hex}
          alpha={color.alpha}
          showAlpha={showAlpha}
          onCommit={change}
        />
      )}
      <DefaultColorsPanel
        colors={swatches}
        activeIndex={activeSwatch}
        type='solid'
        onSelect={(c) => change(toHexAlpha(c))}
      />
    </div>
  );
});
