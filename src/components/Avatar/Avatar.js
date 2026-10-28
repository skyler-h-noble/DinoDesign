// src/components/Avatar/Avatar.js
import React, { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import { shapePath, shapeStyle, AVATAR_SHAPES } from '../Shape/shapes';
import { Box } from '@mui/material';
import { AvatarGlyph } from './AvatarGlyph';
import { NumberSmall, NumberMedium, NumberLarge, CAP_HEIGHT_TRIM } from '../Typography';
import { DEFAULT_AVATAR_SRC } from './defaultAvatar';
import { useGhost, ghostBlockSx } from '../_ghost';

/**
 * Avatar Component
 *
 * CONTENT (priority): real src → initials → DEFAULT PHOTO.
 *   A bare <Avatar /> is Figma's DEFAULT style: the person glyph. The three
 *   styles map to: bare <Avatar /> (Default), initials="…" (Initials),
 *   src="…" — or defaultPhoto for the built-in sample photo — (Photo).
 *   No `icon`: an icon on a disc is not a person — it is an icon button or a
 *   status mark. `icon` still renders (as the photo / glyph) and warns once.
 *
 * SIZES (Figma-aligned):
 *   xx-small   24   |  x-small   32   |  small     40
 *
 * There was an xxx-small at 16. It is gone: Figma has no 16px STANDALONE
 * avatar, and the only thing that wanted one was Button's decorator — which
 * has its own ramp (Button-Avatar 16/20/40) and now passes a pixel size
 * directly. A named size that exists for one internal caller is a public API
 * paying for a private need.
 *   medium     56   |  large     64   |  x-large   80   |  xx-large 160
 *   custom     — pass `customSize` (pixel diameter); icon ~50%.
 *
 * COLORS: default, primary, secondary, tertiary, neutral
 *   (State colors aren't meaningful on an avatar — kept off the public API.)
 *   Background: var(--Buttons-{C}-Border)
 *   Text/Icon:  var(--Buttons-{C}-Text)
 *   Photo content ignores color (the image is the visual).
 *
 * INSIDE BUTTON:
 *   Pass `insideButton` when the avatar lives inside a Button — adds 2px
 *   horizontal margin so the button's interior has breathing room around the
 *   circular silhouette without you having to wrap the avatar in a spacer.
 *
 * CLICKABLE:
 *   Border:  var(--Buttons-Default-Border)
 *   Hover:   var(--Buttons-Default-Hover)
 *   Active:  var(--Buttons-Default-Pressed)
 *   Focus:   var(--Focus-Visible)
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const COLOR_MAP = {
  default: 'Default',
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
};

// Each size pairs a pixel diameter with the typography component used for
// initials. Larger sizes use larger type tokens so initials scale with the
// avatar. 'custom' falls back to whatever `customSize` is passed (a number
// of pixels). Icon size scales as a rough 50% of the avatar diameter.
/* ALIGNED TO FIGMA 2026-09-28 — and this MOVED THREE EXISTING NAMES.
 *
 * The two ladders held the same pixel values under names offset by two steps:
 *
 *   Figma  xxs 16 · xs 20 · small 24 · medium 32 · large 40 · xl 56 · xxl 72
 *   was                     xx-small 24 · x-small 32 · small 40 · medium 56 …
 *
 * So a designer picking "medium" got 32 and a developer writing size="medium"
 * got 56, with nothing to report it — both sides used one vocabulary for
 * different rungs. The initials ramp confirmed the offset independently
 * (Figma small -> 14 was the lib's xx-small -> 14).
 *
 * BREAKING, and it cannot be shimmed. `small`, `medium` and `large` exist in
 * both ladders with different values, so there is no way to tell which one a
 * call site meant — a runtime warning would have to fire on every usage,
 * including the correct ones. The old x- and xx- spellings CAN be mapped,
 * because they do not exist in the new ladder and their pixel values are
 * unambiguous; see LEGACY_SIZE_ALIAS below.
 *
 *   size="small"   40 -> 24
 *   size="medium"  56 -> 32
 *   size="large"   64 -> 40
 *
 * x-large (80) and xx-large (160) are KEPT. Figma's ladder stops at 72, and
 * dropping them would delete the only sizes an avatar-led layout has — a
 * profile header is not a 72px avatar. They are lib-only extensions above the
 * design's range, and that is recorded here rather than left to be rediscovered
 * as a gap.
 */
/* Exported for AvatarGroup, which steps by the avatar's diameter. */
export const AVATAR_SIZE_MAP = {
  xxs:         { size: 16,  iconSize: 9 },
  xs:          { size: 20,  iconSize: 12 },
  small:       { size: 24,  iconSize: 14 },
  medium:      { size: 32,  iconSize: 18 },
  large:       { size: 40,  iconSize: 22 },
  xl:          { size: 56,  iconSize: 28 },
  xxl:         { size: 72,  iconSize: 40 },
  /* Above Figma's range — no mode exists for these. */
  'x-large':   { size: 80,  iconSize: 40 },
  'xx-large':  { size: 160, iconSize: 80 },
};

/* The two spellings that CAN be carried over, because the new ladder has no
   name colliding with them and the pixel value is unchanged. Warned once so a
   consumer learns the new name rather than discovering it when the alias goes. */
const LEGACY_SIZE_ALIAS = { 'xx-small': 'small', 'x-small': 'medium' };
let warnedLegacySize = false;

export function resolveSizeName(size) {
  const mapped = LEGACY_SIZE_ALIAS[size];
  if (!mapped) return size;
  if (process.env.NODE_ENV !== 'production' && !warnedLegacySize) {
    warnedLegacySize = true;
    // eslint-disable-next-line no-console
    console.warn(
      `[Avatar] size="${size}" is the old ladder's name for ${AVATAR_SIZE_MAP[mapped].size}px. ` +
      `Use size="${mapped}". The ladder was realigned to Figma on 2026-09-28; ` +
      'note that small, medium and large also changed value.',
    );
  }
  return mapped;
}

// Initials wear the NUMBER style — the design's "Avatar-Initials" text style is
// Font(family: Typography/Number/Small/Font-Family, weight: …/Font-Weight,
// lineHeight: …/Line-Height, letterSpacing: …/Character-Spacing). That face is
// the Body face at 700 with ZERO tracking, which is why there is no
// tracking-cancel hack here: the eyebrow face this used to borrow is tracked
// out 0.04–0.06em, and centred initials had to be pulled back by half of it.
//
// Which of the three Number steps a size gets decides face and weight only —
// all three are the same face at 700, so in practice this is about line-height.
function getInitialsComp(size) {
  switch (size) {
    case 'xx-small':
    case 'x-small':
    case 'small':     return NumberSmall;
    case 'medium':
    case 'large':     return NumberMedium;
    case 'x-large':
    case 'xx-large':  return NumberLarge;
    default:          return NumberMedium;
  }
}

// Initials size is a function of the avatar's DIAMETER, not an independent type
// step — a 160px avatar and a 24px one are the same glyphs at different scales.
// The design anchors the ratio: a 24px avatar binds its initials to
// --Button-Avatar-Text = 14px, i.e. 7/12 of the diameter. Every step is derived
// from that one anchor, which also makes `customSize` scale correctly (it used
// to silently borrow medium's fixed size).
//
// This is deliberately NOT read from --Number-{Step}-Font-Size. That ramp is
// 16 / 28 / 36 and stops well short of the 160px avatar, so the largest steps
// would render initials at under a quarter of the circle.
/* The Figma ladder, read off Icons & Avatars::Avatar-Initials per mode. It is
   NOT a single ratio — 9/16, 12/20, 14/24, 18/32, 22/40, 28/56, 40/72 — and the
   7/12 rule this used put a 32px avatar's initials at 19 where the design has
   18. Off the ladder (x-large, xx-large, custom) the old 7/12 still scales. */
const INITIALS_PX = { xxs: 9, xs: 12, small: 14, medium: 18, large: 22, xl: 28, xxl: 40 };
const initialsFontSize = (diameter, sizeName) =>
  (INITIALS_PX[sizeName] ?? Math.round((diameter * 7) / 12)) + 'px';

// The ring is 1px at every size — the same hairline as a button's border, so
// it tracks --Button-Border-Width (1px, load-bearing for the Figma button
// heights; only READ here).
const BORDER_WIDTH = 'var(--Button-Border-Width, 1px)';

/* Initials inside a SHAPE are about two-thirds of the round size — a cookie
   or a flower has less room than a circle. Figma: Icons & Avatars::
   Avatar-Shape-Initials (6 / 8 / 9 / 12 / 15 / 19 / 27). */
const SHAPE_INITIALS_PX = { xxs: 6, xs: 8, small: 9, medium: 12, large: 15, xl: 19, xxl: 27 };
const shapeInitialsFontSize = (diameter, sizeName) =>
  'var(--Avatar-Shape-Initials, ' + (SHAPE_INITIALS_PX[sizeName] ?? Math.round((diameter * 7) / 18)) + 'px)';
let warnedShape = false;

let warnedIcon = false;
function warnIconOnce() {
  if (warnedIcon || process.env.NODE_ENV === 'production') return;
  warnedIcon = true;
  // eslint-disable-next-line no-console
  console.warn(
    '[Avatar] `icon` is retired — an avatar is a person: a photo, initials or ' +
    'the Default glyph. An icon on a disc is an icon ' +
    'Button or a status mark. Rendering the avatar without it.',
  );
}

export function Avatar({
  src,
  // The DEFAULT avatar IS the photo: a bare <Avatar /> shows the lib's built-in
  // photo. `src` (a real URL) always wins; `initials`
  // override the photo (those are the other two variants). Pass
  // defaultPhoto shows the lib's built-in sample photo (Figma's Photo style
  // preview); without src, initials or defaultPhoto the avatar is the glyph.
  defaultPhoto = false,
  alt,
  initials,
  icon: _retiredIcon,
  color = 'default',
  /* 32px, which the realigned ladder calls `medium` — it was `x-small` under
     the old names. The pixel value is unchanged; only the word moved. */
  size = 'medium',
  customSize,
  clickable = false,
  onClick,
  // When true, adds 2px horizontal margin so an Avatar inside a Button has
  // breathing room without needing a wrapping spacer.
  insideButton = false,
  /* One of AVATAR_SHAPES (circle, squircle, rounded, cookies, flower, gem,
     puffy, bun). Unset or 'circle' is the round avatar. One avatar shape per
     brand — a list of people in mixed shapes reads as broken. */
  shape,
  className = '',
  sx = {},
  ...props
}) {
  const ghost = useGhost();
  const [imgError, setImgError] = useState(false);
  // Custom size — pixel diameter from `customSize` prop, icon ~50% of that.
  const s = size === 'custom' && customSize
    ? { size: customSize, iconSize: Math.round(customSize * 0.5) }
    : (AVATAR_SIZE_MAP[resolveSizeName(size)] || AVATAR_SIZE_MAP.medium);
  const C = COLOR_MAP[color] || COLOR_MAP.default;

  // Photo source: an explicit src wins; otherwise the built-in default photo —
  // but only when there's no initials and no explicit icon, so those two
  // variants still take precedence over the default photo.
  if (_retiredIcon !== undefined) warnIconOnce();
  const effectiveSrc = src || (defaultPhoto && !initials ? DEFAULT_AVATAR_SRC : undefined);
  const hasSrc = effectiveSrc && !imgError;
  const hasInitials = !hasSrc && initials;
  const isFallback = !hasSrc && !hasInitials;
  const isClickable = clickable || !!onClick;

  /* The Default style is the person glyph ALONE: Figma's Button-Theme-Avatar
     frame has no fill, and its glyph — which carries its own disc — is filled
     with Buttons::Border. Painting --Buttons-{C}-Button behind it put a pale
     disc where the design has none. */
  const glyphOnly = isFallback;
  const bg = hasSrc || glyphOnly ? 'transparent' : 'var(--Buttons-' + C + '-Button)';
  const borderColor = 'var(--Buttons-' + C + '-Border)';
  // The lone glyph is drawn in currentColor, so the root carries its color.
  const textColor = glyphOnly ? borderColor : 'var(--Buttons-' + C + '-Text)';

  const component = isClickable ? 'button' : 'div';

  if (shape && !AVATAR_SHAPES.includes(shape) && process.env.NODE_ENV !== 'production' && !warnedShape) {
    warnedShape = true;
    // eslint-disable-next-line no-console
    console.warn('[Avatar] "' + shape + '" is not an avatar shape — drawn round. Use one of: ' + AVATAR_SHAPES.join(', ') + '.');
  }
  const shaped = Boolean(shape) && shape !== 'circle' && AVATAR_SHAPES.includes(shape);
  if (shaped) {
    return (
      <ShapedAvatar shape={shape} s={s} size={size} C={C} component={component}
        isClickable={isClickable} onClick={onClick} alt={alt} initials={initials}
        effectiveSrc={hasSrc ? effectiveSrc : null} onImgError={() => setImgError(true)}
        hasInitials={hasInitials} insideButton={insideButton} className={className} sx={sx} {...props} />
    );
  }

  return (
    <Box
      component={component}
      type={isClickable ? 'button' : undefined}
      role={isClickable ? 'button' : 'img'}
      aria-label={alt || initials || 'Avatar'}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onClick : undefined}
      {...(ghost ? { 'data-ghost-block': 'true' } : {})}
      className={'avatar avatar-' + size + ' avatar-' + color +
        (isClickable ? ' avatar-clickable' : '') +
        (hasSrc ? ' avatar-image' : hasInitials ? ' avatar-initials' : ' avatar-fallback') +
        (className ? ' ' + className : '')}
      sx={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: s.size + 'px', height: s.size + 'px',
        // The ring sits INSIDE the diameter, as Figma's stroke does — without
        // this a 32px avatar in a button measured 34.
        boxSizing: 'border-box',
        borderRadius: '50%',
        backgroundColor: bg,
        color: textColor,
        /* Keeps the circle — a ghosting avatar is the avatar's own geometry
           with the photo and initials gone, so the row does not reflow when
           the real one loads. The 50% radius above already wins over the
           block's default. */
        ...(ghost ? ghostBlockSx({ radius: '50%', animate: ghost.animate }) : {}),
        fontFamily: 'inherit', fontWeight: 600,
        // The lone glyph overlays the ring (see below), and overflow clips at
        // the padding edge — inside the border — so it would cut the glyph's
        // rim off. The glyph is itself a disc; nothing else can spill.
        position: 'relative',
        overflow: glyphOnly && !ghost ? 'visible' : 'hidden',
        flexShrink: 0,
        /* One ring, all three styles, at every size: every disc frame in the
           Figma set (Photo, Button-Theme-Avatar, Button-Theme-Initials) draws a
           1px stroke bound to Buttons::Border (--Buttons-{C}-Border, the
           button's own outline — not the surface's --Border, which diverges
           once a color is set). Decided 2026-10-20: always a ring.

           Icons & Avatars::Avatar-Border (0 standalone, 1 in a button) is bound
           to the component root, which has no stroke, so it does not reach the
           ring. 0.14.16 followed that variable and dropped the ring standalone;
           this restores it. The ring also gives a clickable avatar the 3:1
           boundary its fill alone may not. */
        border: BORDER_WIDTH + ' solid ' + borderColor,
        // Inside-button breathing room. Pure margin so the avatar's circular
        // silhouette doesn't get pushed into an ellipse by padding.
        ...(insideButton && { marginLeft: '2px', marginRight: '2px' }),
        // Button reset
        ...(isClickable && {
          cursor: 'pointer',
          outline: 'none',
          padding: 0,
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
          '&:hover': { backgroundColor: hasSrc ? 'rgba(0,0,0,0.08)' : 'var(--Buttons-Default-Hover)' },
          '&:active': { backgroundColor: hasSrc ? 'rgba(0,0,0,0.15)' : 'var(--Buttons-Default-Pressed)' },
          '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px' },
        }),
        ...sx,
      }}
      {...props}
    >
      {hasSrc && (
        <Box
          component="img"
          src={effectiveSrc}
          alt={alt || 'Avatar'}
          /* Google profile photos (lh3.googleusercontent.com) refuse requests
             that carry a cross-site referrer, so a signed-in user's avatar
             failed to load and fell through to an empty circle. Sending no
             referrer is what those URLs need and costs nothing elsewhere. */
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          sx={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            borderRadius: '50%',
          }}
        />
      )}
      {hasInitials && (() => {
        const TextComp = getInitialsComp(size);
        return (
          <TextComp
            sx={{
              color: 'inherit',
              // No fontWeight override — the Number step carries its own (700).
              fontSize: initialsFontSize(s.size, size === 'custom' ? null : resolveSizeName(size)),
              lineHeight: 1,
              textAlign: 'center',
              // Trim to cap height / baseline — Figma's "cap height to
              // baseline" — so the initials centre on their own letterforms.
              ...CAP_HEIGHT_TRIM,
            }}
            aria-hidden="true"
          >
            {initials.slice(0, 2).toUpperCase()}
          </TextComp>
        );
      })()}
      {/* The glyph fills the disc edge to edge in Buttons::Border. It sat in an
          Icon with no size of its own, so its 100% resolved against nothing
          and the SVG drew at the browser's default 300px. */}
      {glyphOnly && (
        <AvatarGlyph
          style={{
            /* Over the ring, not inside it: Figma's glyph is the full diameter
               and covers the 1px Border stroke, which is the same color. Inside
               the border box it drew at diameter − 2, inset by 1. */
            position: 'absolute',
            inset: 'calc(-1 * ' + BORDER_WIDTH + ')',
            width: 'calc(100% + 2 * ' + BORDER_WIDTH + ')',
            height: 'calc(100% + 2 * ' + BORDER_WIDTH + ')',
            display: 'block',
          }}
        />
      )}
    </Box>
  );
}

/**
 * A shaped avatar — the same three styles, cut to one of AVATAR_SHAPES, as the
 * Figma Avatar's Container=Shape draws them:
 *   Photo     the photo fills the shape
 *   Initials  the initials' button color fills it; the initials are smaller
 *             (about two-thirds) because a shape has less room than a circle
 *   Default   the shape filled in Buttons::Border, a person knocked out of it
 *             in the surface's --Background
 * Every one carries the button border (--Buttons-{C}-Border at
 * --Button-Border-Width), drawn as an outline over the shape so the mask never
 * clips it. The root is not masked, so a clickable avatar's focus ring is whole.
 */
function ShapedAvatar({ shape, s, size, C, component, isClickable, onClick, alt, initials, effectiveSrc,
  onImgError, hasInitials, insideButton, className, sx, ...props }) {
  const d = shapePath(shape);
  const edge = 'var(--Buttons-' + C + '-Border)';
  const fill = effectiveSrc ? 'transparent' : hasInitials ? 'var(--Buttons-' + C + '-Button)' : edge;
  return (
    <Box
      component={component}
      type={isClickable ? 'button' : undefined}
      role={isClickable ? 'button' : 'img'}
      aria-label={alt || initials || 'Avatar'}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onClick : undefined}
      className={'avatar avatar-shaped avatar-shape-' + shape + ' avatar-' + size +
        (effectiveSrc ? ' avatar-image' : hasInitials ? ' avatar-initials' : ' avatar-fallback') +
        (isClickable ? ' avatar-clickable' : '') + (className ? ' ' + className : '')}
      sx={{
        position: 'relative', display: 'inline-grid', placeItems: 'center', flexShrink: 0,
        width: s.size + 'px', height: s.size + 'px', boxSizing: 'border-box',
        p: 0, border: 'none', background: 'transparent', fontFamily: 'inherit',
        color: hasInitials ? 'var(--Buttons-' + C + '-Text)' : 'var(--Background)',
        ...(insideButton && { marginLeft: '2px', marginRight: '2px' }),
        ...(isClickable && {
          cursor: 'pointer', outline: 'none', borderRadius: 'var(--Button-Focus-Radius, 8px)',
          '&:hover .avatar-shape-fill::after': { backgroundColor: 'var(--Hover)' },
          '&:active .avatar-shape-fill::after': { backgroundColor: 'var(--Pressed)' },
          '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px' },
        }),
        ...sx,
      }}
      {...props}
    >
      <Box className="avatar-shape-fill" aria-hidden="true" sx={{
        position: 'absolute', inset: 0, backgroundColor: fill, ...shapeStyle(shape),
        /* Radius shapes keep a CSS border; path shapes get the outline below. */
        ...(d ? {} : { border: BORDER_WIDTH + ' solid ' + edge, boxSizing: 'border-box' }),
        '&::after': { content: '""', position: 'absolute', inset: 0 },
      }}>
        {effectiveSrc && (
          <Box component="img" src={effectiveSrc} alt="" referrerPolicy="no-referrer" onError={onImgError}
               sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
      </Box>
      {hasInitials && (() => {
        const TextComp = getInitialsComp(size);
        return (
          <TextComp aria-hidden="true" sx={{
            position: 'relative', color: 'inherit', lineHeight: 1, textAlign: 'center',
            fontSize: shapeInitialsFontSize(s.size, size === 'custom' ? null : resolveSizeName(size)),
            ...CAP_HEIGHT_TRIM,
          }}>
            {initials.slice(0, 2).toUpperCase()}
          </TextComp>
        );
      })()}
      {!effectiveSrc && !hasInitials && (
        <PersonIcon aria-hidden="true" sx={{ position: 'relative', width: '60%', height: '60%', color: 'inherit' }} />
      )}
      {d && (
        <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100" preserveAspectRatio="none"
             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
          <path d={d} fill="none" stroke={edge} strokeWidth={BORDER_WIDTH} vectorEffect="non-scaling-stroke" />
        </svg>
      )}
    </Box>
  );
}

/**
 * AvatarGroup — stacks avatars with overlap
 */
/* AvatarGroup lives in ../AvatarGroup — it composes Button, which imports
   Avatar, so it cannot sit in this file without a circular import. */

export default Avatar;
