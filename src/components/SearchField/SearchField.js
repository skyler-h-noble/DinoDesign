// src/components/SearchField/SearchField.js
import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { Icon } from '../Icon/Icon';

/**
 * SearchField Component
 *
 * STRUCTURE:
 *   <Box border="1px solid var(--Buttons-{C}-Border)">   — outer border shell
 *     <Box data-surface="Container">                      — surface scoping
 *       <Icon><SearchIcon /></Icon>
 *       <input />
 *       <Icon><CloseIcon /></Icon>  (when has value)
 *     </Box>
 *   </Box>
 *
 * COLORS: default | primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * SIZES: small | medium | large (matches button heights)
 *
 * Accessibility:
 *   role="searchbox", aria-label
 *   Clear: aria-label="Clear search"
 *   Escape clears, Enter submits
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SIZE_MAP = {
  small:  { height: 'var(--Small-Button-Height)', fontSize: '13px', iconSize: 18, px: 12 },
  medium: { height: 'var(--Button-Height)',        fontSize: '14px', iconSize: 20, px: 16 },
  large:  { height: 'var(--Large-Button-Height)',  fontSize: '15px', iconSize: 22, px: 16 },
};

export function SearchField({
  value: controlledValue,
  defaultValue = '',
  onChange,
  onFocus,
  onBlur,
  onClear,
  onSubmit,
  placeholder = 'Search\u2026',
  size = 'medium',
  color = 'default',
  showClearButton = true,
  disabled = false,
  ariaLabel = 'Search',
  className = '',
  sx = {},
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  const hasValue = currentValue.length > 0;
  const isActive = focused || hasValue;

  const effectiveColor = color === 'default' ? 'primary' : color;
  const C = cap(effectiveColor);
  const borderToken = 'var(--Buttons-' + C + '-Border)';
  const activeTextColor = color === 'default' ? 'var(--Text)' : 'var(--Text-' + C + ')';

  const s = SIZE_MAP[size] || SIZE_MAP.medium;

  const handleChange = (e) => {
    const val = e.target.value;
    if (!isControlled) setInternalValue(val);
    onChange?.(val, e);
  };

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue('');
    onChange?.('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSubmit?.(currentValue, e);
    if (e.key === 'Escape' && hasValue) handleClear();
  };

  return (
    <Box
      className={'search-field search-field-' + size +
        (focused ? ' search-field-focused' : '') +
        (hasValue ? ' search-field-filled' : '') +
        (disabled ? ' search-field-disabled' : '') +
        (className ? ' ' + className : '')}
      sx={{
        display: 'inline-flex',
        ...sx,
      }}
      {...props}
    >
      {/* Outer border shell */}
      <Box sx={{
        border: '1px solid ' + borderToken,
        borderRadius: 'var(--Style-Border-Radius)',
        overflow: 'hidden',
        opacity: disabled ? 0.5 : 1,
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        boxShadow: 'var(--Effect-Level-1)',
        '&:hover': { boxShadow: 'var(--Effect-Level-2)' },
        width: '100%',
        '&:focus-within': {
          outline: '2px solid var(--Focus-Visible)',
          outlineOffset: '2px',
        },
      }}>

      {/* Inner surface */}
      <Box
        data-surface="Container"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          width: '100%',
          minHeight: s.height,
          px: s.px + 'px',
          backgroundColor: 'var(--Background)',
        }}
      >
        <Icon size="small" sx={{ color: isActive ? activeTextColor : 'var(--Quiet)', flexShrink: 0, transition: 'color 0.15s ease' }}>
          <SearchIcon />
        </Icon>

        <Box
          component="input"
          ref={inputRef}
          type="text"
          role="searchbox"
          aria-label={ariaLabel}
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          sx={{
            flex: 1,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            color: isActive ? activeTextColor : 'var(--Quiet)',
            fontSize: s.fontSize,
            fontFamily: 'var(--Body-Font-Family)',
            fontWeight: 'var(--Body-Font-Weight)',
            minWidth: 0,
            '&::placeholder': {
              color: 'var(--Quiet)',
              opacity: 1,
              fontFamily: 'var(--Body-Font-Family)',
              fontWeight: 'var(--Body-Font-Weight)',
            },
            '&:disabled': { cursor: 'not-allowed' },
          }}
        />

        {showClearButton && hasValue && !disabled && (
          <Box
            component="button"
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: s.iconSize + 4, height: s.iconSize + 4,
              borderRadius: '50%', border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--Quiet)', cursor: 'pointer', flexShrink: 0, padding: 0,
              transition: 'color 0.15s ease, background-color 0.15s ease',
              '&:hover': { backgroundColor: 'var(--Hover)', color: activeTextColor },
              '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '1px' },
            }}
          >
            <Icon size="small"><CloseIcon /></Icon>
          </Box>
        )}
      </Box>

      </Box>{/* end outer border shell */}
    </Box>
  );
}

export default SearchField;
