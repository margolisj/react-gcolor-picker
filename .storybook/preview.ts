import type { Preview } from '@storybook/react-vite';

import theme from './theme';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: { expanded: true },
    docs: { theme }
  }
};

export default preview;
