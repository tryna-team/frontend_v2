import type { Preview } from '@storybook/react-native-web-vite';

const preview: Preview = {
  initialGlobals: {
    viewport: {
      value: 'mobile1',
      isRotated: false,
    },
  },

  parameters: {
    layout: 'centered',

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },

    docs: {
      codePanel: true,
    },
  },
};

export default preview;