// src/components/LinearProgress/LinearProgress.js
import React from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import { MobileNavLabel } from '../Typography/Typography';

/**
 * LinearProgress Component
 *
 * A horizontal bar progress indicator — indeterminate (sliding) or determinate (0–100).
 *
 * Figma's Progress Bar (8379:11531):
 *   Track      no fill, a 1px --Border stroke OUTSIDE (drawn as a spread
 *              shadow, so it takes no layout space). --Border, not
 *              --Border-Variant: the bar's extent is meaningful, so it needs
 *              the 3:1 a non-text graphic carries.
 *   Indicator  --Buttons-{Color}-Border with a 1px --Background ring INSIDE,
 *              which parts it from the track's edge
 *   Corners    full pill
 *
 * SIZES: small (4px), medium (6px), large (--Progress-Bar-Width, 8px — Figma's
 *        only size) — bar height
 * DETERMINATE: value 0–100 sets fill width. Without value, indeterminate slide animation.
 * showValue: Figma's Progress Text — the percentage under a determinate bar,
 *   Mobile Nav Label in --Text, Sizing-Half below. Decorative to a screen
 *   reader (the bar already announces aria-valuenow).
 *
 * Accessibility: role="progressbar", aria-valuenow/min/max for determinate,
 *   aria-label for screen readers.
 */

const COLOR_LABEL_MAP = {
  default: 'Default', primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

const SIZE_MAP = {
  small:  { height: '4px' },
  medium: { height: '6px' },
  large:  { height: 'var(--Progress-Bar-Width, 8px)' },
};

/* The track, the indicator and the value row as plain elements on a static
   sheet (they were MUI Boxes with an sx each), over the same tokens. */
registerStaticStyles('omni-linear-progress', [
  '.omni-lp{position:relative;width:100%;border-radius:999px;box-shadow:0 0 0 1px var(--Border);overflow:hidden;flex-shrink:0}',
  ...Object.entries(SIZE_MAP).map(([k, v]) => `.omni-lp-${k}{height:${v.height}}`),
  '.omni-lp-bar{position:absolute;top:0;left:0;height:100%;border-radius:inherit;background-color:var(--_lp-fill);'
    + 'box-shadow:inset 0 0 0 1px var(--Background);box-sizing:border-box}',
  ...[...new Set(Object.values(COLOR_LABEL_MAP))].map((C) => `.omni-lp-c-${C}{--_lp-fill:var(--Buttons-${C}-Border)}`),
  '.omni-lp-det{width:var(--_lp-w);transition:width 0.4s ease}',
  '.omni-lp-ind{width:40%;animation:linear-progress-slide 1.5s ease-in-out infinite}',
  '@keyframes linear-progress-slide{0%{left:-40%;width:40%}50%{left:30%;width:50%}100%{left:100%;width:40%}}',
  '.omni-lp-field{display:flex;flex-direction:column;gap:var(--Sizing-Half, 4px);width:100%}',
].join('\n'));
const SxBox = lazySxBox('LinearProgress');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

export function LinearProgress({
  value,
  color = 'default',
  size = 'medium',
  showValue = false,
  className = '',
  sx = {},
  ...props
}) {
  useStaticStyles('omni-linear-progress');
  const C = COLOR_LABEL_MAP[color] || 'Default';
  const sizeKey = SIZE_MAP[size] ? size : 'medium';
  const hasValue = value !== undefined && value !== null;
  const clampedValue = hasValue ? Math.min(100, Math.max(0, value)) : 0;

  /* The track: no fill, a 1px --Border outside it as a spread shadow (no
     layout space), a full pill. The indicator: --Buttons-{C}-Border with a
     1px --Background ring inside; its width is the value, or the slide. */
  const rootProps = {
    role: 'progressbar',
    'aria-valuenow': hasValue ? Math.round(clampedValue) : undefined,
    'aria-valuemin': hasValue ? 0 : undefined,
    'aria-valuemax': hasValue ? 100 : undefined,
    'aria-label': hasValue ? Math.round(clampedValue) + '% progress' : 'Loading',
    className:
      'linear-progress linear-progress-' + size + ' linear-progress-' + color
      + (hasValue ? ' linear-progress-determinate' : ' linear-progress-indeterminate')
      + ' ' + className + ' MuiBox-root omni-lp omni-lp-' + sizeKey,
    ...props,
  };
  const indicator = (
    <div className={'linear-progress-bar MuiBox-root omni-lp-bar omni-lp-c-' + C + (hasValue ? ' omni-lp-det' : ' omni-lp-ind')}
      style={hasValue ? { '--_lp-w': clampedValue + '%' } : undefined} />
  );
  const bar = hasSx(sx)
    ? <SxBox sx={sx} {...rootProps}>{indicator}</SxBox>
    : <div {...rootProps}>{indicator}</div>;

  if (!(showValue && hasValue)) return bar;
  return (
    <div className="linear-progress-field MuiBox-root omni-lp-field">
      {bar}
      {/* Figma's plain "Mobile Nav Label" binds Body-Font-Weight; MobileNavLabel
          is the NAV label at 600, so the weight is stated (as Player's times). */}
      <MobileNavLabel component="span" aria-hidden="true" className="linear-progress-value"
        style={{ color: 'var(--Text)', fontWeight: 'var(--Body-Font-Weight, 400)', fontVariantNumeric: 'tabular-nums' }}>
        {Math.round(clampedValue) + '%'}
      </MobileNavLabel>
    </div>
  );
}

export default LinearProgress;
