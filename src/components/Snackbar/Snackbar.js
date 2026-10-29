// src/components/Snackbar/Snackbar.js
import React, { useEffect, useRef, useCallback } from 'react';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import CloseIcon from '@omni-design/icons/Close';
import { Button } from '../Button/Button';
import { Body, BodySmall, BodyLarge } from '../Typography';
import { SHADOW_LEVEL_3 } from '../_shadows';

/**
 * Snackbar (Toast) Component
 *
 * VARIANTS:
 *   light     data-theme="{Theme}" data-surface="Surface"
 *
 *   `solid` was RETIRED 2026-09-28. It still renders — it resolves to light and
 *   warns once in development, the same shim the -light button variants got —
 *   but do not write new ones and the converter must never emit one.
 *
 *   Why: a toast carries semantic color, so on a solid fill that color is
 *   also the background its label must survive on. The label then has to flip
 *   per theme AND per mode, which is 18 combinations to verify instead of 9.
 *   On the theme's Surface the color lives in Text-Match and the icon while
 *   the text sits on an opaque background — the same reasoning that keeps a
 *   Carousel dot's 3:1 in its border rather than its fill. Alert is already
 *   single-surface, and a toast is a floating alert, so the two now agree.
 *
 *   `surface` still reaches all five levels directly if a design needs one.
 *
 * COLORS: default | primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * STRUCTURE — Figma's Snack (9626:16503), placed by Snackbar (8839:28556):
 *   Shell     520 wide (never wider than the screen less its margins),
 *             --Dropdown-Frame-Radius corners (a floating frame: never rounder
 *             than a card, capped at 16), the FAB / Snackbar elevation (Level 3)
 *   Inner     data-theme + data-surface (Surface by default), a 1px --Border
 *             that takes layout space (as Figma's stroke does), Sizing-1 x Card-Padding padding, 10px between parts;
 *             text is --Text-Match and the icon --Icons-Match — the theme's
 *             own colors, as Alert
 *   Close     a ghost icon-only Button at the regular button height
 *
 * SIZES: small | medium | large — the message's text size
 * ANCHOR: top-right | top-middle | bottom-right | bottom-middle (Figma's
 *   four). 'top' / 'bottom' are the middle ones. Right sits in from the
 *   device --Margin; top / bottom sit --SnackBar-Top / --SnackBar-Bottom from
 *   the edge.
 * AUTO-HIDE: optional duration in ms
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const RADIUS = 'var(--Dropdown-Frame-Radius, 4px)';
const MARGIN = 'var(--Margin, 64px)';

const SxBox = lazySxBox('Snackbar');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* ─── Static sheet ───
   The slide-in reads its start and end transforms from custom properties set
   by the anchor's class, so one @keyframes serves all four anchors (the
   centred ones keep their translateX(-50%) through the slide). */
registerStaticStyles('omni-snackbar', [
  '@keyframes snackbar-slide-in{from{transform:var(--_sb-from)}to{transform:var(--_sb-to)}}',
  `.omni-sb{position:fixed;z-index:1400;width:min(520px, calc(100vw - 2 * ${MARGIN}));box-sizing:border-box;`
    + `border-radius:${RADIUS};box-shadow:${SHADOW_LEVEL_3};overflow:hidden;animation:snackbar-slide-in 0.3s ease forwards}`,
  /* Offset from the edge the snackbar is anchored to — see the note in the
     render on --SnackBar-Top / --SnackBar-Bottom. */
  `.omni-sb-right{right:${MARGIN}}`,
  '.omni-sb-mid{left:50%;transform:translateX(-50%)}',
  '.omni-sb-top{top:var(--SnackBar-Top, 24px)}',
  '.omni-sb-bottom{bottom:var(--SnackBar-Bottom, 24px)}',
  '.omni-sb-top.omni-sb-right{--_sb-from:translateY(-120%);--_sb-to:translateY(0)}',
  '.omni-sb-bottom.omni-sb-right{--_sb-from:translateY(120%);--_sb-to:translateY(0)}',
  '.omni-sb-top.omni-sb-mid{--_sb-from:translateX(-50%) translateY(-120%);--_sb-to:translateX(-50%) translateY(0)}',
  '.omni-sb-bottom.omni-sb-mid{--_sb-from:translateX(-50%) translateY(120%);--_sb-to:translateX(-50%) translateY(0)}',
  /* A real border: Figma's stroke here is included in the layout, so the
     content starts 1px further in (31, not 30) and the snack is 50 tall. */
  '.omni-sb-inner{display:flex;-webkit-box-align:center;align-items:center;gap:10px;padding:var(--Sizing-1, 8px) var(--Card-Padding, 16px);'
    + `font-family:var(--Font-Family-Body, inherit);border-radius:${RADIUS};border:1px solid var(--Border)}`,
  /* On the element WITH its zone attributes, as Alert: the design system
     paints [data-theme][data-surface] at (0,2,0). */
  '.omni-sb-inner[data-theme][data-surface]{color:var(--Text-Match, var(--Text));background-color:var(--Background)}',
  '.omni-sb-icon{display:inline-flex;flex-shrink:0;line-height:1;font-size:24px;color:var(--Icons-Match, currentColor)}',
  '.omni-sb-icon .MuiSvgIcon-root{font-size:inherit}',
  '.omni-sb-msg{flex:1;min-width:0}',
  '.omni-sb-slot{display:inline-flex;flex-shrink:0}',
  '.omni-sb-end{line-height:1}',
].join('\n'));

/** Warn once per session, not once per render. */
let warnedSolid = false;

export function Snackbar({
  children,
  open = false,
  onClose,
  variant = 'light',
  surface,
  color = 'default',
  size = 'medium',
  anchor = 'bottom',
  autoHideDuration,
  startDecorator,
  endDecorator,
  action,
  className = '',
  sx,
  ...props
}) {
  useStaticStyles('omni-snackbar');
  const timerRef = useRef(null);
  const C = cap(color === 'default' ? 'Default' : color);
  const TextComp = size === 'small' ? BodySmall : size === 'large' ? BodyLarge : Body;
  const atTop = String(anchor).startsWith('top');
  const atRight = String(anchor).endsWith('right');

  // A light variant is the base theme at its BRIGHTEST surface, not a theme of
  // its own. Generated design systems stopped emitting *-Light themes — their
  // sheets carry Default, Primary, Secondary, Tertiary, Neutral and the states —
  // so `C + '-Light'` matched no rule and --Background resolved to nothing.
  const dataTheme = color === 'default' ? 'Default' : C;
  /* Explicit surface override.
   *
   * `variant` only ever reached three of the system's five surface levels —
   * light -> Surface-Brightest, dark -> Surface-Dimmest, anything else ->
   * Surface — so Surface-Dim and Surface-Bright were unreachable, and the
   * names did not match the data-surface vocabulary the rest of the system
   * speaks. This takes any of the five directly and wins over the variant
   * mapping, which stays as the default so existing usage is untouched.
   * Same shape as Card's surface prop. */
  /* `solid` is retired. It resolves to light rather than throwing, because a
     published stylesheet and an un-upgraded consumer both have to keep
     working — the same contract --Button-Standard-* keeps in CSS. The warning
     is what stops it surviving silently. */
  if (process.env.NODE_ENV !== 'production' && variant === 'solid' && !warnedSolid) {
    warnedSolid = true;
    // eslint-disable-next-line no-console
    console.warn(
      '[Snackbar] variant="solid" is retired and now renders as "light". ' +
      'A solid fill makes the label carry the semantic color as its own ' +
      'background, doubling the contrast combinations to verify. ' +
      'Use the default, or pass `surface` to reach a specific level.',
    );
  }
  const dataSurface = surface || 'Surface';

  // Auto-hide timer
  useEffect(() => {
    if (open && autoHideDuration && autoHideDuration > 0) {
      timerRef.current = setTimeout(() => {
        onClose?.({}, 'timeout');
      }, autoHideDuration);
      return () => clearTimeout(timerRef.current);
    }
  }, [open, autoHideDuration, onClose]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.(e, 'escapeKeyDown');
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleMouseEnter = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (open && autoHideDuration && autoHideDuration > 0) {
      timerRef.current = setTimeout(() => {
        onClose?.({}, 'timeout');
      }, autoHideDuration);
    }
  }, [open, autoHideDuration, onClose]);

  if (!open) return null;

  /* Offset from the edge the snackbar is anchored to (omni-sb-top / -bottom).
   *
   * --SnackBar-Top / --SnackBar-Bottom are per-device: they are the
   * platform's system chrome (status bar + app bar at the top, home
   * indicator or gesture bar at the bottom) plus the clearance that
   * gives the shadow somewhere to fall. A phone reserves 98px at the
   * top where a desktop reserves 24, so a fixed number lands a snackbar
   * on top of the app bar's title on every touch platform.
   *
   * The two ends are deliberately asymmetric on every device but
   * Desktop: the top clears the app bar as well as the status bar,
   * while the bottom clears only the OS indicator — a bottom nav is a
   * template's choice, not the device's, so a template that places one
   * adds its height rather than this reserving space for a bar that may
   * not be there.
   *
   * The fallback is the DESKTOP value, not a smaller "safe" one. These
   * variables are defined by a generated foundation.css and by nothing
   * in this library, so the fallback is what an unthemed consumer
   * actually gets — and it should be the design system's answer for a
   * device with no chrome, not a number that contradicts it. */
  const rootProps = {
    role: 'alert',
    'aria-live': 'polite',
    'aria-atomic': 'true',
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    className: 'snackbar snackbar-' + variant + ' snackbar-' + size + ' snackbar-' + anchor + ' snackbar-' + color
      + ' omni-sb omni-sb-' + (atRight ? 'right' : 'mid') + ' omni-sb-' + (atTop ? 'top' : 'bottom') + ' ' + className,
    ...props,
  };
  const inner = (
    <div data-theme={dataTheme} data-surface={dataSurface} className="snackbar-inner omni-sb-inner">
      {startDecorator && (
        <div className="snackbar-icon omni-sb-icon">
          {startDecorator}
        </div>
      )}

      <div className="snackbar-message omni-sb-msg">
        {typeof children === 'string' ? (
          <TextComp color="inherit">{children}</TextComp>
        ) : children}
      </div>

      {action && (
        <div className="omni-sb-slot">
          {action}
        </div>
      )}

      {endDecorator && (
        <div className="omni-sb-slot omni-sb-end">
          {endDecorator}
        </div>
      )}

      {/* Button already keeps itself from shrinking (flex-shrink: 0). */}
      {onClose && (
        <Button
          iconOnly
          variant="ghost"
          onClick={(e) => onClose(e, 'closeClick')}
          aria-label="Close notification"
          className="snackbar-close"
        >
          <CloseIcon />
        </Button>
      )}
    </div>
  );

  return hasSx(sx)
    ? <SxBox sx={sx} {...rootProps}>{inner}</SxBox>
    : <div {...rootProps}>{inner}</div>;
}

export default Snackbar;
