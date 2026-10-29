// src/components/InputMessage/InputMessage.js
//
// The design's Input Message (8580:22909) — a field's validation state, as a
// small themed chip under the field.
//
// ── It is a THEMED ZONE, not a coloured box ──────────────────────────────────
// Figma wraps each message in a `Theme-{State}` frame pinning Theme={State} and
// Surface=Surface-Brightest, and fills it with `Background`. So the chip does
// not pick a colour — it declares which theme and surface level it is, and the
// cascade resolves the fill, the border and the text for it. That is the same
// contract the rest of the system uses, and the reason a message reads
// correctly in dark mode without anyone writing a second value.
//
// ── Why the text is Text-{State} and not --Text (in Legal-Semibold) ──────────────────────────────
// Inside the zone, plain --Text would already be legible. The design binds
// Text-Error / Text-Warning / Text-Success / Text-Info specifically, which are
// contrast-checked for carrying a semantic meaning rather than for being body
// copy. Following the file rather than the shortcut.
//
// ── The icon is xxs, which is Figma's 16 ─────────────────────────────────────
// Figma pins the nested Icon to `Icons & Avatars = xxs`. The library's `small`
// is 24 — its own docblock records that the two scales were once off by a
// step — so this asks for xxs explicitly.
import React from 'react';
import { LegalSemibold } from '../Typography';
import { Icon } from '../Icon/Icon';
import ErrorIcon from '@omni-design/icons/Error';
import WarningIcon from '@omni-design/icons/Warning';
import CheckCircleIcon from '@omni-design/icons/CheckCircle';
import InfoIcon from '@omni-design/icons/Info';
import { useStaticStyles } from '../_staticStyles';
import { registerBoxStyles } from '../_webkitBox';
import { lazySxBox } from '../_lazyFallback';

const SxBox = lazySxBox('InputMessage');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* 75% of the zone's Background — Figma's Theme-{State} fill is Background at
   0.75, so the parent surface tints through. In the colour, not as opacity,
   which would also fade the icon and text.
   Again with the zone attributes in the selector: the design system paints
   every [data-theme][data-surface] element with an OPAQUE --Background at
   (0,2,0), which beats a single class and drew the chip solid. Class + two
   attributes is (0,3,0) — Alert's fix. */
const IM_FILL = 'color-mix(in srgb, var(--Background) 75%, transparent)';
registerBoxStyles('omni-input-message', [
  '.omni-im{display:inline-flex;align-items:center;gap:var(--Sizing-Half);padding:0 var(--Sizing-Half);'
    + 'border-radius:var(--Sizing-Half);background-color:' + IM_FILL + '}',
  '.omni-im[data-theme][data-surface]{background-color:' + IM_FILL + '}',
].join('\n'));

/** Figma's Message Icons set (8580:22896): one glyph per notification. */
export const MESSAGE_ICONS = {
  error: ErrorIcon,
  warning: WarningIcon,
  success: CheckCircleIcon,
  info: InfoIcon,
};

/** Theme mode per state — the `Theme-{State}` frame each variant wraps in. */
const THEME = {
  error: 'Error', warning: 'Warning', success: 'Success', info: 'Info',
};

export const INPUT_MESSAGE_TYPES = Object.keys(THEME);

export function InputMessage({
  children,
  type = 'error',
  withIcon = true,
  className = '',
  sx,
  ...props
}) {
  useStaticStyles('omni-input-message');
  const theme = THEME[type] || THEME.error;
  const Glyph = MESSAGE_ICONS[type] || MESSAGE_ICONS.error;

  const root = {
    className: 'input-message input-message-' + type + ' ' + className + ' MuiBox-root omni-im',
    /* The zone declares itself; the cascade paints it. Writing a fill here
       would lock the chip to one tone and leave its text on the parent's. */
    'data-theme': theme,
    'data-surface': 'Surface-Brightest',
    ...props,
  };
  const content = (
    <>
      {withIcon && (
        /* Decoration. The message text IS the message, so a named icon beside
           it would announce the state twice. */
        <Icon size="xxs" color={type}><Glyph /></Icon>
      )}
      {/* The COLOR PROP, not style={{ color }}. Typography owns its colour
          roles and `error`/`warning`/`success`/`info` resolve to --Text-Error
          and friends — the same tokens Figma binds. */}
      <LegalSemibold className="input-message-text" color={type}>
        {children}
      </LegalSemibold>
    </>
  );
  if (hasSx(sx)) return <SxBox sx={sx} {...root}>{content}</SxBox>;
  return <div {...root}>{content}</div>;
}

export default InputMessage;
