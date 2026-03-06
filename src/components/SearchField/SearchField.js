// src/components/SearchField/SearchField.js
import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

/**
 * SearchField Component
 *
 * STRUCTURE:
 *   <Box border="1px solid var(--Border)" borderRadius>       — border parent
 *     <Box data-surface="Container-Lowest">                   — surface scoping
 *       <SearchIcon />
 *       <input />
 *       <CloseIcon />  (when has value)
 *     </Box>
 *   </Box>
 *
 * STATES:
 *   Idle:    icon + placeholder = var(--Text-Quiet)
 *   Focused: icon + text = var(--Text)
 *   Filled:  icon + text = var(--Text), clear button visible
 *
 * SIZES:
 *   small   36px, 13px font
 *   medium  40px, 14px font (default)
 *   large   48px, 15px font
 *
 * Accessibility:
 *   role="searchbox", aria-label
 *   Clear: aria-label="Clear search"
 *   Escape clears, Enter submits
 */

const SIZE_MAP = {
  small:  { height: 36, fontSize: '13px', iconSize: 18, px: 12 },
  medium: { height: 40, fontSize: '14px', iconSize: 20, px: 16 },
  large:  { height: 48, fontSize: '15px', iconSize: 22, px: 16 },
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

  const quietColor = 'var(--Text-Quiet)';
  const activeColor = 'var(--Text)';
  const iconColor = isActive ? activeColor : quietColor;

  return (
    <Box
      className={'search-field search-field-' + size +
        (focused ? ' search-field-focused' : '') +
        (hasValue ? ' search-field-filled' : '') +
        (disabled ? ' search-field-disabled' : '') +
        (className ? ' ' + className : '')}
      sx={{
        display: 'inline-flex',
        border: '1px solid var(--Border)',
        borderRadius: s.height / 2 + 'px',
        overflow: 'hidden',
        opacity: disabled ? 0.5 : 1,
        transition: 'border-color 0.15s ease',
        ...(focused && { borderColor: 'var(--Focus-Visible)' }),
        ...sx,
      }}
      {...props}
    >
      <Box
        data-surface="Container-Lowest"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          width: '100%',
          height: s.height + 'px',
          px: s.px + 'px',
          backgroundColor: 'var(--Background)',
          borderRadius: 'inherit',
        }}
      >
        <SearchIcon
          sx={{
            fontSize: s.iconSize,
            color: iconColor,
            flexShrink: 0,
            transition: 'color 0.15s ease',
          }}
        />

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
            color: activeColor,
            fontSize: s.fontSize,
            fontFamily: 'inherit',
            minWidth: 0,
            '&::placeholder': {
              color: quietColor,
              opacity: 1,
            },
            '&:disabled': {
              cursor: 'not-allowed',
            },
          }}
        />

        {showClearButton && hasValue && !disabled && (
          <Box
            component="button"
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: s.iconSize + 4,
              height: s.iconSize + 4,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'transparent',
              color: quietColor,
              cursor: 'pointer',
              flexShrink: 0,
              padding: 0,
              transition: 'color 0.15s ease, background-color 0.15s ease',
              '&:hover': {
                backgroundColor: 'var(--Hover, rgba(0,0,0,0.06))',
                color: activeColor,
              },
              '&:focus-visible': {
                outline: '2px solid var(--Focus-Visible)',
                outlineOffset: '1px',
              },
            }}
          >
            <CloseIcon sx={{ fontSize: s.iconSize - 2 }} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default SearchField;
