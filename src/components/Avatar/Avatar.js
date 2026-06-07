// src/components/Avatar/Avatar.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Icon } from '../Icon/Icon';
import { ButtonExtraSmall, ButtonSmall, Button as ButtonTypography, BodyLarge, H4 } from '../Typography';

/**
 * Avatar Component
 *
 * CONTENT PRIORITY: image → initials → fallback (Person icon)
 *
 * SIZES: small (32px), medium (40px), large (56px)
 *
 * COLORS: default, primary, secondary, tertiary, neutral, info, success, warning, error
 *   Background: var(--Buttons-{C}-Border)
 *   Text/Icon:  var(--Buttons-{C}-Text)
 *
 * CLICKABLE:
 *   Border:  var(--Buttons-Default-Border)
 *   Hover:   var(--Buttons-Default-Hover)
 *   Active:  var(--Buttons-Default-Active)
 *   Focus:   var(--Focus-Visible)
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const COLOR_MAP = {
  default: 'Default',
  primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral',
  info: 'Info', success: 'Success', warning: 'Warning', error: 'Error',
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

// Typography choice per size — bigger avatars get bigger initials.
function getInitialsComponent(size) {
  if (size === 'xxx-small' || size === 'xx-small')       return ButtonExtraSmall;
  if (size === 'x-small'   || size === 'small')          return ButtonSmall;
  if (size === 'medium'    || size === 'large')          return ButtonTypography;
  if (size === 'x-large')                                return BodyLarge;
  if (size === 'xx-large')                               return H4;
  return ButtonTypography; // sensible default for 'custom' or unknown
}

export function Avatar({
  src,
  alt,
  initials,
  icon,
  color = 'default',
  size = 'medium',
  customSize,
  clickable = false,
  onClick,
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

  const hasSrc = src && !imgError;
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
        border: '2px solid ' + borderColor,
        // Button reset
        ...(isClickable && {
          cursor: 'pointer',
          outline: 'none',
          padding: 0,
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
          '&:hover': { backgroundColor: hasSrc ? 'rgba(0,0,0,0.08)' : 'var(--Buttons-Default-Hover)' },
          '&:active': { backgroundColor: hasSrc ? 'rgba(0,0,0,0.15)' : 'var(--Buttons-Default-Active)' },
          '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px' },
        }),
        ...sx,
      }}
      {...props}
    >
      {hasSrc && (
        <Box
          component="img"
          src={src}
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
        const TextComp = getInitialsComponent(size);
        return (
          <TextComp
            style={{
              color: 'inherit',
              fontWeight: 600,
              lineHeight: 1,
              textAlign: 'center',
              // Tiny top-pad optically centers caps inside the circle since
              // cap-height sits slightly above the geometric center.
              paddingTop: '2px',
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
