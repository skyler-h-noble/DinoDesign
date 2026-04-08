// src/components/BackgroundPicker.js
import React from 'react';
import { Box, Stack } from '@mui/material';
import { Select } from './Select/Select';

/**
 * BackgroundPicker
 *
 * Two compact dropdowns (using DynoDesign <Select>) for setting the
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

const THEME_OPTIONS = [
  { label: 'Default',         value: NULL_TOKEN },
  { label: 'White',           value: 'White' },
  { label: 'Black',           value: 'Black' },
  { label: 'Primary',         value: 'Primary' },
  { label: 'Secondary',       value: 'Secondary' },
  { label: 'Tertiary',        value: 'Tertiary' },
  { label: 'Primary-Light',   value: 'Primary-Light' },
  { label: 'Secondary-Light', value: 'Secondary-Light' },
  { label: 'Tertiary-Light',  value: 'Tertiary-Light' },
  { label: 'Info',            value: 'Info' },
  { label: 'Success',         value: 'Success' },
  { label: 'Warning',         value: 'Warning' },
  { label: 'Error',           value: 'Error' },
  { label: 'Info-Light',      value: 'Info-Light' },
  { label: 'Success-Light',   value: 'Success-Light' },
  { label: 'Warning-Light',   value: 'Warning-Light' },
  { label: 'Error-Light',     value: 'Error-Light' },
];

const CARD_SURFACES      = ['Surface', 'Surface-Bright', 'Surface-Dim', 'Surface-Dimmest'];
const CONTAINER_SURFACES = ['Container', 'Container-Highest', 'Container-High', 'Container-Low', 'Container-Lowest'];
const ALL_SURFACES       = [...CARD_SURFACES, ...CONTAINER_SURFACES];

export function BackgroundPicker({
  theme           = null,
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
          value={theme ?? NULL_TOKEN}
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
