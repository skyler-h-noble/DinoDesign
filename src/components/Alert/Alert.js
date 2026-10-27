// src/components/Alert/Alert.js
import React from 'react';
import { Box } from '@mui/material';
import { Typography } from '../Typography';
import { Icon } from '../Icon/Icon';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
/* Level from the Figma effect style that NAMES this component.
   The five Effect-Levels are the five Figma effect styles, Elevations/Level-1 … Level-5:
     1  Elevations/Level-1 (Card, Accordion, Handle, Alert, Bottom-Sheet)
     2  Elevations/Level-2 (Card-Hover, App bars, Toolbars, Menus, Tooltip, Popover, Bottom-Sheet-Hover)
     3  Elevations/Level-3 (FAB, Snackbar, Card-Drag, Elevated-Card-Hover)
     4  Elevations/Level-4 (FAB-Hover, Elevated-Card-Drag)
     5  Elevations/Level-5 (Dialog & Modal)
   The Figma Alert carries it on the component ROOT, not on Theme-Container. */
import { SHADOW_LEVEL_1 } from '../_shadows';

/**
 * Alert Component
 *
 * VARIANTS:
 *   solid     data-theme="{Theme}" data-surface="Surface"
 *   light     data-theme="{Theme}"       data-surface="Surface-Brightest"
 *
 * COLORS: info | success | warning | error — the four STATES, as Figma's
 *   State-Theme axis. An alert's color is its meaning, and each state has a
 *   glyph that carries it without color. A brand-colored notice is a callout,
 *   not an alert; the old brand values still render, as info, with a warning.
 *
 * STRUCTURE:
 *   Outer shell — border var(--Buttons-{C}-Border), border-radius, Effect-Level-3 shadow
 *   Inner content — data-theme + data-surface, bg var(--Background), color var(--Text)
 *
 * SIZES: small | medium | large
 *
 * SLOTS:
 *   title          — the header text. With a title the alert is TWO rows, as
 *                    the Figma Alert (9645:17163) draws it: a header row
 *                    (startDecorator, title, endDecorator) and the body below
 *                    it at the left padding. Without one it stays one row.
 *   startDecorator — the state's icon by default (Figma's Start Decorator,
 *                    on); pass a node to replace it, or false for none
 *   endDecorator   — icon, link, or button at the end of the header / row
 *   children       — the body
 *
 * Accessibility: role="alert" for live-region announcement.
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* The four states and their glyphs — Figma's Message Icons. */
const STATE_ICONS = { info: InfoIcon, success: CheckCircleIcon, warning: WarningIcon, error: ErrorIcon };
const warnedColors = new Set();
function normalizeAlertColor(color) {
  const c = String(color || 'info');
  if (STATE_ICONS[c]) return c;
  if (process.env.NODE_ENV !== 'production' && !warnedColors.has(c)) {
    warnedColors.add(c);
    console.warn(
      '[Alert] color="' + c + '" — an alert is one of the four states ' +
      '(info, success, warning, error). Rendering color="info". A ' +
      'brand-colored notice is a callout: a Card in a themed Section.',
    );
  }
  return 'info';
}

/* Padding is one value on every side, as Figma's Theme-Container binds it
   (Sizing-2 = 16px at medium). It was 12px top and bottom against 16px sides. */
const SIZE_MAP = {
  small:  { pad: '12px', fontSize: '13px', iconSize: '18px', gap: '8px',  text: 'body-small',  title: 'body-small-semibold' },
  medium: { pad: 'var(--Sizing-2, 16px)',   fontSize: '14px', iconSize: '20px', gap: '10px', text: 'body',        title: 'body-semibold' },
  large:  { pad: '20px', fontSize: '16px', iconSize: '22px', gap: '12px', text: 'body-large',  title: 'body-large-semibold' },
};

/* Figma's container radius is bound to Sizing-1 (8px), not to the brand's
   --Style-Border-Radius — an alert stays an 8px card even in a pill-shaped
   system (Popsicle's 30px made it a capsule). */
const RADIUS = 'var(--Sizing-1, 8px)';

export function Alert({
  children,
  title,
  variant = 'light',
  surface,
  color: colorProp = 'info',
  size = 'medium',
  startDecorator: startProp,
  endDecorator,
  className = '',
  sx = {},
  ...props
}) {
  const color = normalizeAlertColor(colorProp);
  const C = cap(color);
  const StateGlyph = STATE_ICONS[color];
  /* Undefined is the state icon, as Figma's Start Decorator is on by default;
     false (or null) is none. */
  const startDecorator = startProp === undefined
    ? <Icon size="small"><StateGlyph /></Icon>
    : startProp;
  const s = SIZE_MAP[size] || SIZE_MAP.medium;

  // A light variant is the base theme at its BRIGHTEST surface, not a theme of
  // its own. Generated design systems stopped emitting *-Light themes — their
  // sheets carry Default, Primary, Secondary, Tertiary, Neutral and the states —
  // so `C + '-Light'` matched no rule and --Background resolved to nothing.
  const dataTheme = C;

  /* Explicit surface override.
   *
   * `variant` only ever reached three of the system's five surface levels —
   * light -> Surface-Brightest, dark -> Surface-Dimmest, anything else ->
   * Surface — so Surface-Dim and Surface-Bright were unreachable, and the
   * names did not match the data-surface vocabulary the rest of the system
   * speaks. This takes any of the five directly and wins over the variant
   * mapping, which stays as the default so existing usage is untouched.
   * Same shape as Card's surface prop. */
  const dataSurface = surface || (variant === 'light' ? 'Surface-Brightest' : 'Surface');
  const borderToken = 'var(--Buttons-' + C + '-Border)';

  /* Text is --Text-Match, the theme's own colored text (Figma's Text-Match):
     dark blue on an Info alert, dark green on Success — not the surface's
     near-black --Text. Set once on the inner box and INHERITED by the title
     and a string body (color="inherit"); a node passed as children should
     take color="inherit" to follow it. */
  const textNode = (content, className) =>
    typeof content === 'string'
      ? <Typography textStyle={s.text} color="inherit" className={className}>{content}</Typography>
      : content;

  const start = startDecorator && (
    <Box
      className="alert-start-decorator"
      sx={{ display: 'inline-flex', alignItems: 'center', fontSize: s.iconSize, lineHeight: 1, flexShrink: 0 }}
    >
      {startDecorator}
    </Box>
  );
  const end = endDecorator && (
    <Box
      className="alert-end-decorator"
      sx={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, gap: s.gap }}
    >
      {endDecorator}
    </Box>
  );

  const innerContent = title ? (
    <>
      <Box className="alert-header" sx={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
        {start}
        <Box className="alert-title" sx={{ flex: 1, minWidth: 0 }}>
          {typeof title === 'string'
            ? <Typography textStyle={s.title} color="inherit">{title}</Typography>
            : title}
        </Box>
        {end}
      </Box>
      {children != null && (
        <Box className="alert-message">{textNode(children)}</Box>
      )}
    </>
  ) : (
    <>
      {start}
      <Box className="alert-message" sx={{ flex: 1, minWidth: 0 }}>{textNode(children)}</Box>
      {end}
    </>
  );

  return (
    <Box
      role="alert"
      className={'alert alert-' + variant + ' alert-' + size + ' alert-' + color + ' ' + className}
      sx={{
        border: '1px solid ' + borderToken,
        borderRadius: RADIUS,
        overflow: 'hidden',
        boxShadow: SHADOW_LEVEL_1,  // Alert

        ...sx,
      }}
      {...props}
    >
      <Box
        data-theme={dataTheme}
        data-surface={dataSurface}
        className="alert-inner"
        sx={{
          display: 'flex',
          /* Two rows with a title (header, then body); one row without —
             icon, body and end CENTRED on the row, as Figma's Title=false:
             the 24px icon and body line sit in the middle of the 32px close
             button. */
          flexDirection: title ? 'column' : 'row',
          alignItems: title ? 'stretch' : 'center',
          gap: s.gap,
          padding: s.pad,
          fontSize: s.fontSize,
          /* The body face, not `inherit`. A string message gets a Typography,
             but a node — text with a <strong> in it — renders as-is, and the
             generated CSS gives the page no font, so it came out in the UA
             serif. */
          fontFamily: 'var(--Font-Family-Body, inherit)',
          lineHeight: 1.5,
          borderRadius: 'calc(' + RADIUS + ' - 1px)',
          /* On the element WITH its zone attributes, because the design
             system paints every [data-theme][data-surface] element with an
             opaque --Background and --Text at (0,2,0) — which beat this
             component's single class and erased both the 75% fill and
             Text-Match on the page. Class + two attributes is (0,3,0).

             Text-Match: see textNode above.

             The fill is 75% of the surface, as Figma's Theme-Container fill
             (Surface/Background at 0.753 opacity): the page shows faintly
             through. Text-Match's contrast is set against the opaque surface,
             so on a busy backdrop the text sits on a blend of the two. */
          '&[data-theme][data-surface]': {
            color: 'var(--Text-Match, var(--Text))',
            backgroundColor: 'color-mix(in srgb, var(--Background) 75.3%, transparent)',
          },
        }}
      >
        {innerContent}
      </Box>
    </Box>
  );
}

/* ─── Convenience Exports ─── */
export const SolidAlert = (p) => <Alert variant="solid" {...p} />;
export const LightAlert = (p) => <Alert variant="light" {...p} />;

export default Alert;
