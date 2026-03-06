// src/components/ButtonIcon/ButtonIcon.js
import React from 'react';
import { IconButton as MuiIconButton, Box } from '@mui/material';

/**
 * ButtonIcon Component
 * Icon button with full interaction states and design system styling
 * Uses design system variables for theming
 * 
 * @param {ReactNode} children - Icon component (from @mui/icons-material)
 * @param {string} size - Size variant: small (32px), medium (40px), large (48px)
 * @param {string} color - Color variant: default, primary, secondary, tertiary, success, error, warning, info
 * @param {string} variant - Style variant: filled, outlined, text (default: text)
 * @param {boolean} disabled - Disabled state
 * @param {function} onClick - Click handler
 * @param {boolean} loading - Loading/spinning state
 * @param {object} sx - Additional MUI sx props
 * @param {object} ...props - Other MUI IconButton props
 */
export function ButtonIcon({
  children,
  size = 'medium',
  color = 'primary',
  variant = 'text',
  disabled = false,
  onClick,
  loading = false,
  sx = {},
  ...props
}) {
  // Color mapping for design system variants
  const colorMap = {
    primary: 'var(--Primary-Color-11)',
    secondary: 'var(--Secondary-Color-11)',
    tertiary: 'var(--Tertiary-Color-11)',
    success: 'var(--Success-Color-11)',
    error: 'var(--Error-Color-11)',
    warning: 'var(--Warning-Color-11)',
    info: 'var(--Info-Color-11)',
    neutral: 'var(--Text-Secondary)',
    default: 'var(--Text)',
  };

  // Size mapping for icon button
  const sizeMap = {
    small: {
      padding: '6px',
      '& .MuiSvgIcon-root': { fontSize: '18px' },
    },
    medium: {
      padding: '8px',
      '& .MuiSvgIcon-root': { fontSize: '24px' },
    },
    large: {
      padding: '12px',
      '& .MuiSvgIcon-root': { fontSize: '32px' },
    },
  };

  // Variant styling
  const getVariantStyles = () => {
    const buttonColor = colorMap[color] || colorMap.primary;
    
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: buttonColor,
          color: '#FFFFFF',
          '&:hover:not(:disabled)': {
            backgroundColor: buttonColor,
            opacity: 0.85,
          },
          '&:active:not(:disabled)': {
            opacity: 0.7,
            transform: 'scale(0.95)',
          },
        };
      
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: buttonColor,
          border: `2px solid ${buttonColor}`,
          '&:hover:not(:disabled)': {
            backgroundColor: `${buttonColor}15`,
          },
          '&:active:not(:disabled)': {
            backgroundColor: `${buttonColor}25`,
            transform: 'scale(0.95)',
          },
        };
      
      case 'text':
      default:
        return {
          backgroundColor: 'transparent',
          color: buttonColor,
          '&:hover:not(:disabled)': {
            backgroundColor: 'var(--Container-Low)',
          },
          '&:active:not(:disabled)': {
            backgroundColor: 'var(--Container)',
            transform: 'scale(0.95)',
          },
        };
    }
  };

  const buttonColor = colorMap[color] || colorMap.primary;

  return (
    <MuiIconButton
      disabled={disabled || loading}
      onClick={onClick}
      sx={{
        ...sizeMap[size],
        ...getVariantStyles(),
        borderRadius: 'var(--Style-Border-Radius)',
        transition: 'all 0.2s ease-in-out',
        
        // Focus state (keyboard/accessible)
        '&:focus-visible': {
          outline: `2px solid ${buttonColor}`,
          outlineOffset: '2px',
        },
        
        // Disabled state
        '&:disabled': {
          opacity: 0.5,
          cursor: 'not-allowed',
          color: 'var(--Text-Secondary)',
        },
        
        ...sx,
      }}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Box
          sx={{
            display: 'inline-block',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              from: { transform: 'rotate(0deg)' },
              to: { transform: 'rotate(360deg)' },
            },
          }}
        >
          {children}
        </Box>
      ) : (
        children
      )}
    </MuiIconButton>
  );
}

/**
 * IconButtonGroup Component
 * Display multiple icon buttons in a group
 * 
 * @param {Array} buttons - Array of {icon, label, onClick, ...props}
 * @param {string} size - Size variant
 * @param {string} color - Color variant
 * @param {object} props - Additional props
 */
export function IconButtonGroup({
  buttons = [],
  size = 'medium',
  color = 'primary',
  variant = 'text',
  ...props
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}
      {...props}
    >
      {buttons.map((button, index) => (
        <ButtonIcon
          key={index}
          size={size}
          color={button.color || color}
          variant={button.variant || variant}
          onClick={button.onClick}
          disabled={button.disabled}
          title={button.label}
          aria-label={button.label}
          {...button.props}
        >
          {button.icon}
        </ButtonIcon>
      ))}
    </Box>
  );
}

export default ButtonIcon;
