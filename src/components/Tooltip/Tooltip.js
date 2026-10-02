// src/components/Tooltip/Tooltip.js
import React from 'react';
import { Tooltip as MuiTooltip, Box } from '@mui/material';
import { tokenSegment } from '../_shadows';

/**
 * Tooltip Component
 *
 * STYLES:
 *   solid    data-theme: the bare palette + data-surface="Surface"
 *            bg: var(--Buttons-{C}-Button)  text: var(--Buttons-{C}-Text)
 *
 *   light    data-theme: base theme + data-surface="Surface-Brightest". The
 *            Buttons tokens are surface-aware, so the brighter surface is what
 *            lightens it — not a tint.
 *
 *   outline  No data-theme. border: 1px solid var(--Buttons-{C}-Border)
 *
 * COLOR defaults to `black-white`, which is the mode Figma pins on
 * `Button-Theme-Tooltip`. Pass another palette to recolor — that is the code
 * equivalent of re-pinning the Buttons mode on that frame.
 *
 * SIZES: small | medium | large
 * PLACEMENT: 12 positions (top, top-start, top-end, right, etc.)
 * ARROW: boolean, default TRUE — every Figma variant carries the arrow
 * OPEN: undefined (uncontrolled) | true | false
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* `black-white` capitalises to `Black-white`, which is not a token — the design
   system emits --Buttons-BlackWhite-*. Same shared mapping Button uses, rather
   than a second copy of the special case here. */
const seg = tokenSegment;

const SOLID_THEME_MAP = {
  primary: 'Primary',
  secondary: 'Secondary',
  tertiary: 'Tertiary',
  neutral: 'Neutral',
  /* Bare, like the other four. The -Medium shades were removed and these
     bound nothing, so a solid info tooltip took the page's palette instead of
     Info — the same hole the light map above was already fixed for. */
  info: 'Info',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
};

// A light tooltip is the BASE theme at its brightest surface. Generated design
// systems do not emit *-Light themes, so the old map matched no rule.
const LIGHT_THEME_MAP = {
  primary: 'Primary',
  secondary: 'Secondary',
  tertiary: 'Tertiary',
  neutral: 'Neutral',
  info: 'Info',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
};

/* The design system owns the geometry; the literals are the values it emits, as
   fallbacks for an older system with no Tooltip tokens.
   The height's token is `Tooltip-Arrow-Height`. It was `Tooltip-Arrow` until the
   width got its own, at which point a bare `Arrow` no longer said which
   dimension it meant.
   `arrowSize` is gone. It was ONE number driving MUI's `fontSize`, from which
   MUI derives `width: 1em; height: 0.71em` — a rotated square. That can express
   neither the 2:1 the design draws nor a width and height that move apart, so
   the arrow now takes both dimensions explicitly. */
const SIZE_MAP = {
  small: {
    fontSize: '12px',
    py: 'var(--Sm-Tooltip-Padding, 4px)',
    px: 'var(--Sm-Tooltip-Padding, 4px)',
    gap: 'var(--Sm-Tooltip-Gap, 2px)',
    arrowW: 'var(--Sm-Tooltip-Arrow-Width, 12px)',
    arrowH: 'var(--Sm-Tooltip-Arrow-Height, 6px)',
    arrowVisible: 'var(--Sm-Tooltip-Visible-Arrow-Height, 4px)',
    maxWidth: 200,
  },
  medium: {
    fontSize: '13px',
    py: 'var(--Tooltip-Padding, 8px)',
    px: 'var(--Tooltip-Padding, 8px)',
    gap: 'var(--Tooltip-Gap, 4px)',
    arrowW: 'var(--Tooltip-Arrow-Width, 16px)',
    arrowH: 'var(--Tooltip-Arrow-Height, 8px)',
    arrowVisible: 'var(--Tooltip-Visible-Arrow-Height, 6px)',
    maxWidth: 280,
  },
  large: {
    fontSize: '14px',
    py: 'var(--Lg-Tooltip-Padding, 12px)',
    px: 'var(--Lg-Tooltip-Padding, 12px)',
    gap: 'var(--Lg-Tooltip-Gap, 8px)',
    arrowW: 'var(--Lg-Tooltip-Arrow-Width, 20px)',
    arrowH: 'var(--Lg-Tooltip-Arrow-Height, 10px)',
    arrowVisible: 'var(--Lg-Tooltip-Visible-Arrow-Height, 7px)',
    maxWidth: 360,
  },
};

/** Which way the arrow points, from the placement. MUI swaps the arrow box's
 *  axes for left/right (`height: 1em; width: 0.71em`), so the override has to
 *  swap with it — the design does the same thing by rotating one polygon +-90. */
const isSideways = (placement) =>
  String(placement).startsWith('left') || String(placement).startsWith('right');

export function Tooltip({
  children,
  title,
  variant = 'solid',
  color = 'black-white',
  size = 'medium',
  placement = 'bottom',
  arrow = true,
  open,
  enterDelay = 100,
  leaveDelay = 0,
  describeChild = false,
  className = '',
  sx = {},
  ...props
}) {
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const isSolid = variant === 'solid';
  const isLight = variant === 'light';
  const isOutline = variant === 'outline';
  const C = seg(color);
  const sideways = isSideways(placement);

  // Resolve data-theme
  const dataTheme = isSolid
    ? SOLID_THEME_MAP[color]
    : isLight
      ? LIGHT_THEME_MAP[color]
      : null;

  /* The bubble and its label come from the BUTTONS collection, which is what
     Figma binds: `Button-Theme-Tooltip` pins a Buttons mode (black-white by
     default) and every fill under it reads Buttons::Button, with the label and
     icon on Buttons::Text.
     These were --Background / --Text — the SURFACE. That painted a tooltip the
     color of the page it floated over and gave the consumer no way to recolor
     it, because re-pinning a Buttons mode is exactly what the design says you
     do. The three assignments below were also ternaries with identical
     branches, so `isOutline` selected between two copies of the same value.
     The Buttons tokens stay surface-aware, so `light` still differs from
     `solid` through data-surface — the variant system is unchanged. */
  const tooltipBg = 'var(--Buttons-' + C + '-Button)';
  const tooltipText = 'var(--Buttons-' + C + '-Text)';
  const tooltipBorder = isOutline
    ? '1px solid var(--Buttons-' + C + '-Border)'
    : 'none';

  // The arrow is part of the bubble, so it takes the bubble's fill. In Figma it
  // is Polygon 11, bound to the same Buttons::Button and seated by a -2 gap.
  const arrowColor = tooltipBg;
  const arrowBorder = isOutline ? 'var(--Buttons-' + C + '-Border)' : 'transparent';

  // Controlled vs uncontrolled
  const openProp = open === undefined ? {} : { open };

  return (
    <MuiTooltip
      title={
        title ? (
          <Box
            data-theme={dataTheme || undefined}
            data-surface={isLight ? 'Surface-Brightest' : isSolid ? 'Surface' : undefined}
            className={'tooltip-content tooltip-' + variant + ' tooltip-' + color + ' tooltip-' + size + ' ' + className}
            sx={{
              backgroundColor: tooltipBg,
              color: tooltipText,
              border: tooltipBorder,
              /* --Tooltip-Radius, not --Style-Border-Radius. The design pins
                 the tooltip's corner FLAT at 8 — same at every size and every
                 brand — so deriving it here from the brand radius made the two
                 disagree for any brand whose radius is not 8. The fallback keeps
                 older design systems, which have no Tooltip tokens, on the
                 behaviour they shipped with. */
              borderRadius: 'var(--Tooltip-Radius, var(--Style-Border-Radius))',
              fontSize: s.fontSize,
              lineHeight: 1.5,
              fontFamily: 'inherit',
              padding: s.py + ' ' + s.px,
              maxWidth: s.maxWidth + 'px',
              /* The design's `Tooltip container` is a horizontal auto-layout with
                 Tooltip-Gap between an icon, the label and an optional button.
                 A plain string title renders identically; a multi-part one now
                 gets the design's spacing instead of none. */
              display: 'flex',
              alignItems: 'center',
              gap: s.gap,
              /* Elevation 2 — the resting level of the
                 `AppBar, Toolbars, Menus` group, which a tooltip shares. It is
                 a transient, anchored, non-blocking floating panel; that IS the
                 Menu's behaviour, and like the rest of that group it has no
                 Hover level (a tooltip has no hover state — it is the hover
                 result).
                 This was a hardcoded `0 2px 8px rgba(0,0,0,0.15)`: a raw rgba,
                 so it ignored --Dropshadow-Color, did not follow theme or
                 surface, and painted the same shadow in dark mode as in light.
                 The geometry is close to what it was, so this is not a
                 redesign. */
              boxShadow: 'var(--Effect-Level-2)',
              ...sx,
            }}
          >
            {title}
          </Box>
        ) : ''
      }
      placement={placement}
      arrow={arrow}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
      describeChild={describeChild}
      {...openProp}
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: 'transparent',
            padding: 0,
            maxWidth: 'none',
            boxShadow: 'none',
          },
        },
        arrow: {
          sx: {
            color: arrowColor,
            /* The ARROW BOX carries the two dimensions. MUI sizes it 1em x 0.71em
               off fontSize; naming width and height outright is what lets the
               design's 2:1 survive, and `arrowVisible` is how much protrudes —
               the rest tucks behind the bubble, which is what the design's
               Arrow-Holder (Visible-Arrow-Height) and -2px gap express. */
            width: sideways ? s.arrowVisible : s.arrowW,
            height: sideways ? s.arrowW : s.arrowVisible,
            '&::before': {
              border: isOutline ? '1px solid ' + 'var(--Buttons-' + C + '-Border)' : 'none',
              backgroundColor: arrowColor,
              boxSizing: 'border-box',
              width: '100%',
              height: '100%',
            },
          },
        },
      }}
      {...props}
    >
      {children}
    </MuiTooltip>
  );
}

// Convenience exports
export const SolidTooltip   = (p) => <Tooltip variant="solid"   {...p} />;
export const LightTooltip   = (p) => <Tooltip variant="light"   {...p} />;
export const OutlineTooltip = (p) => <Tooltip variant="outline" {...p} />;

export default Tooltip;
