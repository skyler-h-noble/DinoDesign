// src/components/Fab/Fab.js
import React from 'react';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { SHADOW_LEVEL_3, SHADOW_LEVEL_4, bevelShadow } from '../_shadows';

/**
 * Fab (Floating Action Button) Component
 *
 * VARIANTS:
 *   solid   bg: var(--Buttons-{C}-Button), text: var(--Buttons-{C}-Text), border: var(--Buttons-{C}-Border)
 *
 * There was a `light` variant. It is gone, along with the -Light button shades
 * it named: no design system publishes --Buttons-{C}-Light-Button and the five
 * tokens carried no fallbacks, so every declaration was invalid at computed-
 * value time and the whole variant rendered as an unstyled box. It had never
 * painted anything on any brand.
 *
 * A lighter FAB is a lighter SURFACE, not a lighter button token — put the Fab
 * on data-surface="Surface-Brightest" and keep variant="solid".
 *
 * COLORS: primary, secondary, tertiary, neutral, info, success, warning, error
 *
 * SIZES (Figma-aligned, matched to the Icon scale):
 *   small   32px  (Icon size="small"  → 16px)
 *   medium  48px  (Icon size="medium" → 24px) — default
 *   large   56px  (Icon size="large"  → 32px)
 *
 * EXTENDED: pill shape with icon + label text
 * ANIMATION: pulse ring effect when enabled
 *
 * Accessibility: role="button", aria-label, focus-visible ring
 */

const COLOR_MAP = {
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
};

const SIZE_MAP = {
  small:  { size: 32, iconSize: 16, fontSize: '13px', px: 12, gap: 6 },
  medium: { size: 48, iconSize: 24, fontSize: '14px', px: 16, gap: 8 },
  large:  { size: 56, iconSize: 32, fontSize: '15px', px: 20, gap: 10 },
};

function getTokens(color) {
  const C = COLOR_MAP[color] || 'Primary';
  return {
    bg: 'var(--Buttons-' + C + '-Button)',
    text: 'var(--Buttons-' + C + '-Text)',
    border: 'var(--Buttons-' + C + '-Border)',
    hover: 'var(--Buttons-' + C + '-Hover)',
    active: 'var(--Buttons-' + C + '-Pressed)',
  };
}

/* The pulse, read off Figma's FAB-Animation set (9244:7809).
 *
 * It is drawn there as three keyframes, and the shape matters: the ring GROWS
 * at a constant opacity and only THEN fades. It does not do both at once.
 *
 *   Start   stroke 0   opacity 0.5
 *   Middle  stroke 8   opacity 0.5
 *   End     stroke 8   opacity 0
 *
 * This used to spread to 12px while fading to zero by 70%, then collapse back
 * to 0 — a different motion from the one designed, at a different size, at 0.4
 * rather than 0.5.
 *
 * The colour is the bigger fix. Figma binds the ring's stroke to the `Button`
 * variable, i.e. the FAB's own fill. This read --pulse-rgb, which NOTHING in
 * the component ever set, so every pulse fell through to the 0,0,0 fallback
 * and rang black regardless of the button's colour. --Buttons-<C>-Button is
 * set per colour already, so the ring now follows the button it surrounds.
 */
const pulseKeyframes = `
@keyframes fab-pulse {
  0% { box-shadow: 0 0 0 0 var(--fab-pulse-color); }
  50% { box-shadow: 0 0 0 8px var(--fab-pulse-color); }
  100% { box-shadow: 0 0 0 8px transparent; }
}
`;

export function Fab({
  children,
  icon,
  label,
  variant = 'solid',
  /* Tertiary.
     A FAB is the one primary action floating over the content, and it is
     deliberately NOT the primary palette: it sits above everything, so it
     reads loudly at any colour, and taking primary would leave the actual
     primary buttons underneath competing with it.
     The showcase already applied this as `color === 'default' ? 'tertiary'`,
     which meant the intended colour lived in the gallery rather than in the
     component — anyone importing Fab got something else.
     Figma does not pin this: a FAB's colour comes from the Buttons MODE set on
     its frame, and that collection's ten modes are the same list this prop
     takes. */
  color = 'tertiary',
  size = 'medium',
  extended = false,
  animate = false,
  disabled = false,
  onClick,
  ariaLabel,
  className = '',
  sx = {},
  ...props
}) {
  /* `variant` stays as a prop so an existing variant="solid" keeps working and
     does not fall through ...props onto the <button> as an unknown attribute.
     Anything else normalises to solid — there is only one variant now. */
  if (process.env.NODE_ENV !== 'production' && variant !== 'solid') {
    // eslint-disable-next-line no-console
    console.warn(
      '[Fab] variant="' + variant + '" is not a Fab variant; rendering solid. '
      + 'The light variant was removed with the -Light button shades — it named '
      + 'tokens no design system publishes, so it rendered as an unstyled box. '
      + 'For a lighter FAB, put it on data-surface="Surface-Brightest".',
    );
  }
  const effectiveVariant = 'solid';
  const tokens = getTokens(color);
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const iconEl = icon || children || <AddIcon sx={{ fontSize: s.iconSize }} />;

  const effectiveLabel = ariaLabel || label || 'Action';

  return (
    <>
      {animate && <style>{pulseKeyframes}</style>}
      <Box
        component="button"
        type="button"
        role="button"
        aria-label={effectiveLabel}
        onClick={onClick}
        disabled={disabled}
        className={'fab fab-' + effectiveVariant + ' fab-' + color + ' fab-' + size +
          (extended ? ' fab-extended' : '') +
          (animate ? ' fab-animate' : '') +
          (disabled ? ' fab-disabled' : '') +
          (className ? ' ' + className : '')}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: extended ? s.gap + 'px' : 0,
          // Sizing
          ...(extended
            ? {
                height: s.size + 'px',
                borderRadius: s.size / 2 + 'px',
                px: s.px + 'px',
              }
            : {
                width: s.size + 'px',
                height: s.size + 'px',
                borderRadius: '50%',
              }),
          // Tokens
          backgroundColor: tokens.bg,
          color: tokens.text,
          border: 'var(--Button-Border-Width) solid ' + tokens.border,
          // Bevel sizing — height feeds --_bevel via --Button-Bevel %
          // (matches Button + Slider). At default --Button-Bevel: 0 the
          // bevel is invisible; bumping the token lights it up everywhere.
          '--_height': s.size + 'px',
          // Same min() cap as Button — bevel can never exceed 20% of height,
          // so the inset can't bleed into icon/label area regardless of
          // how high --Button-Bevel is set.
          '--_bevel': 'min(calc(var(--Button-Bevel) * var(--_height) / 100), calc(var(--_height) / 5))',
          boxShadow: `${bevelShadow(color)}, ${SHADOW_LEVEL_3}`,
          // Typography
          fontSize: s.fontSize,
          fontFamily: 'inherit',
          fontWeight: 600,
          // Interaction
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 'var(--Disabled, 0.38)' : 1,
          outline: 'none',
          flexShrink: 0,
          transition: 'background-color 0.15s ease, box-shadow 0.2s ease, transform 0.1s ease',
          '&:hover': !disabled ? { backgroundColor: tokens.hover, boxShadow: `${bevelShadow(color)}, ${SHADOW_LEVEL_4}` } : {},
          '&:active': !disabled ? { backgroundColor: tokens.active, transform: 'scale(0.96)', boxShadow: bevelShadow(color) } : {},
          '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px' },
          // Animation
          ...(animate && !disabled && {
            /* 50% of the button's own colour — Figma's Start and Middle both
               sit at opacity 0.5, and colour-mix gets that from the same token
               the fill uses rather than needing a second variable. */
            '--fab-pulse-color': `color-mix(in srgb, ${tokens.bg} 50%, transparent)`,
            animation: 'fab-pulse 2s var(--Motion-Easing-Standard, ease) infinite',
            /* The design system zeroes --Motion-Duration-* under
               prefers-reduced-motion, and this loop ignored that entirely: a
               hardcoded `2s infinite` kept pulsing for a viewer who has asked
               the OS to stop moving things. WCAG 2.2.2 is about exactly this —
               content that moves indefinitely and cannot be stopped.

               The duration tokens cannot carry the loop (they are 100-300ms
               and this is a 2s breath), so the honest fix is to stop the
               animation outright rather than shorten it. */
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
            },
          }),
          ...sx,
        }}
        {...props}
      >
        {/* Icon */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: s.iconSize + 'px',
          color: 'inherit',
          '& .MuiSvgIcon-root': { fontSize: 'inherit', color: 'inherit' },
        }}>
          {iconEl}
        </Box>

        {/* Extended label */}
        {extended && label && (
          <Box component="span" sx={{ whiteSpace: 'nowrap', lineHeight: 1 }}>
            {label}
          </Box>
        )}
      </Box>
    </>
  );
}

export default Fab;
