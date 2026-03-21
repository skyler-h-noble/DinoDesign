// src/components/Tag/Tag.js
import React from 'react';
import { Box } from '@mui/material';
import { BodySmall } from '../Typography';

/**
 * Tag Component
 *
 * A compact label used for status, categorization, and metadata.
 *
 * SPECS:
 *   Height:        24px
 *   Padding:       0 8px (left/right only)
 *   Border-radius: 0 (sharp corners)
 *   Typography:    BodySmall, line-height 24px, weight 600
 *   Background:    var(--Tag-{Theme}-BG)
 *   Text:          var(--Tag-{Theme}-Text)
 *
 * COLORS:
 *   primary | secondary | tertiary | neutral
 *   info    | success   | warning  | error
 *
 * PROPS:
 *   color      string    One of the above colors (default: 'primary')
 *   allCaps    boolean   Transforms text to uppercase (default: false)
 *   children   node      Tag label text
 *   className  string
 *   sx         object    MUI sx overrides
 */

const COLORS = [
  'primary', 'secondary', 'tertiary', 'neutral',
  'info', 'success', 'warning', 'error',
];

const COLOR_TOKEN_MAP = {
  primary:   'Primary',
  secondary: 'Secondary',
  tertiary:  'Tertiary',
  neutral:   'Neutral',
  info:      'Info',
  success:   'Success',
  warning:   'Warning',
  error:     'Error',
};

export function Tag({
  color = 'primary',
  allCaps = false,
  children,
  className = '',
  sx = {},
  ...props
}) {
  const C    = COLOR_TOKEN_MAP[color] || 'Primary';
  const bg   = 'var(--Tag-' + C + '-BG)';
  const text = 'var(--Tag-' + C + '-Text)';

  return (
    <Box
      component="span"
      className={'tag tag-' + color + (className ? ' ' + className : '')}
      sx={{
        display:         'inline-flex',
        alignItems:      'center',
        height:          '24px',
        px:              '8px',
        borderRadius:    0,
        backgroundColor: bg,
        color:           text,
        flexShrink:      0,
        userSelect:      'none',
        ...sx,
      }}
      {...props}
    >
      <BodySmall
        component="span"
        sx={{
          color:         'inherit',
          lineHeight:    '24px',
          whiteSpace:    'nowrap',
          fontWeight:    600,
          textTransform: allCaps ? 'uppercase' : 'none',
        }}
      >
        {children}
      </BodySmall>
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