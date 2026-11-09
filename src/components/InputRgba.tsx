import { useId, useState } from 'react';
import type { KeyboardEvent } from 'react';

import type { HexAlpha } from '../utils/color';
import {
  parseAlphaInput,
  parseHexInput,
  sanitizeAlphaInput,
  sanitizeHexInput,
  stripHash
} from '../utils/input';
import { clamp } from '../utils/math';

interface InputRgbaProps {
  hex: string;
  alpha: number;
  showAlpha: boolean;
  onCommit: (color: HexAlpha) => void;
}

/**
 * Hex + alpha text inputs. Edits are kept as drafts and committed on Enter or
 * blur; invalid drafts revert instead of emitting a wrong color. ArrowUp /
 * ArrowDown (Shift for ×10) step the alpha value and commit immediately.
 */
export const InputRgba = ({
  hex,
  alpha,
  showAlpha,
  onCommit
}: InputRgbaProps) => {
  const id = useId();
  const hexId = `${id}-hex`;
  const alphaId = `${id}-alpha`;

  const [hexDraft, setHexDraft] = useState(() => stripHash(hex));
  const [alphaDraft, setAlphaDraft] = useState(() => String(alpha));
  const [synced, setSynced] = useState({ hex, alpha });

  // Reset drafts when the color changes from outside the inputs.
  if (synced.hex !== hex || synced.alpha !== alpha) {
    setSynced({ hex, alpha });
    setHexDraft(stripHash(hex));
    setAlphaDraft(String(alpha));
  }

  const commit = (next: HexAlpha) => {
    if (next.hex !== hex || next.alpha !== alpha) onCommit(next);
  };

  const commitHex = () => {
    const next = parseHexInput(hexDraft, alpha);
    if (!next) {
      setHexDraft(stripHash(hex));
      return;
    }
    setHexDraft(stripHash(next.hex));
    commit(next);
  };

  const commitAlpha = (draft = alphaDraft) => {
    const next = parseAlphaInput(draft);
    if (next === null) {
      setAlphaDraft(String(alpha));
      return;
    }
    setAlphaDraft(String(next));
    commit({ hex, alpha: next });
  };

  const onAlphaKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      commitAlpha();
      return;
    }
    // Respect handlers that already took care of the key.
    if (event.defaultPrevented) return;
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    const step = event.shiftKey ? 10 : 1;
    const current = parseAlphaInput(alphaDraft) ?? alpha;
    const next = clamp(
      current + (event.key === 'ArrowUp' ? step : -step),
      0,
      100
    );
    commitAlpha(String(next));
  };

  return (
    <div className='input_rgba'>
      <div className='input_rgba-wrap'>
        <div className='input_rgba-hex'>
          <label htmlFor={hexId} className='input_rgba-hex-label'>
            #
          </label>
          <input
            type='text'
            id={hexId}
            value={hexDraft}
            aria-label='Hex'
            autoComplete='off'
            spellCheck={false}
            onChange={(e) => setHexDraft(sanitizeHexInput(e.target.value))}
            onBlur={commitHex}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitHex();
            }}
          />
          <div className='input_rgba-label'>Hex</div>
        </div>
        {showAlpha && (
          <div className='input_rgba-alpha'>
            <label htmlFor={alphaId} className='input_rgba-alpha-label'>
              %
            </label>
            <input
              type='text'
              inputMode='numeric'
              id={alphaId}
              value={alphaDraft}
              aria-label='Alpha'
              autoComplete='off'
              onChange={(e) =>
                setAlphaDraft(sanitizeAlphaInput(e.target.value))
              }
              onBlur={() => commitAlpha()}
              onKeyDown={onAlphaKeyDown}
            />
            <div className='input_rgba-label'>Alpha</div>
          </div>
        )}
      </div>
    </div>
  );
};
