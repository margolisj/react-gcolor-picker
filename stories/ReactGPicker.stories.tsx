import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { ReactGPicker } from '../src';
import type { ReactGPickerHandle } from '../src';
import { Preview } from './Preview';

const meta = {
  title: 'ReactGPicker',
  component: ReactGPicker,
  render: (args) => <Preview {...args} />,
  args: {
    value: '#ff6900',
    format: 'rgb',
    solid: true,
    gradient: false,
    debounce: true,
    debounceMS: 300,
    showAlpha: true,
    showInputs: true,
    popupWidth: 267,
    colorBoardHeight: 120,
    onChange: fn(),
    onChangeTabs: fn()
  },
  argTypes: {
    format: { control: 'inline-radio', options: ['rgb', 'hex', 'hsl'] },
    defaultActiveTab: {
      control: 'inline-radio',
      options: [undefined, 'solid', 'gradient']
    }
  }
} satisfies Meta<typeof ReactGPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {};

export const Gradient: Story = {
  args: {
    solid: false,
    gradient: true,
    format: 'hsl',
    value:
      'linear-gradient(315deg, hsl(199, 88%, 87%) 8.00%, hsl(217, 96%, 81%) 92.00%)'
  }
};

export const Both: Story = {
  args: {
    gradient: true,
    value: 'linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)'
  }
};

export const RadialGradient: Story = {
  args: {
    solid: false,
    gradient: true,
    value:
      'radial-gradient(circle at left top, yellow 0%, #009966 50%, purple 100%)'
  }
};

export const HexWithoutAlpha: Story = {
  name: 'Hex, no alpha',
  args: { format: 'hex', showAlpha: false, value: '#0693e3' }
};

/** An empty value shows the defaults and emits nothing until the user picks a color. */
export const EmptyValue: Story = {
  args: { value: '', format: 'hex', defaultColors: [], debounceMS: 0 }
};

/**
 * Regression for the "injecting gradient state" bug: after the value changes
 * from outside, the highlighted stop is the one that gets edited.
 */
export const ExternalValueChange: Story = {
  args: { solid: false, gradient: true, debounceMS: 0, defaultColors: [] },
  render: function Render(args) {
    const [color, setColor] = useState(
      'linear-gradient(180deg, #000000 0%, #005aff 100%)'
    );
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <ReactGPicker
          {...args}
          value={color}
          onChange={(next) => {
            setColor(next);
            args.onChange?.(next);
          }}
        />
        <button
          type='button'
          onClick={() =>
            setColor(
              'linear-gradient(180deg, rgb(122, 201, 251) 1.00%,rgb(209, 89, 223) 68.00%,rgb(255, 120, 88) 90.00%)'
            )
          }
        >
          Inject a 3-stop gradient
        </button>
        <code style={{ overflowWrap: 'anywhere' }}>{color}</code>
      </div>
    );
  }
};

interface EyeDropperLike {
  open: () => Promise<{ sRGBHex: string }>;
}

/**
 * `ref.applyColor()` applies a color from outside the picker: it replaces the
 * solid color, or recolors the active gradient stop.
 */
export const ApplyColorFromOutside: Story = {
  args: {
    gradient: true,
    debounceMS: 0,
    value: 'linear-gradient(90deg, #ff6900 0%, #0693e3 100%)'
  },
  render: function Render(args) {
    const ref = useRef<ReactGPickerHandle>(null);
    const [color, setColor] = useState(args.value);
    const EyeDropper = (globalThis as { EyeDropper?: new () => EyeDropperLike })
      .EyeDropper;

    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <ReactGPicker
          {...args}
          ref={ref}
          value={color}
          onChange={(next) => {
            setColor(next);
            args.onChange?.(next);
          }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          {['#eb144c', '#00d084', '#9900ef'].map((swatch) => (
            <button
              key={swatch}
              type='button'
              onClick={() => ref.current?.applyColor(swatch)}
            >
              {swatch}
            </button>
          ))}
          {EyeDropper && (
            <button
              type='button'
              onClick={async () => {
                const result = await new EyeDropper().open();
                ref.current?.applyColor(result.sRGBHex);
              }}
            >
              Eyedropper
            </button>
          )}
        </div>
        <code style={{ overflowWrap: 'anywhere' }}>{color}</code>
      </div>
    );
  }
};
