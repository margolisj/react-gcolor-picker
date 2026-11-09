import { useState } from 'react';
import { fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { ReactGPicker } from '../ColorPicker';
import type { ReactGPickerProps } from '../types';

interface Rect {
  left?: number;
  top?: number;
  width: number;
  height: number;
}

/** jsdom has no layout; give an element a bounding box for pointer math. */
export const mockRect = (element: Element, rect: Rect) => {
  const { left = 0, top = 0, width, height } = rect;
  const box = {
    left,
    top,
    width,
    height,
    x: left,
    y: top,
    right: left + width,
    bottom: top + height
  };
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    ...box,
    toJSON: () => box
  } as DOMRect);
};

interface Point {
  x: number;
  y: number;
}

const pointer = (p: Point, init?: PointerEventInit): PointerEventInit => ({
  clientX: p.x,
  clientY: p.y,
  pointerId: 1,
  pointerType: 'mouse',
  button: 0,
  ...init
});

/** Press on `element`, move through `path` (on window), release at the last point. */
export const drag = (
  element: Element,
  from: Point,
  path: Point[] = [],
  init?: PointerEventInit
) => {
  fireEvent.pointerDown(element, pointer(from, init));
  for (const p of path) fireEvent.pointerMove(window, pointer(p, init));
  fireEvent.pointerUp(window, pointer(path.at(-1) ?? from, init));
};

/** Stores emitted values like a typical controlled parent, and can inject external values. */
export const Controlled = ({
  initial,
  external = [],
  ...props
}: ReactGPickerProps & { initial?: string; external?: string[] }) => {
  const [value, setValue] = useState(initial);
  return (
    <>
      {external.map((v, i) => (
        <button key={i} type='button' onClick={() => setValue(v)}>
          {`external ${i}`}
        </button>
      ))}
      <ReactGPicker
        debounceMS={0}
        {...props}
        value={value}
        onChange={(next) => {
          setValue(next);
          props.onChange?.(next);
        }}
      />
    </>
  );
};
