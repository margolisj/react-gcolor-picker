import { useState } from 'react';

import { ReactGPicker } from '../src';
import type { ReactGPickerProps } from '../src';

/**
 * Controlled demo: keeps the picker value in state and paints it behind the
 * picker so changes are visible.
 */
export const Preview = ({ value, onChange, ...props }: ReactGPickerProps) => {
  const [color, setColor] = useState(value);
  const [controlValue, setControlValue] = useState(value);

  // Let the Storybook "value" control drive the picker as an external change.
  if (value !== controlValue) {
    setControlValue(value);
    setColor(value);
  }

  return (
    <div
      style={{
        minHeight: 560,
        padding: 24,
        background: color || 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16
      }}
    >
      <code
        style={{
          padding: '4px 8px',
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.85)',
          maxWidth: '100%',
          overflowWrap: 'anywhere'
        }}
      >
        {color || '(empty)'}
      </code>
      <ReactGPicker
        {...props}
        value={color}
        onChange={(next) => {
          setColor(next);
          onChange?.(next);
        }}
      />
    </div>
  );
};
