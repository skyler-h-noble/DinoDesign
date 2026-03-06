// src/components/MainLayout/MainLayout.stories.js
import { MainLayout, DefaultMainLayout } from './MainLayout';
import { useState } from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';

export default {
  title: 'Layout/MainLayout',
  component: MainLayout,
  parameters: {
    layout: 'fullscreen',
  },
};

// Default Layout with Demo Content
export const Default = {
  render: () => {
    const [layout, setLayout] = useState('side');
    const [mode, setMode] = useState('light');
    
    return (
      <DefaultMainLayout
        layout={layout}
        mode={mode}
        onLayoutChange={setLayout}
        onModeChange={setMode}
      />
    );
  },
};

// Side Navigation Only
export const SideNavigation = {
  render: () => (
    <DefaultMainLayout
      layout="side"
      title="Side Navigation"
    />
  ),
};

// Rail Navigation Only
export const RailNavigation = {
  render: () => (
    <DefaultMainLayout
      layout="rail"
      title="Rail Navigation"
    />
  ),
};

// Side + Rail Navigation
export const BothNavigations = {
  render: () => (
    <DefaultMainLayout
      layout="side-rail"
      title="Side + Rail Navigation"
    />
  ),
};

// Custom Content Layout
export const CustomContent = {
  render: () => (
    <MainLayout
      title="Custom Content"
      layout="side"
    >
      <Stack spacing={3}>
        <Paper sx={{ p: 3, backgroundColor: 'var(--Container)' }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Welcome to Main Layout
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--Text-Secondary)' }}>
            This layout is fully responsive and supports multiple navigation options:
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, backgroundColor: 'var(--Container)' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Features:
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2">
              ✓ Multiple layout options (Side, Rail, Both)
            </Typography>
            <Typography variant="body2">
              ✓ Fully responsive (mobile, tablet, desktop)
            </Typography>
            <Typography variant="body2">
              ✓ Collapsible side navigation
            </Typography>
            <Typography variant="body2">
              ✓ Mobile drawer menu
            </Typography>
            <Typography variant="body2">
              ✓ Design system integration
            </Typography>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, backgroundColor: 'var(--Container)' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Responsive Behavior:
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>Desktop:</strong> Full side navigation with optional rail menu
            </Typography>
            <Typography variant="body2">
              <strong>Tablet:</strong> Collapsible side navigation
            </Typography>
            <Typography variant="body2">
              <strong>Mobile:</strong> Drawer menu triggered by hamburger icon
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </MainLayout>
  ),
};

// With Interactive Layout Switcher
export const InteractiveSwitcher = {
  render: () => {
    const [layout, setLayout] = useState('side');

    return (
      <MainLayout
        title="Interactive Layout Switcher"
        layout={layout}
        onLayoutChange={setLayout}
      >
        <Stack spacing={3}>
          <Paper sx={{ p: 3, backgroundColor: 'var(--Container)' }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
              Current Layout: {layout}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--Text-Secondary)' }}>
              Use the layout selector in the top right to switch between different navigation layouts.
            </Typography>
          </Paper>

          <Box>
            {layout === 'side' && (
              <Paper sx={{ p: 3, backgroundColor: 'var(--Container)', borderLeft: '4px solid var(--Primary-Color-11)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Side Navigation
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--Text-Secondary)' }}>
                  Full-width navigation menu with expandable/collapsible options. Perfect for applications with multiple sections.
                </Typography>
              </Paper>
            )}
            {layout === 'rail' && (
              <Paper sx={{ p: 3, backgroundColor: 'var(--Container)', borderLeft: '4px solid var(--Primary-Color-11)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Rail Navigation
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--Text-Secondary)' }}>
                  Compact vertical rail with icon-only navigation. Great for maximizing content space.
                </Typography>
              </Paper>
            )}
            {layout === 'side-rail' && (
              <Paper sx={{ p: 3, backgroundColor: 'var(--Container)', borderLeft: '4px solid var(--Primary-Color-11)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Side + Rail Navigation
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--Text-Secondary)' }}>
                  Combined layout with both compact rail and expandable side menu. Best for complex applications.
                </Typography>
              </Paper>
            )}
          </Box>
        </Stack>
      </MainLayout>
    );
  },
};
