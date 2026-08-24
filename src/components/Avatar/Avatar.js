// src/components/Avatar/Avatar.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Icon } from '../Icon/Icon';
import { Eyebrow, EyebrowSmall, EyebrowLarge, CAP_HEIGHT_TRIM } from '../Typography';
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

// Initials wear the EYEBROW style — same face, weight and tracking as an
// eyebrow label. Which of the three eyebrow steps a size gets decides its
// weight and tracking only; the size itself comes from INITIALS_FONT_SIZE
// below, because an avatar ramp is eight steps wide and the eyebrow ramp is
// three.
//
// `token` is the step's own token name, needed to cancel its tracking (see the
// render): letter-spacing adds space AFTER the last letter too, which shifts
// centred initials left by half the tracking.
function getInitialsStyle(size) {
  switch (size) {
    case 'xxx-small':
    case 'xx-small':
    case 'x-small':   return { Comp: EyebrowSmall, token: 'Overline-Small' };
    case 'small':
    case 'medium':
    case 'large':     return { Comp: Eyebrow,      token: 'Overline-Medium' };
    case 'x-large':
    case 'xx-large':  return { Comp: EyebrowLarge, token: 'Overline-Large' };
    default:          return { Comp: Eyebrow,      token: 'Overline-Medium' };
  }
}

// Size per avatar step. These are the sizes the initials already rendered at —
// the eyebrow switch changes the face, not the scale. Every value but the
// smallest is a token; nothing in the type ramp goes down to 7px.
const INITIALS_FONT_SIZE = {
  'xxx-small': '7px',
  'xx-small':  'var(--Legal-Font-Size)',
  'x-small':   'var(--Number-Small-Font-Size)',
  'small':     'var(--Number-Small-Font-Size)',
  'medium':    'var(--Number-Medium-Font-Size)',
  'large':     'var(--Number-Medium-Font-Size)',
  'x-large':   'var(--Number-Large-Font-Size)',
  'xx-large':  'var(--Number-Large-Font-Size)',
};

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
        // Photo variant has NO border — the image is the visual. Initials/icon
        // variants keep the 2px themed border for a visible boundary.
        border: hasSrc ? 'none' : '2px solid ' + borderColor,
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
        const { Comp: TextComp, token } = getInitialsStyle(size);
        return (
          <TextComp
            sx={{
              color: 'inherit',
              // No fontWeight override — the eyebrow step carries its own.
              fontSize: INITIALS_FONT_SIZE[size] || INITIALS_FONT_SIZE.medium,
              lineHeight: 1,
              textAlign: 'center',
              // Cancel the trailing half of the eyebrow's tracking. Without
              // this the initials sit visibly left of centre in the circle.
              marginInlineEnd: `calc(-1 * var(--${token}-Letter-Spacing, 0px))`,
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
