import '../public/styles/foundation.css';
import '../public/styles/foundations.css';
import '../public/styles/core.css';
import '../public/styles/Light-Mode.css';
import '../public/styles/base.css';
import '../public/styles/styles.css';

/** @type { import('@storybook/react-webpack5').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'var(--Surface, #ffffff)' },
        { name: 'dark', value: 'var(--Surface-Dark, #121212)' },
      ],
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Dino Design theme',
      defaultValue: 'Default',
      toolbar: {
        icon: 'paintbrush',
        items: ['Default', 'Primary', 'Secondary', 'Tertiary'],
        showName: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'Default';
      return (
        <div data-theme={theme} style={{ padding: '1rem' }}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;