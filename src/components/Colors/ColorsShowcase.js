// src/components/Colors/ColorsShowcase.js
import React, { useState } from 'react';
import { Box, Typography, Stack, Grid, Alert, Tabs, Tab, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Colors } from './Colors';

/**
 * ColorsShowcase Component
 * Displays static brand colors and dynamic theme colors with interactive background selector
 */
export function ColorsShowcase() {
  const [tabValue, setTabValue] = useState(0);
  const [background, setBackground] = useState('Default');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBackgroundChange = (event, newBackground) => {
    if (newBackground !== null) {
      setBackground(newBackground);
    }
  };

  // Color swatch component
  const ColorSwatch = ({ name, cssVar, small = false }) => (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          width: small ? '60px' : '80px',
          height: small ? '60px' : '80px',
          backgroundColor: `var(${cssVar})`,
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
          fontSize: small ? '11px' : '12px',
          color: 'var(--Text)',
          mb: 0.5,
          wordBreak: 'break-word',
        }}
      >
        {name}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: 'var(--Text-Quiet)',
          display: 'block',
          fontSize: '10px',
          fontFamily: 'monospace',
          wordBreak: 'break-all',
        }}
      >
        {cssVar}
      </Typography>
    </Box>
  );

  /* The brand's CORE colours — the ones chosen in the studio.
     Color-Vibrant is where the picked colour lands (the generator resolves
     Color-Vibrant to Color-8), so it is the token that answers "what colour is
     this brand".

     These read --Primary-Color-11 and friends, which is the second-lightest
     step of the ramp: on this system that is #f9faef against the real
     #c7cda7 — a near-white tint labelled "Primary". Every palette looked
     washed out and nothing said why, because an 11 is a perfectly valid tone
     and the swatch rendered exactly what it was asked for. */
  const brandColors = [
    { name: 'Primary', var: '--Primary-Color-Vibrant' },
    { name: 'Secondary', var: '--Secondary-Color-Vibrant' },
    { name: 'Tertiary', var: '--Tertiary-Color-Vibrant' },
  ];

  /* The full ramp per palette, so the core colour has its context. Twelve
     tones is what the generator publishes; Vibrant is one of them (Color-8)
     rather than a thirteenth. */
  const RAMP_PALETTES = ['Primary', 'Secondary', 'Tertiary', 'Neutral'];
  const RAMP_TONES = Array.from({ length: 12 }, (_, i) => i + 1);

  // Static background colors
  const backgroundColors = [
    { name: 'Surface', var: '--Surface' },
    { name: 'Surface Dim', var: '--Surface-Dim' },
    { name: 'Surface Bright', var: '--Surface-Bright' },
  ];

  // Layout colors (dynamic)
  const layoutColors = [
    { name: 'Background', var: '--Background' },
    { name: 'Border', var: '--Border' },
    { name: 'Border-Variant', var: '--Border-Variant' },
  ];

  // Text & Links colors (dynamic)
  const textColors = [
    { name: 'Header', var: '--Header' },
    { name: 'Text', var: '--Text' },
    { name: 'Text-Quiet', var: '--Text-Quiet' },
    { name: 'Hotlink', var: '--Hotlink' },
    { name: 'Hotlink-Visited', var: '--Hotlink-Visited' },
  ];

  // Button color sets
  const buttonColorSets = [
    { name: 'Primary', prefix: 'Buttons-Primary' },
    /* `Buttons-Primary-Light-*` was removed with the -light shape in 0.9.0 and
       the CSS no longer emits it, so this group rendered empty swatches.
       BlackWhite is a real family and was missing from this list. */
    { name: 'Secondary', prefix: 'Buttons-Secondary' },
    { name: 'Tertiary', prefix: 'Buttons-Tertiary' },
    { name: 'Neutral', prefix: 'Buttons-Neutral' },
    { name: 'Black / White', prefix: 'Buttons-BlackWhite' },
    { name: 'Info', prefix: 'Buttons-Info' },
    { name: 'Success', prefix: 'Buttons-Success' },
    { name: 'Warning', prefix: 'Buttons-Warning' },
    { name: 'Error', prefix: 'Buttons-Error' },
  ];

  const buttonColorTypes = [
    { name: 'Button BG', suffix: 'Button' },
    { name: 'Button Text', suffix: 'Text' },
    { name: 'Button Hover', suffix: 'Hover' },
    { name: 'Button Active', suffix: 'Active' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: 'var(--Header)' }}>
        Colors
      </Typography>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 4 }}>
        <Tab label="Static Colors" />
        <Tab label="Dynamic Colors" />
      </Tabs>

      {/* Static Colors Tab */}
      {tabValue === 0 && (
        <Box>
          {/* Brand Colors */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'var(--Header)' }}>
              Brand Colors
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'var(--Text-Quiet)' }}>
              Core brand identity colors that never change
            </Typography>
            <Grid container spacing={2}>
              {brandColors.map((color) => (
                <Grid item key={color.var}>
                  <ColorSwatch name={color.name} cssVar={color.var} />
                </Grid>
              ))}
            </Grid>

            {/* The full ramp, so the core colour has its context. Twelve tones
                per palette, with Color-8 marked — Vibrant resolves to it rather
                than being a thirteenth tone, which is easy to assume otherwise.

                Flat rows of fixed-width cells rather than a Grid: the tones are
                a SEQUENCE, and a wrapping grid breaks the one thing a ramp has
                to show, which is that each step is adjacent to the next. */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" sx={{ mb: 2, color: 'var(--Text-Quiet)' }}>
                The full ramp. Color-8 is the core colour — <code>Color-Vibrant</code> resolves
                to it, rather than being a thirteenth tone.
              </Typography>
              {RAMP_PALETTES.map((palette) => (
                <Box key={palette} sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'var(--Text)' }}>
                    {palette}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto' }}>
                    {RAMP_TONES.map((n) => (
                      <Box key={n} sx={{ textAlign: 'center', flex: '0 0 auto', width: 56 }}>
                        <Box sx={{
                          height: 44,
                          backgroundColor: `var(--${palette}-Color-${n})`,
                          border: n === 8 ? '2px solid var(--Focus-Visible)' : '1px solid var(--Border-Variant)',
                          borderRadius: n === 8 ? 'var(--Style-Border-Radius, 4px)' : 0,
                        }} />
                        <Typography variant="caption" sx={{
                          fontSize: 10, color: 'var(--Text-Quiet)',
                          fontWeight: n === 8 ? 700 : 400,
                        }}>
                          {n}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Background/Surface Colors */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'var(--Header)' }}>
              Background Colors
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'var(--Text-Quiet)' }}>
              Static surface colors for light and dark modes
            </Typography>
            <Grid container spacing={2}>
              {backgroundColors.map((color) => (
                <Grid item key={color.var}>
                  <ColorSwatch name={color.name} cssVar={color.var} />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Info Box */}
          <Alert 
            severity="info"
            sx={{ 
              backgroundColor: 'var(--Container)',
              border: '1px solid var(--Border)',
            }}
          >
            <Typography variant="body2">
              <strong>Static Colors</strong> remain constant across all background variants. They provide consistent brand identity and surface definitions.
            </Typography>
          </Alert>
        </Box>
      )}

      {/* Dynamic Colors Tab */}
      {tabValue === 1 && (
        <Box data-background={background}>
          {/* Background Selector */}
          <Box sx={{ mb: 4, p: 3, backgroundColor: 'var(--Container)', borderRadius: 2, border: '1px solid var(--Border)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'var(--Header)' }}>
              Change Background Variant
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'var(--Text-Quiet)' }}>
              Select a background variant to see how all dynamic colors adapt
            </Typography>
            <ToggleButtonGroup
              value={background}
              exclusive
              onChange={handleBackgroundChange}
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              <ToggleButton value="Default">Default</ToggleButton>
              <ToggleButton value="Primary">Primary</ToggleButton>
              <ToggleButton value="Secondary">Secondary</ToggleButton>
              <ToggleButton value="Tertiary">Tertiary</ToggleButton>
              <ToggleButton value="Neutral">Neutral</ToggleButton>
              <ToggleButton value="Neutral-Variant">Neutral-Variant</ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'var(--Text-Quiet)' }}>
              Current: <code>data-background="{background}"</code>
            </Typography>
          </Box>

          {/* Layout Colors */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'var(--Header)' }}>
              Layout
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'var(--Text-Quiet)' }}>
              Core layout and structure colors that adapt to background
            </Typography>
            <Grid container spacing={2}>
              {layoutColors.map((color) => (
                <Grid item key={color.var}>
                  <ColorSwatch name={color.name} cssVar={color.var} />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Text, Links, and Focus Visible */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'var(--Header)' }}>
              Text, Links, and Focus Visible
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'var(--Text-Quiet)' }}>
              Typography, link, and focus indicator colors that adapt for optimal contrast
            </Typography>
            <Grid container spacing={2}>
              {textColors.map((color) => (
                <Grid item key={color.var}>
                  <ColorSwatch name={color.name} cssVar={color.var} />
                </Grid>
              ))}
              <Grid item>
                <ColorSwatch name="Focus-Visible" cssVar="--Focus-Visible" />
              </Grid>
            </Grid>
          </Box>

          {/* Icon Colors */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'var(--Header)' }}>
              Icons
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'var(--Text-Quiet)' }}>
              Icon colors that adapt to background for optimal visibility
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <ColorSwatch name="Icon" cssVar="--Icon-Default" />
              </Grid>
             <Grid item>
                <ColorSwatch name="Icon-Primary" cssVar="--Icons-Primary" />
              </Grid>
             <Grid item>
                <ColorSwatch name="Icon-Secondary" cssVar="--Icons-Secondary" />
              </Grid>
              <Grid item>
                <ColorSwatch name="Icon-Tertiary" cssVar="--Icons-Tertiary" />
              </Grid>
                <Grid item>
                <ColorSwatch name="Icon-Neutral" cssVar="--Icons-Neutral" />
              </Grid>

              <Grid item>
                <ColorSwatch name="Icon-Info" cssVar="--Icons-Info" />
              </Grid>
              <Grid item>
                <ColorSwatch name="Icon-Success" cssVar="--Icons-Success" />
              </Grid>
              <Grid item>
                <ColorSwatch name="Icon-Warning" cssVar="--Icons-Warning" />
              </Grid>
              <Grid item>
                <ColorSwatch name="Icon-Error" cssVar="--Icons-Error" />
              </Grid>
            </Grid>
          </Box>

          {/* Tags & Badges (Non-Interactive) */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'var(--Header)' }}>
              Tags & Badges (Non-Interactive)
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'var(--Text-Quiet)' }}>
              Color pairs for tags, chips, and badges (background + text)
            </Typography>
            <Stack spacing={3}>
              {['Primary', 'Secondary', 'Tertiary', 'Info', 'Success', 'Warning', 'Error'].map((variant) => (
                <Box key={variant}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '14px', color: 'var(--Header)' }}>
                    {variant}
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item>
                      <ColorSwatch 
                        name="Background" 
                        cssVar={`--Tags-${variant}-BG`} 
                        small
                      />
                    </Grid>
                    <Grid item>
                      <ColorSwatch 
                        name="Text" 
                        cssVar={`--Tags-${variant}-Text`} 
                        small
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Buttons - All Color Variants */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'var(--Header)' }}>
              Buttons
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'var(--Text-Quiet)' }}>
              All button color variants with their states
            </Typography>

            {/* Primary */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '14px', color: 'var(--Header)' }}>
                Primary
              </Typography>
              <Grid container spacing={2}>
                {buttonColorTypes.map((type) => (
                  <Grid item key={type.suffix}>
                    <ColorSwatch 
                      name={type.name} 
                      cssVar={`--Buttons-Primary-${type.suffix}`} 
                      small
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* The `Buttons-Primary-Light-*` swatch block was removed with the -light
              shape in 0.9.0: the CSS no longer emits that family, so every swatch
              here read as unresolved. */}

            {/* Primary Outline */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '14px', color: 'var(--Header)' }}>
                Primary Outline
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <ColorSwatch 
                    name="Hover" 
                    cssVar="--Buttons-Primary-Outline-Hover" 
                    small
                  />
                </Grid>
                <Grid item>
                  <ColorSwatch 
                    name="Active" 
                    cssVar="--Buttons-Primary-Outline-Active" 
                    small
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Other Button Variants */}
            <Stack spacing={3}>
              {buttonColorSets.slice(2).map((set) => (
                <Box key={set.prefix}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '14px', color: 'var(--Header)' }}>
                    {set.name}
                  </Typography>
                  <Grid container spacing={1}>
                    {buttonColorTypes.map((type) => (
                      <Grid item key={type.suffix}>
                        <ColorSwatch 
                          name={type.name} 
                          cssVar={`--${set.prefix}-${type.suffix}`} 
                          small
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Accessibility Information */}
          <Alert 
            severity="info" 
            sx={{ 
              mb: 6,
              backgroundColor: 'var(--Container)',
              border: '1px solid var(--Border)',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '16px', color: 'var(--Header)' }}>
              Button Accessibility
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                ✓ All buttons remain accessible regardless of variant or state
              </Typography>
              <Typography variant="body2">
                ✓ Button fill or border always has required contrast to background
              </Typography>
              <Typography variant="body2">
                ✓ Button text maintains constant 4.5:1 contrast ratio to button background on hover, active, and focus states
              </Typography>
              <Typography variant="body2">
                ✓ Focus-visible indicator ALWAYS has 3:1 contrast ratio to background
              </Typography>
              <Typography variant="body2">
                ✓ Ghost/text buttons with text only are underlined as hotlinks for clear affordance
              </Typography>
            </Stack>
          </Alert>
        </Box>
      )}

      {/* Design System Info */}
      <Box sx={{ 
        p: 3, 
        backgroundColor: 'var(--Container)', 
        borderRadius: 'var(--Style-Border-Radius)',
        border: '1px solid var(--Border)'
      }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'var(--Header)' }}>
          How to Use Colors
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: 'var(--Header)' }}>
              Static Colors
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace', fontSize: '12px' }}>
              backgroundColor: var(--Primary-Color-11)
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--Text-Quiet)' }}>
              Use for brand elements that should never change
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: 'var(--Header)' }}>
              Dynamic Colors
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace', fontSize: '12px' }}>
              backgroundColor: var(--Background)
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace', fontSize: '12px' }}>
              color: var(--Text)
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--Text-Quiet)' }}>
              These adapt automatically based on data-background attribute
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: 'var(--Header)' }}>
              Background Variants
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--Text-Quiet)', fontFamily: 'monospace', fontSize: '12px' }}>
              {'<Box data-background="Primary">...</Box>'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--Text-Quiet)' }}>
              Options: Default, Primary, Secondary, Tertiary, Neutral, Neutral-Variant
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default ColorsShowcase;