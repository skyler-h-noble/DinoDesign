// src/components/Avatar/Avatar.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Icon } from '../Icon/Icon';
import { NumberSmall, NumberMedium, NumberLarge, CAP_HEIGHT_TRIM } from '../Typography';
import { DEFAULT_AVATAR_SRC } from './defaultAvatar';

/**
 * Avatar Component
 *
 * CONTENT (priority): real src → initials → explicit icon → DEFAULT PHOTO.
 *   The default avatar IS the photo: a bare <Avatar /> shows the built-in photo.
 *   The three Figma variants map to: bare <Avatar /> (photo), initials="…"
 *   (initials), icon={…} (icon). defaultPhoto={false} restores the Person-icon
 *   fallback for a bare avatar.
 *
 * SIZES (Figma-aligned):
 *   xxx-small  16   |  xx-small  24   |  x-small   32   |  small  40
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
const SIZE_MAP = {
  'xxx-small': { size: 16,  iconSize: 10 },
  'xx-small':  { size: 24,  iconSize: 14 },
  'x-small':   { size: 32,  iconSize: 18 },
  small:       { size: 40,  iconSize: 22 },
  medium:      { size: 56,  iconSize: 28 },
  large:       { size: 64,  iconSize: 32 },
  'x-large':   { size: 80,  iconSize: 40 },
  'xx-large':  { size: 160, iconSize: 80 },
};

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
    case 'xxx-small':
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
const initialsFontSize = (diameter) => Math.round((diameter * 7) / 12) + 'px';

// The design draws the avatar ring at 1px — the same hairline the system uses
// for a button's border, so it tracks --Button-Border-Width rather than being
// pinned. (That token is 1px and load-bearing for the Figma button heights; it
// is only READ here.)
const BORDER_WIDTH = 'var(--Button-Border-Width, 1px)';

export function Avatar({
  src,
  // The DEFAULT avatar IS the photo: a bare <Avatar /> shows the lib's built-in
  // photo. `src` (a real URL) always wins; `initials` or an explicit `icon`
  // override the photo (those are the other two variants). Pass
  // defaultPhoto={false} to suppress the photo and fall back to the Person icon.
  defaultPhoto = true,
  alt,
  initials,
  icon,
  color = 'default',
  // Default size is x-small (XS, 32px) per the design spec's default avatar.
  size = 'x-small',
  customSize,
  clickable = false,
  onClick,
  // When true, adds 2px horizontal margin so an Avatar inside a Button has
  // breathing room without needing a wrapping spacer.
  insideButton = false,
  className = '',
  sx = {},
  ...props
}) {
  const [imgError, setImgError] = useState(false);
  // Custom size — pixel diameter from `customSize` prop, icon ~50% of that.
  const s = size === 'custom' && customSize
    ? { size: customSize, iconSize: Math.round(customSize * 0.5) }
    : (SIZE_MAP[size] || SIZE_MAP.medium);
  const C = COLOR_MAP[color] || COLOR_MAP.default;

  // Photo source: an explicit src wins; otherwise the built-in default photo —
  // but only when there's no initials and no explicit icon, so those two
  // variants still take precedence over the default photo.
  const effectiveSrc = src || (defaultPhoto && !initials && !icon ? DEFAULT_AVATAR_SRC : undefined);
  const hasSrc = effectiveSrc && !imgError;
  const hasInitials = !hasSrc && initials;
  const isFallback = !hasSrc && !hasInitials;
  const isClickable = clickable || !!onClick;

  const bg = hasSrc ? 'transparent' : 'var(--Buttons-' + C + '-Button)';
  const borderColor = 'var(--Buttons-' + C + '-Border)';
  const textColor = 'var(--Buttons-' + C + '-Text)';

  const component = isClickable ? 'button' : 'div';

  return (
    <Box
      component={component}
      type={isClickable ? 'button' : undefined}
      role={isClickable ? 'button' : 'img'}
      aria-label={alt || initials || 'Avatar'}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onClick : undefined}
      className={'avatar avatar-' + size + ' avatar-' + color +
        (isClickable ? ' avatar-clickable' : '') +
        (hasSrc ? ' avatar-image' : hasInitials ? ' avatar-initials' : ' avatar-fallback') +
        (className ? ' ' + className : '')}
      sx={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: s.size + 'px', height: s.size + 'px',
        borderRadius: '50%',
        backgroundColor: bg,
        color: textColor,
        fontFamily: 'inherit', fontWeight: 600,
        overflow: 'hidden',
        flexShrink: 0,
        // Border per variant, from the design's three Avatar styles:
        //   Photo    → 1px ring in the SURFACE border. A photo has no palette
        //              (the image is the visual), so it takes --Border rather
        //              than the colour prop's button border.
        //   Initials → 1px ring in the palette's button border. At `default`
        //              these two resolve to the same value; they diverge once
        //              a colour prop is set, which is the generalisation the
        //              design's single default-coloured instance implies.
        //   Icon     → NO ring. The design's Default style is a filled glyph.
        // This used to be exactly inverted: no ring on the photo, a 2px ring on
        // the other two.
        border: hasSrc
          ? BORDER_WIDTH + ' solid var(--Border)'
          : hasInitials
            ? BORDER_WIDTH + ' solid ' + borderColor
            : 'none',
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
              fontSize: initialsFontSize(s.size),
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
      {isFallback && (
        <Icon size={size} sx={{ color: 'inherit' }}>
          {icon || <PersonIcon />}
        </Icon>
      )}
    </Box>
  );
}

/**
 * AvatarGroup — stacks avatars with overlap
 */
export function AvatarGroup({
  children,
  max = 5,
  size = 'medium',
  spacing = -8,
  className = '',
  sx = {},
  ...props
}) {
  const childArray = React.Children.toArray(children);
  const visible = childArray.slice(0, max);
  const overflow = childArray.length - max;

  return (
    <Box
      role="group"
      aria-label={'Avatar group, ' + childArray.length + ' avatars'}
      className={'avatar-group ' + className}
      sx={{
        display: 'inline-flex', alignItems: 'center',
        '& > *:not(:first-of-type)': { marginLeft: spacing + 'px' },
        ...sx,
      }}
      {...props}
    >
      {visible}
      {overflow > 0 && (
        <Avatar
          initials={'+' + overflow}
          size={size}
          color="neutral"
          sx={{ border: '2px solid var(--Background)', zIndex: 0 }}
        />
      )}
    </Box>
  );
}

export default Avatar;
