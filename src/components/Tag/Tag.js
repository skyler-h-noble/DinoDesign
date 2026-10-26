// src/components/Tag/Tag.js
import React from 'react';
import { Box } from '@mui/material';
import { Label } from '../Typography/Typography';

/**
 * Tag Component
 *
 * A compact label used for status, categorization, and metadata.
 *
 * SPECS:
 *   Height:        the label's line plus Sizing-Quarter above and below (28 at medium)
 *   Padding:       Sizing-Quarter x Sizing-2 (Figma's Tag)
 *   Corners:       2px
 *   Border-radius: 0 (sharp corners)
 *   Typography:    the Label style (Figma's Label-Medium-All-Caps), uppercase
 *   Background:    var(--Tag-{Theme}-BG)
 *   Text:          var(--Tag-{Theme}-Text)
 *
 * COLORS:
 *   primary | secondary | tertiary | neutral
 *   info    | success   | warning  | error
 *
 * PROPS:
 *   color      string    One of the above colors (default: 'default')
 *   width      string    'hug' (default) fits content, 'fill' stretches to container
 *   (No allCaps: a tag is always uppercase, in code and Figma. allCaps={false}
 *   still renders — in caps — and warns once in development.)
 *   children   node      Tag label text
 *   className  string
 *   sx         object    MUI sx overrides
 */

const COLORS = [
  // 'default' resolves to --Tag-Default-BG / --Tag-Default-Text which the
  // consuming brand CSS (or the lib's fallback below) defines. Mirrors the
  // Button-Default cascade pattern so brand-driven dashboards pick up the
  // active surface's neutral palette without specifying a color.
  'default',
  'primary', 'secondary', 'tertiary', 'neutral',
  'info', 'success', 'warning', 'error',
];

const COLOR_TOKEN_MAP = {
  default:   'Default',
  primary:   'Primary',
  secondary: 'Secondary',
  tertiary:  'Tertiary',
  neutral:   'Neutral',
  info:      'Info',
  success:   'Success',
  warning:   'Warning',
  error:     'Error',
};

let warnedAllCaps = false;
function warnAllCapsOnce() {
  if (warnedAllCaps || process.env.NODE_ENV === 'production') return;
  warnedAllCaps = true;
  // eslint-disable-next-line no-console
  console.warn('[Tag] allCaps={false} is retired — a tag is always uppercase, as Figma\'s Tag. Rendering in caps.');
}

export function Tag({
  color = 'default',
  width = 'hug',
  // Retired: Figma's Tag style is Label-Medium-All-Caps, always.
  allCaps,
  children,
  className = '',
  sx = {},
  ...props
}) {
  if (allCaps === false) warnAllCapsOnce();
  const isFill = width === 'fill';
  const C    = COLOR_TOKEN_MAP[color] || 'Primary';
  const bg   = 'var(--Tag-' + C + '-BG)';
  const text = 'var(--Tag-' + C + '-Text)';

  return (
    <Box
      component="span"
      className={'tag tag-' + color + (className ? ' ' + className : '')}
      sx={{
        display:         isFill ? 'flex' : 'inline-flex',
        alignItems:      'center',
        justifyContent:  isFill ? 'center' : 'flex-start',
        // Figma's Tag: Sizing-Quarter x Sizing-2 around the label, 2px corners.
        padding:         'var(--Sizing-Quarter, 2px) var(--Sizing-2, 16px)',
        borderRadius:    '2px',
        backgroundColor: bg,
        color:           text,
        width:           isFill ? '100%' : 'auto',
        flexShrink:      0,
        userSelect:      'none',
        ...sx,
      }}
      {...props}
    >
      <Label
        component="span"
        sx={{
          color:         'inherit',
          whiteSpace:    'nowrap',
          textTransform: 'uppercase',
        }}
      >
        {children}
      </Label>
    </Box>
  );
}

// ─── Convenience exports ──────────────────────────────────────────────────────

export const PrimaryTag   = (p) => <Tag color="primary"   {...p} />;
export const SecondaryTag = (p) => <Tag color="secondary" {...p} />;
export const TertiaryTag  = (p) => <Tag color="tertiary"  {...p} />;
export const NeutralTag   = (p) => <Tag color="neutral"   {...p} />;
export const InfoTag      = (p) => <Tag color="info"      {...p} />;
export const SuccessTag   = (p) => <Tag color="success"   {...p} />;
export const WarningTag   = (p) => <Tag color="warning"   {...p} />;
export const ErrorTag     = (p) => <Tag color="error"     {...p} />;

export { COLORS as TAG_COLORS, COLOR_TOKEN_MAP as TAG_COLOR_TOKEN_MAP };

export default Tag;