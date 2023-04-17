import React from 'react';

import ReactGPicker from './ReactGPicker';
import type { Meta, StoryObj } from '@storybook/react';

export default {
  title: 'Example/Gradient',
  component: ReactGPicker
} as Meta<typeof ReactGPicker>;

type Story = StoryObj<typeof ReactGPicker>;

export const Gradient: Story = {
  args: {
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
  }
};
