// src/components/Colors/Colors.js
import React from 'react';
import { Box, Typography, Stack, Grid, Alert } from '@mui/material';

/**
 * Colors component - Displays the design system color palette
 * Shows Primary, Secondary, Tertiary colors and their background variants
 * Explains dynamic color system based on mode, background, and surface
 */
export function Colors() {
  const brandColors = [
    { name: 'Primary', var: '--Primary-Color-11' },
    { name: 'Secondary', var: '--Secondary-Color-11' },
    { name: 'Tertiary', var: '--Tertiary-Color-11' },
  ];

  const backgroundColors = [
    {
      name: 'Default Background',
      cssVar: 'var(--Theme-Default-Surfaces-Surface)',
    },
    {
      name: 'Primary Background',
      cssVar: 'var(--Theme-Primary-Surfaces-Surface)',
    },
    {
      name: 'Secondary Background',
      cssVar: 'var(--Theme-Secondary-Surfaces-Surface)',
    },
    {
      name: 'Tertiary Background',
      cssVar: 'var(--Theme-Tertiary-Surfaces-Surface)',
    },
    {
      name: 'Neutral Background',
      cssVar: 'var(--Theme-Neutral-Surfaces-Surface)',
    },
    {
      name: 'Neutral-Variant Background',
      cssVar: 'var(--Theme-Neutral-Variant-Surfaces-Surface)',
    },
  ];

  const dynamicColorCategories = [
    {
      name: 'Layout & Surfaces',
      colors: [
        { name: 'Background', var: '--Background' },
        { name: 'Border', var: '--Border' },
        { name: 'Border-Variant', var: '--Border-Variant' },
      ],
    },
    {
      name: 'Text & Links',
      colors: [
        { name: 'Header', var: '--Header' },
        { name: 'Text', var: '--Text' },
        { name: 'Text-Quiet', var: '--Text-Quiet' },
        { name: 'Hotlink', var: '--Hotlink' },
        { name: 'Hotlink-Visited', var: '--Hotlink-Visited' },
      ],
    },
    {
      name: 'Buttons - Primary',
      colors: [
        { name: 'Button BG', var: '--Button-Primary-Button' },
        { name: 'Button Text', var: '--Button-Primary-Text' },
        { name: 'Button Hover', var: '--Button-Primary-Hover' },
        { name: 'Button Active', var: '--Button-Primary-Active' },
        { name: 'Focus-Visible', var: '--Focus-Visible' },
      ],
    },
    
    {
      name: 'Buttons - Secondary',
      colors: [
        { name: 'Button BG', var: '--Button-Secondary-Button' },
        { name: 'Button Text', var: '--Button-Secondary-Text' },
        { name: 'Button Hover', var: '--Button-Secondary-Hover' },
        { name: 'Button Active', var: '--Button-Secondary-Active' },
        { name: 'Focus-Visible', var: '--Focus-Visible' },
      ],
    },
    {
      name: 'Buttons - Semantic',
      colors: [
        { name: 'Info Button', var: '--Button-Info-Button' },
        { name: 'Success Button', var: '--Button-Success-Button' },
        { name: 'Warning Button', var: '--Button-Warning-Button' },
        { name: 'Error Button', var: '--Button-Error-Button' },
      ],
    },
    {
      name: 'Icons',
      colors: [
        { name: 'Default', var: '--Icons-Default' },
        { name: 'Primary', var: '--Icons-Primary' },
        { name: 'Secondary', var: '--Icons-Secondary' },
        { name: 'Tertiary', var: '--Icons-Tertiary' },
        { name: 'Neutral', var: '--Icons-Neutral' },
        { name: 'Info', var: '--Icons-Info' },
        { name: 'Success', var: '--Icons-Success' },
        { name: 'Warning', var: '--Icons-Warning' },
        { name: 'Error', var: '--Icons-Error' },
      ],
    },
    {
      name: 'Chips & Badges',
      colors: [
        { name: 'Primary BG', var: '--Tags-Primary-BG' },
        { name: 'Primary Text', var: '--Tags-Primary-Text' },
        { name: 'Secondary BG', var: '--Tags-Secondary-BG' },
        { name: 'Secondary Text', var: '--Tags-Secondary-Text' },
        { name: 'Tertiary BG', var: '--Tags-Tertiary-BG' },
        { name: 'Tertiary Text', var: '--Tags-Tertiary-Text' },
        { name: 'Neutral BG', var: '--Tags-Neutral-BG' },
        { name: 'Neutral Text', var: '--Tags-Neutral-Text' },
        { name: 'Info BG', var: '--Tags-Info-BG' },
        { name: 'Info Text', var: '--Tags-Info-Text' },
        { name: 'Success BG', var: '--Tags-Success-BG' },
        { name: 'Success Text', var: '--Tags-Success-Text' },
        { name: 'Warning BG', var: '--Tags-Warning-BG' },
        { name: 'Warning Text', var: '--Tags-Warning-Text' },
        { name: 'Error BG', var: '--Tags-Error-BG' },
        { name: 'Error Text', var: '--Tags-Error-Text' },
      ],
    },
  ];

  // Color Swatch Component - 80x80
  const ColorSwatch = ({ color }) => (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          width: '80px',
          height: '80px',
          backgroundColor: `var(${color.var})`,
          borderRadius: '8px',
          border: '1px solid var(--Border)',
          mb: 1,
          mx: 'auto',
        }}
      />
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          fontSize: '12px',
          color: 'var(--Text)',
          mb: 0.5,
          wordBreak: 'break-word',
        }}
      >
        {color.name}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: 'var(--Text-Secondary)',
          display: 'block',
          fontSize: '10px',
          fontFamily: 'monospace',
          wordBreak: 'break-all',
        }}
      >
        {color.var}
      </Typography>
    </Box>
  );

  return (
    <Stack spacing={6}>
      {/* Primary, Secondary, Tertiary Colors */}
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          Brand Colors (Static)
        </Typography>
        <Stack
          direction="row"
          spacing={3}
          sx={{
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 3,
          }}
        >
          {brandColors.map((color) => (
            <ColorSwatch key={color.var} color={color} />
          ))}
        </Stack>
      </Box>

      {/* Background Colors */}
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          Background Colors (Dynamic)
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 3, color: 'var(--Text-Secondary)' }}
        >
          Update based on selected Background variant and Mode
        </Typography>
        <Grid
          container
          spacing={2}
          sx={{
            justifyContent: 'center',
          }}
        >
          {backgroundColors.map((bg) => (
            <Grid
              item
              key={bg.name}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    minWidth: 'max(var(--Button-Height), var(--Min-Button-Width))',
                    minHeight: 'var(--Button-Height)',
                    backgroundColor: bg.cssVar,
                    borderRadius: 'var(--Style-Border-Radius)',
                    border: '2px solid var(--Border)',
                    mb: 1,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: '12px',
                    color: 'var(--Text)',
                    wordBreak: 'break-word',
                  }}
                >
                  {bg.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Dynamic Color Categories */}
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          Dynamic Colors (Update with Mode, Background & Surface)
        </Typography>
        <Alert
          severity="info"
          sx={{
            backgroundColor: 'var(--Container-Low)',
            mb: 3,
            border: '1px solid var(--Border)',
          }}
        >
          <Typography variant="body2">
            Most colors update automatically based on the current{' '}
            <strong>Mode</strong> (Light/Dark), <strong>Background</strong>{' '}
            variant, and <strong>Surface</strong> theme. Only Primary, Secondary,
            and Tertiary colors are fixed brand colors.
          </Typography>
        </Alert>

        <Typography
          variant="body2"
          sx={{ mb: 3, color: 'var(--Text-Secondary)' }}
        >
          These colors automatically adapt based on:
        </Typography>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, minWidth: 80 }}
            >
              Mode:
            </Typography>
            <Typography variant="body2">Light or Dark theme</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, minWidth: 80 }}
            >
              Background:
            </Typography>
            <Typography variant="body2">
              Default, Primary, Secondary, Tertiary, Neutral, or Neutral-Variant
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, minWidth: 80 }}
            >
              Surface:
            </Typography>
            <Typography variant="body2">Theme surface layer selection</Typography>
          </Box>
        </Stack>

        <Stack spacing={4}>
          {dynamicColorCategories.map((category) => (
            <Box key={category.name}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {category.name}
              </Typography>
              <Grid
                container
                spacing={2}
                sx={{
                  justifyContent: 'center',
                }}
              >
                {category.colors.map((color) => (
                  <Grid
                    item
                    key={color.var}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <ColorSwatch color={color} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Color System Overview */}
      <Box sx={{ pt: 4, borderTop: '1px solid var(--Border)' }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          How to Use
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Static Colors
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--Text-Secondary)' }}>
              Use brand colors (
              <code style={{ backgroundColor: 'var(--Container)', padding: '2px 4px', borderRadius: '4px' }}>
                --Primary-Color-11
              </code>
              ,{' '}
              <code style={{ backgroundColor: 'var(--Container)', padding: '2px 4px', borderRadius: '4px' }}>
                --Secondary-Color-11
              </code>
              ,{' '}
              <code style={{ backgroundColor: 'var(--Container)', padding: '2px 4px', borderRadius: '4px' }}>
                --Tertiary-Color-11
              </code>
              ) for brand elements that should never change.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Dynamic Colors
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--Text-Secondary)' }}>
              Use dynamic color variables for all UI elements. They will automatically
              update when users change Mode, Background, or Surface settings.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Example Usage
            </Typography>
            <Box
              component="pre"
              sx={{
                backgroundColor: 'var(--Container)',
                p: 2,
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '12px',
                border: '1px solid var(--Border)',
                color: 'var(--Text)',
              }}
            >
              {`/* Dynamic - updates with theme changes */
color: var(--Text);
backgroundColor: var(--Background);
borderColor: var(--Border);

/* Static - brand colors stay the same */
accentColor: var(--Primary-Color-11);`}
            </Box>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

export default Colors;
