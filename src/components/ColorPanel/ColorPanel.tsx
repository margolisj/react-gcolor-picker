import { useState } from 'react';

import { hexToHsv, hsvToHex } from '../../utils/color';
import type { HexAlpha, Hsv } from '../../utils/color';
import { Alpha } from './Alpha';
import { Board } from './Board';
import { Ribbon } from './Ribbon';

interface ColorPanelProps {
  hex: string;
  alpha: number;
  showAlpha: boolean;
  colorBoardHeight: number;
  onChange: (color: HexAlpha) => void;
}

/**
 * Board + hue + alpha sliders. Keeps its own HSV state so hue (and saturation)
 * survive round-trips through achromatic colors like white, gray and black,
 * which a hex value alone can't represent.
 */
export const ColorPanel = ({
  hex,
  alpha,
  showAlpha,
  colorBoardHeight,
  onChange
}: ColorPanelProps) => {
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(hex));
  const [syncedHex, setSyncedHex] = useState(hex);

  // Adopt hex changes that didn't come from this panel.
  if (hex !== syncedHex) {
    setSyncedHex(hex);
    if (hex !== hsvToHex(hsv)) setHsv(hexToHsv(hex, hsv.h));
  }

  const update = (next: Hsv) => {
    setHsv(next);
    // A fully transparent color is invisible; make it opaque once the user picks a color.
    onChange({ hex: hsvToHex(next), alpha: alpha === 0 ? 100 : alpha });
  };

  return (
    <div className='color-picker-panel'>
      <div className='color-picker-panel-inner'>
        <Board
          hsv={hsv}
          height={colorBoardHeight}
          onChange={(s, v) => update({ ...hsv, s, v })}
        />
        <div
          className={`color-picker-panel-wrap${
            showAlpha ? ' color-picker-panel-wrap-has-alpha' : ''
          }`}
        >
          <div className='color-picker-panel-wrap-ribbon'>
            <Ribbon hue={hsv.h} onChange={(h) => update({ ...hsv, h })} />
          </div>
          {showAlpha && (
            <div className='color-picker-panel-wrap-alpha'>
              <Alpha
                hex={hex}
                alpha={alpha}
                onChange={(next) => onChange({ hex, alpha: next })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
