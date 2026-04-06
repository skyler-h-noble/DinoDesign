// src/components/Autocomplete/Autocomplete.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { Icon } from '../Icon/Icon';
import { Body, BodySmall } from '../Typography';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Autocomplete Component
 *
 * VARIANTS:
 *   outline   Outer border shell + data-surface="Container"
 *   light     Outer border shell + data-theme="{C}-Light" data-surface="Surface-Dim"
 *
 * COLORS: default | primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * LABEL: top | floating | none
 * SIZES: small | medium | large (matches button heights)
 * ASYNC: loading prop shows spinner
 * FEATURES: clearable, freeSolo, disabled, helper text
 *
 * Focus: outline on outer shell via :focus-within
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SIZE_MAP = {
  small:  { height: 'var(--Small-Button-Height)', fontSize: '13px', padding: '4px 8px', iconSize: 16 },
  medium: { height: 'var(--Button-Height)',        fontSize: '14px', padding: '6px 12px', iconSize: 18 },
  large:  { height: 'var(--Large-Button-Height)',  fontSize: '16px', padding: '8px 16px', iconSize: 20 },
};

const FLOATING_SIZE_MAP = {
  small:  { height: '48px', fontSize: '13px', padding: '20px 12px 4px', leftPad: 12 },
  medium: { height: '56px', fontSize: '14px', padding: '22px 14px 6px', leftPad: 14 },
  large:  { height: '64px', fontSize: '16px', padding: '24px 16px 6px', leftPad: 16 },
};

function getOptionStyles(isHighlighted, isSelected) {
  if (isSelected) {
    return {
      backgroundColor: 'transparent',
      color: 'var(--Text)',
      fontWeight: 600,
    };
  }
  if (isHighlighted) {
    return { backgroundColor: 'var(--Hover)', color: 'var(--Text)' };
  }
  return { backgroundColor: 'transparent', color: 'var(--Text-Quiet)' };
}

export function Autocomplete({
  options = [],
  value: controlledValue,
  defaultValue = null,
  onChange,
  inputValue: controlledInputValue,
  onInputChange,
  label,
  labelPosition = 'top',
  placeholder = 'Type to search',
  helperText,
  size = 'medium',
  variant = 'outline',         // 'outline' | 'light'
  color = 'primary',           // 'default' | 'primary' | ...
  loading = false,
  loadingText = 'Loading\u2026',
  noOptionsText = 'No options',
  freeSolo = false,
  clearable = true,
  disabled = false,
  fullWidth = false,
  className = '',
  sx = {},
  ...props
}) {
  const effectiveColor = color === 'default' ? 'primary' : color;
  const C = cap(effectiveColor);
  const isLight = variant === 'light';
  const borderToken = 'var(--Buttons-' + C + '-Border)';
  const activeTextColor = color === 'default' ? 'var(--Text)' : 'var(--Text-' + C + ')';

  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalInput, setInternalInput] = useState(
    defaultValue ? (typeof defaultValue === 'string' ? defaultValue : defaultValue.label || '') : ''
  );
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const isControlledValue = controlledValue !== undefined;
  const isControlledInput = controlledInputValue !== undefined;
  const currentValue = isControlledValue ? controlledValue : internalValue;
  const currentInput = isControlledInput ? controlledInputValue : internalInput;

  const isFloating = labelPosition === 'floating';
  const isTop = labelPosition === 'top';
  const hasValue = currentInput !== '';
  const sizeConfig = isFloating
    ? (FLOATING_SIZE_MAP[size] || FLOATING_SIZE_MAP.medium)
    : (SIZE_MAP[size] || SIZE_MAP.medium);

  // Filter options
  const filtered = currentInput
    ? options.filter((opt) => {
        const lbl = typeof opt === 'string' ? opt : opt.label;
        return lbl.toLowerCase().includes(currentInput.toLowerCase());
      })
    : options;

  const setInput = useCallback((val) => {
    if (!isControlledInput) setInternalInput(val);
    onInputChange?.(val);
  }, [isControlledInput, onInputChange]);

  const selectOption = useCallback((opt) => {
    const lbl = typeof opt === 'string' ? opt : opt.label;
    if (!isControlledValue) setInternalValue(opt);
    setInput(lbl);
    onChange?.(opt);
    setOpen(false);
    setHighlightIndex(-1);
    inputRef.current?.focus();
  }, [isControlledValue, onChange, setInput]);

  const clearValue = () => {
    if (!isControlledValue) setInternalValue(null);
    setInput('');
    onChange?.(null);
    inputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!open) setOpen(true);
    setHighlightIndex(-1);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Keyboard
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      setHighlightIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    }
    if (e.key === 'Enter' && open && highlightIndex >= 0 && filtered[highlightIndex]) {
      e.preventDefault();
      selectOption(filtered[highlightIndex]);
    }
  };

  return (
    <Box
      ref={wrapperRef}
      className={'autocomplete autocomplete-' + size + ' autocomplete-variant-' + variant +
        (open ? ' autocomplete-open' : '') +
        (disabled ? ' autocomplete-disabled' : '') +
        (className ? ' ' + className : '')}
      sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto', display: 'inline-block', fontFamily: 'inherit', ...sx }}
      {...props}
    >
      {/* Top label */}
      {isTop && label && (() => {
        const LabelComp = size === 'small' ? BodySmall : Body;
        return (
          <LabelComp
            component="label"
            style={{
              display: 'block', marginBottom: '6px',
              color: disabled ? 'var(--Quiet)' : 'var(--Text)',
              fontWeight: 500,
              opacity: disabled ? 0.6 : 1,
            }}
          >
            {label}
          </LabelComp>
        );
      })()}

      {/* Outer border shell */}
      <Box sx={{
        border: '1px solid ' + borderToken,
        borderRadius: 'var(--Style-Border-Radius)',
        overflow: 'hidden',
        transition: 'border-color 0.15s ease',
        boxShadow: 'var(--Effect-Level-1)',
        '&:hover': { boxShadow: 'var(--Effect-Level-2)' },
        opacity: disabled ? 0.5 : 1,
        '&:focus-within': {
          outline: '2px solid var(--Focus-Visible)',
          outlineOffset: '2px',
        },
      }}>

      {/* Inner themed surface */}
      <Box
        {...(isLight ? { 'data-theme': C + '-Light', 'data-surface': 'Surface-Dim' } : { 'data-surface': 'Container' })}
      >

      {/* Input container */}
      <Box sx={{
        position: 'relative', display: 'flex', alignItems: 'center',
        minHeight: sizeConfig.height,
        backgroundColor: 'var(--Background)',
      }}>
        {/* Floating label */}
        {isFloating && label && (
          <Box sx={{
            position: 'absolute',
            top: hasValue || focused ? '6px' : '50%',
            left: (sizeConfig.leftPad || 14) + 'px',
            transform: hasValue || focused ? 'scale(0.75)' : 'translateY(-50%)',
            transformOrigin: 'top left',
            color: focused ? activeTextColor : 'var(--Quiet)',
            fontSize: sizeConfig.fontSize, fontWeight: 400,
            pointerEvents: 'none', zIndex: 1,
            transition: 'top 0.15s ease, transform 0.15s ease, color 0.15s ease',
          }}>
            {label}
          </Box>
        )}

        {/* Text input */}
        <Box
          component="input"
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-label={label || placeholder}
          autoComplete="off"
          value={currentInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { setFocused(true); setOpen(true); }}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder={isFloating ? undefined : placeholder}
          sx={{
            flex: 1, border: 'none', outline: 'none',
            backgroundColor: 'transparent',
            color: (hasValue || focused) ? activeTextColor : 'var(--Quiet)',
            fontSize: sizeConfig.fontSize,
            fontFamily: 'var(--Body-Font-Family)',
            fontWeight: 'var(--Body-Font-Weight)',
            padding: sizeConfig.padding,
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

        {/* Loading spinner */}
        {loading && open && (
          <CircularProgress size={16} sx={{ mr: 1, color: 'var(--Quiet)' }} />
        )}

        {/* Clear button */}
        {clearable && currentInput && !disabled && (
          <Box component="button" type="button" aria-label="Clear" onClick={clearValue}
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 20, height: 20, borderRadius: '50%', mr: 0.5,
              border: 'none', backgroundColor: 'transparent',
              color: 'var(--Quiet)', cursor: 'pointer',
              '&:hover': { color: 'var(--Text)', backgroundColor: 'var(--Hover)' },
              '&:focus-visible': { outline: '2px solid var(--Focus-Visible)' },
            }}>
            <CloseIcon sx={{ fontSize: 14 }} />
          </Box>
        )}

        {/* Chevron */}
        <Box component="button" type="button" aria-label={open ? 'Close' : 'Open'} tabIndex={-1}
          onClick={() => { if (!disabled) setOpen(!open); }}
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: '100%', border: 'none', backgroundColor: 'transparent',
            color: 'var(--Quiet)', cursor: disabled ? 'not-allowed' : 'pointer',
          }}>
          <ExpandMoreIcon sx={{
            fontSize: (sizeConfig.iconSize || 18) + 'px',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }} />
        </Box>
      </Box>

      </Box>{/* end inner themed surface */}
      </Box>{/* end outer border shell */}

      {/* Helper text */}
      {helperText && (
        <Box sx={{ fontSize: '12px', color: 'var(--Quiet)', mt: '4px', ml: '2px' }}>{helperText}</Box>
      )}

      {/* Dropdown */}
      {open && (
        <Box role="listbox" aria-label={label || 'Options'} sx={{
          position: 'absolute', top: '100%', left: 0, right: 0, mt: 0.5,
          backgroundColor: 'var(--Background)',
          border: '1px solid var(--Buttons-Default-Border)',
          borderRadius: 'var(--Style-Border-Radius)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          zIndex: 9999, maxHeight: 240, overflowY: 'auto', py: 0.5,
        }}>
          {loading ? (
            <Box sx={{ px: 1.5, py: 2, textAlign: 'center', fontSize: sizeConfig.fontSize, color: 'var(--Quiet)' }}>
              {loadingText}
            </Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ px: 1.5, py: 2, textAlign: 'center', fontSize: sizeConfig.fontSize, color: 'var(--Quiet)' }}>
              {noOptionsText}
            </Box>
          ) : (
            filtered.map((opt, idx) => {
              const optLabel = typeof opt === 'string' ? opt : opt.label;
              const optValue = typeof opt === 'string' ? opt : opt.value;
              const selectedLabel = currentValue ? (typeof currentValue === 'string' ? currentValue : currentValue.label) : null;
              const isSelected = optLabel === selectedLabel;
              const isHighlighted = idx === highlightIndex;
              const styles = getOptionStyles(isHighlighted, isSelected);

              return (
                <Box key={optValue || optLabel} role="option" aria-selected={isSelected}
                  onClick={() => selectOption(opt)}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    px: 1.5, py: 0, mx: 0.5, minHeight: sizeConfig.height,
                    borderRadius: '4px',
                    cursor: 'pointer', fontSize: sizeConfig.fontSize, fontFamily: 'inherit',
                    ...styles,
                    transition: 'background-color 0.1s ease',
                    '&:active': { backgroundColor: 'var(--Active)' },
                  }}>
                  <BodySmall style={{ flex: 1, color: 'inherit', fontWeight: 'inherit' }}>{optLabel}</BodySmall>
                  {isSelected && <Icon size="small" sx={{ opacity: 0.6, flexShrink: 0 }}><CheckIcon /></Icon>}
                </Box>
              );
            })
          )}
        </Box>
      )}
    </Box>
  );
}

export default Autocomplete;
