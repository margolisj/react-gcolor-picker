import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';

import ReactGPicker from './ReactGPicker';
import { IPropsMain } from '../src/components/Colorpicker/types';

export default {
  title: 'Example/GradTesting',
  component: ReactGPicker
} as Meta;

const Template: StoryFn<IPropsMain> = (args) => {
  const brokenColor = 'linear-gradient(180deg, rgb(122, 201, 251) 1.00%,rgb(209, 89, 223) 68.00%,rgb(255, 120, 88) 90.00%)';
  // 'linear-gradient(180deg, rgb(122, 201, 251) 1.00%,rgb(209, 89, 223) 68.00%,rgb(255, 120, 88) 90.00%)'
  const [color, setColor] = useState(args.value);

  return (
    <>
    <ReactGPicker 
      {...args} 
      value={color}
    />
    <button
      onClick={() => {
        setColor(brokenColor);
      }}
    >
      Click Me To Break
    </button>
    </>
  )
};

export const Gradient = Template.bind({});
Gradient.args = {
  value: 'linear-gradient(315deg, hsl(199, 88%, 87%) 8.00%,hsl(217, 96%, 81%) 92.00%)',
  format: 'hsl',
  solid: false,
  gradient: true,
  debounceMS: 300,
  debounce: true,
  showAlpha: true,
  colorBoardHeight: 120,
  popupWidth: 267,
  onChange: (value: string) => value
};
