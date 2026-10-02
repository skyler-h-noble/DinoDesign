// src/components/BackgroundPicker.js
import React from 'react';
import { Box, Stack } from '@mui/material';
import { Select } from './Select/Select';

/**
 * BackgroundPicker
 *
 * Two compact dropdowns (using OmniDesign <Select>) for setting the
 * PreviewSurface environment:
 *   1. Background — data-theme applied to the preview wrapper
 *   2. Surface    — data-surface applied to the preview wrapper
 *
 * Designed to sit inline (e.g. on the showcase title row, flush right).
 *
 * Props:
 *   theme           string | null   — current data-theme value
 *   onThemeChange   fn(string|null) — called when theme changes
 *   surface         string          — current data-surface value (default: 'Surface')
 *   onSurfaceChange fn(string)      — called when surface changes
 *   surfaces        string[]        — surface options to show (default: ALL_SURFACES)
 *   size            'small' | 'medium' (default 'small')
 */

const NULL_TOKEN = '__null__';

// The themes a design system actually publishes. Every entry here has a
// matching [data-theme="…"] block in Light-Mode.css / Dark-Mode.css; anything
// else silently resolves to nothing, which paints an unthemed box rather than
// failing.
//
// Two axes were retired and are NOT themes any more:
//   Black  → data-theme="Neutral" data-surface="Surface-Dimmest"   (#000 bg)
//   White  → data-theme="Neutral" data-surface="Surface-Brightest"
//   *-Light → gone entirely; lightness is the SURFACE axis now
// Pick Neutral in this dropdown and the surface next to it.
const THEME_OPTIONS = [
  /* 'Default' is a real published theme — [data-theme="Default"] has its own
     block in both mode sheets — so it emits that string rather than null.
     It used to map to NULL_TOKEN, which rendered NO data-theme at all and left
     the preview INHERITING whatever was above it. The two only look the same
     while the ancestor happens to be Default: inherit a themed ancestor and
     the dropdown says Default while the preview is Primary, with nothing
     indicating the disagreement. Saying the theme is never worse than
     assuming it. */
  { label: 'Default',   value: 'Default' },
  { label: 'Primary',   value: 'Primary' },
  { label: 'Secondary', value: 'Secondary' },
  { label: 'Tertiary',  value: 'Tertiary' },
  { label: 'Neutral',   value: 'Neutral' },
  { label: 'Info',      value: 'Info' },
  { label: 'Success',   value: 'Success' },
  { label: 'Warning',   value: 'Warning' },
  { label: 'Error',     value: 'Error' },
];
// App-Bar, Nav-Bar and Status are published too, but they are contexts a
// component sets for itself rather than backgrounds you choose to preview on,
// so they are deliberately not offered here.

const CARD_SURFACES      = ['Surface-Dimmest', 'Surface-Dim', 'Surface', 'Surface-Bright', 'Surface-Brightest'];
const CONTAINER_SURFACES = ['Container', 'Container-Highest', 'Container-High', 'Container-Low', 'Container-Lowest'];
const ALL_SURFACES       = [...CARD_SURFACES, ...CONTAINER_SURFACES];

export function BackgroundPicker({
  theme           = 'Default',
  onThemeChange,
  surface         = 'Surface',
  onSurfaceChange,
  surfaces        = ALL_SURFACES,
  size            = 'small',
}) {
  const surfaceOptions = surfaces.map((s) => ({ value: s, label: s }));

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <Box sx={{ width: 160 }}>
        <Select
          options={THEME_OPTIONS}
          /* null still displays as Default, for a caller that has not picked
             one yet — the select must show an option that exists or it renders
             blank. */
          value={theme ?? 'Default'}
          onChange={(v) => onThemeChange?.(v === NULL_TOKEN ? null : v)}
          labelPosition="none"
          size={size}
          variant="outline"
          color="default"
          aria-label="Background theme"
          fullWidth
        />
      </Box>
      <Box sx={{ width: 180 }}>
        <Select
          options={surfaceOptions}
          value={surface}
          onChange={(v) => onSurfaceChange?.(v)}
          labelPosition="none"
          size={size}
          variant="outline"
          color="default"
          aria-label="Surface"
          fullWidth
        />
      </Box>
    </Stack>
  );
}

export { CARD_SURFACES, CONTAINER_SURFACES, ALL_SURFACES };

export default BackgroundPicker;
