// src/components/Avatar/Avatar.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

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

const SIZE_MAP = {
  small:  { size: 32, fontSize: '13px', iconSize: 18 },
  medium: { size: 40, fontSize: '15px', iconSize: 22 },
  large:  { size: 56, fontSize: '20px', iconSize: 28 },
};

export function Avatar({
  src,
  alt,
  initials,
  color = 'default',
  size = 'medium',
  clickable = false,
  onClick,
  className = '',
  sx = {},
  ...props
}) {
  const [imgError, setImgError] = useState(false);
  const s = SIZE_MAP[size] || SIZE_MAP.medium;
  const C = COLOR_MAP[color] || COLOR_MAP.default;

  const hasSrc = src && !imgError;
  const hasInitials = !hasSrc && initials;
  const isFallback = !hasSrc && !hasInitials;
  const isClickable = clickable || !!onClick;

  const bg = hasSrc ? 'transparent' : 'var(--Buttons-' + C + '-Border)';
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
        fontSize: s.fontSize,
        fontFamily: 'inherit', fontWeight: 600,
        overflow: 'hidden',
        flexShrink: 0,
        // Button reset
        ...(isClickable && {
          border: '2px solid var(--Buttons-Default-Border)',
          cursor: 'pointer',
          outline: 'none',
          padding: 0,
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
          '&:hover': { backgroundColor: hasSrc ? 'rgba(0,0,0,0.08)' : 'var(--Buttons-Default-Hover)' },
          '&:active': { backgroundColor: hasSrc ? 'rgba(0,0,0,0.15)' : 'var(--Buttons-Default-Active)' },
          '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px' },
        }),
        ...(!isClickable && {
          border: 'none',
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
      {hasInitials && (
        <Box component="span" aria-hidden="true">
          {initials.slice(0, 2).toUpperCase()}
        </Box>
      )}
      {isFallback && (
        <PersonIcon sx={{ fontSize: s.iconSize + 'px' }} aria-hidden="true" />
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
