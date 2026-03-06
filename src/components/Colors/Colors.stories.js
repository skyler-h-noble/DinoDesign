// src/components/Colors/Colors.stories.js
import { Colors } from './Colors';

export default {
  title: 'Design System/Colors',
  component: Colors,
  parameters: {
    layout: 'padded',
  },
};

export const AllColors = {
  render: () => <Colors />,
};

export const ColorPalette = {
  render: () => <Colors />,
  parameters: {
    docs: {
      description: {
        story: 'Complete color palette for the design system. Shows brand colors, background colors, and dynamic colors that update based on mode, background, and surface settings.',
      },
    },
  },
};

export const BrandColors = {
  render: () => {
    const { Colors: ColorsComponent } = require('./Colors');
    // This will show just the brand colors section when filtered in Storybook
    return <ColorsComponent />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Static brand colors (Primary, Secondary, Tertiary) that never change regardless of theme settings.',
      },
    },
  },
};

export const DynamicColors = {
  render: () => <Colors />,
  parameters: {
    docs: {
      description: {
        story: 'Dynamic colors that automatically update based on Mode (Light/Dark), Background variant, and Surface theme selection.',
      },
    },
  },
};

export const TagColors = {
  render: () => <Colors />,
  parameters: {
    docs: {
      description: {
        story: 'Tag and Badge colors with background and text color pairs for each semantic color (Primary, Secondary, Tertiary, Info, Success, Warning, Error).',
      },
    },
  },
};

export const ButtonColors = {
  render: () => <Colors />,
  parameters: {
    docs: {
      description: {
        story: 'Button colors for different semantic states including Primary, Secondary, and Semantic variants (Info, Success, Warning, Error).',
      },
    },
  },
};
