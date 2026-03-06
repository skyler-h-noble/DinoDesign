// src/components/Autocomplete/Autocomplete.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Autocomplete Component
 *
 * STYLES:
 *   default   No theme. border inherit, active var(--Buttons-Default-Border)
 *   light     Selected: bg var(--Buttons-Default-Light-Button), text var(--Buttons-Default-Light-Text)
 *   solid     Selected: bg var(--Buttons-Default-Button), text var(--Buttons-Default-Text)
 *
 * LABEL: top | floating | none
 * SIZES: small (32/48px), medium (40/56px), large (56/64px)
 * ASYNC: loading prop shows spinner, loadingText displayed
 * FEATURES: clearable, freeSolo, disabled, helper text
 *
 * Surface: data-surface="Container-Lowest"
 * Dropdown: z-index 9999
 */

const SIZE_MAP = {
  small:  { height: 32, fontSize: '13px', padding: '4px 8px', iconSize: 16 },
  medium: { height: 40, fontSize: '14px', padding: '6px 12px', iconSize: 18 },
  large:  { height: 56, fontSize: '16px', padding: '8px 16px', iconSize: 20 },
};

const FLOATING_SIZE_MAP = {
  small:  { height: 48, fontSize: '13px', padding: '20px 12px 4px', leftPad: 12 },
  medium: { height: 56, fontSize: '14px', padding: '22px 14px 6px', leftPad: 14 },
  large:  { height: 64, fontSize: '16px', padding: '24px 16px 6px', leftPad: 16 },
};

function getOptionStyles(style, isHighlighted, isSelected) {
  if (isSelected) {
    if (style === 'solid') {
      return {
        backgroundColor: 'var(--Buttons-Default-Button)',
        color: 'var(--Buttons-Default-Text)',
        fontWeight: 600,
      };
    }
    if (style === 'light') {
      return {
        backgroundColor: 'var(--Buttons-Default-Light-Button)',
        color: 'var(--Buttons-Default-Light-Text)',
        fontWeight: 600,
      };
    }
    return {
      backgroundColor: 'transparent',
      color: 'var(--Text)',
      fontWeight: 600,
      border: '1px solid var(--Buttons-Default-Border)',
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
  style: selectionStyle = 'default',
  loading = false,
  loadingText = 'Loading…',
  noOptionsText = 'No options',
  freeSolo = false,
  clearable = true,
  disabled = false,
  fullWidth = false,
  className = '',
  sx = {},
  ...props
}) {
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
        const label = typeof opt === 'string' ? opt : opt.label;
        return label.toLowerCase().includes(currentInput.toLowerCase());
      })
    : options;

  const setInput = useCallback((val) => {
    if (!isControlledInput) setInternalInput(val);
    onInputChange?.(val);
  }, [isControlledInput, onInputChange]);

  const selectOption = useCallback((opt) => {
    const val = opt;
    const label = typeof opt === 'string' ? opt : opt.label;
    if (!isControlledValue) setInternalValue(val);
    setInput(label);
    onChange?.(val);
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

  const borderColor = (open || focused) ? 'var(--Buttons-Default-Border)' : 'inherit';

  return (
    <Box
      ref={wrapperRef}
      data-surface="Container-Lowest"
      className={'autocomplete autocomplete-' + size + ' autocomplete-label-' + labelPosition + ' autocomplete-style-' + selectionStyle +
        (open ? ' autocomplete-open' : '') +
        (disabled ? ' autocomplete-disabled' : '') +
        (className ? ' ' + className : '')}
      sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto', display: 'inline-block', fontFamily: 'inherit', ...sx }}
      {...props}
    >
      {/* Top label */}
      {isTop && label && (
        <Box sx={{ display: 'block', marginBottom: '6px', color: disabled ? 'var(--Text-Quiet)' : 'var(--Text)', fontSize: sizeConfig.fontSize, fontWeight: 500, opacity: disabled ? 0.6 : 1 }}>
          {label}
        </Box>
      )}

      {/* Input container */}
      <Box sx={{
        position: 'relative', display: 'flex', alignItems: 'center',
        height: sizeConfig.height + 'px',
        border: '1px solid ' + borderColor,
        borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: 'var(--Background)',
        transition: 'border-color 0.15s ease',
        opacity: disabled ? 0.5 : 1,
        '&:focus-within': { borderColor: 'var(--Buttons-Default-Border)' },
      }}>
        {/* Floating label */}
        {isFloating && label && (
          <Box sx={{
            position: 'absolute',
            top: hasValue || focused ? '6px' : '50%',
            left: (sizeConfig.leftPad || 14) + 'px',
            transform: hasValue || focused ? 'scale(0.75)' : 'translateY(-50%)',
            transformOrigin: 'top left',
            color: focused ? 'var(--Hotlink)' : 'var(--Text-Quiet)',
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
            color: 'var(--Text)', fontSize: sizeConfig.fontSize,
            fontFamily: 'inherit',
            padding: sizeConfig.padding,
            minWidth: 0,
            '&::placeholder': { color: 'var(--Text-Quiet)', opacity: 1 },
            '&:disabled': { cursor: 'not-allowed' },
          }}
        />

        {/* Loading spinner */}
        {loading && open && (
          <CircularProgress size={16} sx={{ mr: 1, color: 'var(--Text-Quiet)' }} />
        )}

        {/* Clear button */}
        {clearable && currentInput && !disabled && (
          <Box component="button" type="button" aria-label="Clear" onClick={clearValue}
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 20, height: 20, borderRadius: '50%', mr: 0.5,
              border: 'none', backgroundColor: 'transparent',
              color: 'var(--Text-Quiet)', cursor: 'pointer',
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
            color: 'var(--Text-Quiet)', cursor: disabled ? 'not-allowed' : 'pointer',
          }}>
          <ExpandMoreIcon sx={{
            fontSize: (sizeConfig.iconSize || 18) + 'px',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }} />
        </Box>
      </Box>

      {/* Helper text */}
      {helperText && (
        <Box sx={{ fontSize: '12px', color: 'var(--Text-Quiet)', mt: '4px', ml: '2px' }}>{helperText}</Box>
      )}

      {/* Dropdown */}
      {open && (
        <Box role="listbox" aria-label={label || 'Options'} sx={{
          position: 'absolute', top: '100%', left: 0, right: 0, mt: 0.5,
          backgroundColor: 'var(--Background)', border: '1px solid var(--Border)',
          borderRadius: 'var(--Style-Border-Radius)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          zIndex: 9999, maxHeight: 240, overflowY: 'auto', py: 0.5,
        }}>
          {loading ? (
            <Box sx={{ px: 1.5, py: 2, textAlign: 'center', fontSize: sizeConfig.fontSize, color: 'var(--Text-Quiet)' }}>
              {loadingText}
            </Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ px: 1.5, py: 2, textAlign: 'center', fontSize: sizeConfig.fontSize, color: 'var(--Text-Quiet)' }}>
              {noOptionsText}
            </Box>
          ) : (
            filtered.map((opt, idx) => {
              const optLabel = typeof opt === 'string' ? opt : opt.label;
              const optValue = typeof opt === 'string' ? opt : opt.value;
              const selectedLabel = currentValue ? (typeof currentValue === 'string' ? currentValue : currentValue.label) : null;
              const isSelected = optLabel === selectedLabel;
              const isHighlighted = idx === highlightIndex;
              const styles = getOptionStyles(selectionStyle, isHighlighted, isSelected);

              return (
                <Box key={optValue || optLabel} role="option" aria-selected={isSelected}
                  onClick={() => selectOption(opt)}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    px: 1.5, py: 1, mx: 0.5, borderRadius: '4px',
                    cursor: 'pointer', fontSize: sizeConfig.fontSize, fontFamily: 'inherit',
                    border: '1px solid transparent',
                    ...styles,
                    transition: 'background-color 0.1s ease',
                    '&:active': { backgroundColor: 'var(--Active)' },
                  }}>
                  <Box sx={{ flex: 1 }}>{optLabel}</Box>
                  {isSelected && <Box sx={{ fontSize: '14px', opacity: 0.6, flexShrink: 0 }}>✓</Box>}
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
