// src/components/BackgroundPicker.js
import React from 'react';
import { Box, Stack } from '@mui/material';
import { OverlineSmall, Caption } from './Typography';

/**
 * BackgroundPicker
 *
 * Two dropdowns side-by-side for setting the PreviewSurface environment:
 *   1. Background — data-theme applied to the preview wrapper
 *   2. Surface    — data-surface applied to the preview wrapper
 *
 * Props:
 *   theme           string | null   — current data-theme value
 *   onThemeChange   fn(string|null) — called when theme changes
 *   surface         string          — current data-surface value (default: 'Surface')
 *   onSurfaceChange fn(string)      — called when surface changes
 *   surfaces        string[]        — surface options to show (default: CARD_SURFACES)
 */

const THEME_GROUPS = [
  {
    label: 'Brand',
    options: [
      { label: 'Default',          value: null },
      { label: 'White',            value: 'White' },
      { label: 'Black',            value: 'Black' },
      { label: 'Primary',          value: 'Primary' },
      { label: 'Secondary',        value: 'Secondary' },
      { label: 'Tertiary',         value: 'Tertiary' },
      { label: 'Primary-Light',    value: 'Primary-Light' },
      { label: 'Secondary-Light',  value: 'Secondary-Light' },
      { label: 'Tertiary-Light',   value: 'Tertiary-Light' },
    ],
  },
  {
    label: 'Semantic',
    options: [
      { label: 'Info',           value: 'Info' },
      { label: 'Success',        value: 'Success' },
      { label: 'Warning',        value: 'Warning' },
      { label: 'Error',          value: 'Error' },
      { label: 'Info-Light',     value: 'Info-Light' },
      { label: 'Success-Light',  value: 'Success-Light' },
      { label: 'Warning-Light',  value: 'Warning-Light' },
      { label: 'Error-Light',    value: 'Error-Light' },
    ],
  },
];

const ALL_OPTIONS = THEME_GROUPS.flatMap(g => g.options);

const CARD_SURFACES      = ['Surface', 'Surface-Bright', 'Surface-Dim', 'Surface-Dimmest'];
const CONTAINER_SURFACES = ['Container', 'Container-Low', 'Container-Lowest', 'Container-High', 'Container-Highest'];

const selectSx = {
  height: 'var(--Button-Height)',
  px: 1.5,
  backgroundColor: 'var(--Background)',
  color: 'var(--Text)',
  border: '1px solid var(--Border)',
  borderRadius: 'var(--Style-Border-Radius)',
  fontSize: '14px',
  fontFamily: 'inherit',
  cursor: 'pointer',
  appearance: 'auto',
  width: '100%',
  '&:focus-visible': {
    outline: '3px solid var(--Focus-Visible)',
    outlineOffset: '2px',
  },
};

export function BackgroundPicker({
  theme           = null,
  onThemeChange,
  surface         = 'Surface',
  onSurfaceChange,
  surfaces        = CARD_SURFACES,
}) {
  const handleThemeSelect = (e) => {
    const raw = e.target.value;
    onThemeChange?.(raw === '__null__' ? null : raw);
  };

  const handleSurfaceSelect = (e) => {
    onSurfaceChange?.(e.target.value);
  };

  return (
    <Box>
      <OverlineSmall style={{ color: 'var(--Text-Quiet)', display: 'block', marginBottom: 8 }}>
        BACKGROUND
      </OverlineSmall>

      <Stack direction="row" spacing={1}>
        {/* Theme dropdown */}
        <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
          <Box
            component="select"
            value={theme ?? '__null__'}
            onChange={handleThemeSelect}
            aria-label="Background theme"
            sx={selectSx}
          >
            {THEME_GROUPS.map(group => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map(opt => (
                  <option key={opt.label} value={opt.value ?? '__null__'}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </Box>
        </Box>

        {/* Surface dropdown */}
        <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
          <Box
            component="select"
            value={surface}
            onChange={handleSurfaceSelect}
            aria-label="Surface"
            sx={selectSx}
          >
            {surfaces.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

// Surface option sets exported for use in other showcases
export { CARD_SURFACES, CONTAINER_SURFACES };

export default BackgroundPicker;