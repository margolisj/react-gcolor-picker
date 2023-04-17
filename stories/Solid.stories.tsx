import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import ReactGPicker from './ReactGPicker';
import { IPropsMain } from '../src/components/Colorpicker/types';

export default {
  title: 'Example/Solid',
  component: ReactGPicker
} as Meta;

const Template: StoryFn<IPropsMain> = (args) => <ReactGPicker {...args} />;

export const Solid = Template.bind({});
Solid.args = {
  value: '#fff',
  format: 'rgb',
  solid: true,
  gradient: false,
  debounceMS: 300,
  debounce: true,
  showAlpha: true,
  colorBoardHeight: 120,
  popupWidth: 267,
  onChange: (value: string) => value
};
