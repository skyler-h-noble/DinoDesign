// src/components/Select/Select.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * Select Component
 *
 * MODES: standard (text), color (swatches)
 * LABEL: top | floating | none
 * SIZES: small (32/48px), medium (40/56px), large (56/64px)
 * SELECTION STYLE: default | light | solid
 * DIVIDERS: optional divider between each option
 * COLOR LABELS: show/hide text labels next to color swatches (aria-label always present)
 * START DECORATION: icon or avatar
 *
 * Dropdown renders via React portal so it escapes parent overflow:hidden.
 * Smart positioning: opens downward if space allows, upward otherwise.
 */

const SIZE_MAP = {
  small:  { height: 32, fontSize: '13px', padding: '4px 8px', iconSize: 16 },
  medium: { height: 40, fontSize: '14px', padding: '6px 12px', iconSize: 18 },
  large:  { height: 56, fontSize: '16px', padding: '8px 16px', iconSize: 20 },
};

const FLOATING_SIZE_MAP = {
  small:  { height: 48, fontSize: '13px', padding: '20px 12px 4px', labelSize: '11px', leftPad: 12 },
  medium: { height: 56, fontSize: '14px', padding: '22px 14px 6px', labelSize: '12px', leftPad: 14 },
  large:  { height: 64, fontSize: '16px', padding: '24px 16px 6px', labelSize: '14px', leftPad: 16 },
};

const DROPDOWN_MAX_HEIGHT = 240;

function getSelectedStyles(selectionStyle, isSelected) {
  if (!isSelected) {
    return {
      color: 'var(--Text-Quiet)',
      backgroundColor: 'transparent',
      border: '1px solid transparent',
    };
  }
  if (selectionStyle === 'solid') {
    return {
      backgroundColor: 'var(--Buttons-Default-Button)',
      color: 'var(--Buttons-Default-Text)',
      border: '1px solid var(--Buttons-Default-Border)',
      fontWeight: 600,
    };
  }
  if (selectionStyle === 'light') {
    return {
      backgroundColor: 'var(--Buttons-Default-Light-Button)',
      color: 'var(--Buttons-Default-Light-Text)',
      border: '1px solid var(--Buttons-Default-Light-Border)',
      fontWeight: 600,
    };
  }
  return {
    color: 'var(--Text)',
    backgroundColor: 'transparent',
    border: '1px solid var(--Buttons-Default-Border)',
    fontWeight: 600,
  };
}

export function Select({
  options = [],
  value: controlledValue,
  defaultValue = '',
  onChange,
  label,
  labelPosition = 'top',
  size = 'medium',
  selectionStyle = 'default',
  mode = 'standard',
  placeholder = 'Select\u2026',
  showDividers = false,
  showColorLabels = true,
  startDecoration,
  disabled = false,
  fullWidth = false,
  className = '',
  sx = {},
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 0,
    direction: 'down',
  });

  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const [parentTheme, setParentTheme] = useState(null);
  const [parentSurface, setParentSurface] = useState(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  const selectedOption = options.find((o) => (typeof o === 'string' ? o : o.value) === currentValue);
  const selectedLabel = selectedOption ? (typeof selectedOption === 'string' ? selectedOption : selectedOption.label) : '';
  const hasValue = currentValue !== '' && currentValue != null;

  const isFloating = labelPosition === 'floating';
  const isTop = labelPosition === 'top';
  const isColor = mode === 'color';
  const sizeConfig = isFloating
    ? (FLOATING_SIZE_MAP[size] || FLOATING_SIZE_MAP.medium)
    : (SIZE_MAP[size] || SIZE_MAP.medium);

  const handleSelect = useCallback((val) => {
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
    setOpen(false);
    triggerRef.current?.focus();
  }, [isControlled, onChange]);

  // Compute position for the dropdown — must be defined before toggleOpen
  const getDropdownPos = useCallback(() => {
    if (!triggerRef.current) return { top: 0, left: 0, width: 0 };
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const direction = spaceBelow >= DROPDOWN_MAX_HEIGHT || spaceBelow >= spaceAbove ? 'down' : 'up';
    return {
      top: direction === 'down' ? rect.bottom + 4 : undefined,
      bottom: direction === 'up' ? (window.innerHeight - rect.top + 4) : undefined,
      left: rect.left,
      width: rect.width,
      direction,
    };
  }, []);

  const toggleOpen = useCallback(() => {
    if (disabled) return;
    setOpen((prev) => {
      if (!prev) {
        setDropdownPos(getDropdownPos());
      }
      return !prev;
    });
  }, [disabled, getDropdownPos]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        wrapperRef.current && !wrapperRef.current.contains(e.target) &&
        !e.target.closest('[data-select-dropdown]')
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Capture parent theme/surface and reposition on scroll/resize
  useEffect(() => {
    if (!open || !triggerRef.current) return;

    // Capture closest data-theme and data-surface from the trigger's ancestors
    const themeEl = triggerRef.current.closest('[data-theme]');
    const surfaceEl = triggerRef.current.closest('[data-surface]');
    setParentTheme(themeEl?.getAttribute('data-theme') || null);
    setParentSurface(surfaceEl?.getAttribute('data-surface') || null);

    // Force re-render on scroll/resize to update position
    const forceUpdate = () => setDropdownPos(getDropdownPos());
    window.addEventListener('scroll', forceUpdate, true);
    window.addEventListener('resize', forceUpdate);
    return () => {
      window.removeEventListener('scroll', forceUpdate, true);
      window.removeEventListener('resize', forceUpdate);
    };
  }, [open, getDropdownPos]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleOpen(); return; }
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); setOpen(true); }
  };

  const borderColor = (open || focused) ? 'var(--Buttons-Default-Border)' : 'inherit';

  // The dropdown rendered into document.body via portal
  const dropdown = open ? ReactDOM.createPortal(
    <Box
      data-select-dropdown
      data-theme={parentTheme || undefined}
      data-surface={parentSurface || undefined}
      role="listbox"
      aria-label={label || 'Options'}
      sx={{
        position: 'fixed',
        top: dropdownPos.top ?? 'unset',
        bottom: dropdownPos.bottom ?? 'unset',
        left: dropdownPos.left,
        width: dropdownPos.width + 'px',
        backgroundColor: 'var(--Background)',
        border: '1px solid var(--Buttons-Default-Border)',
        borderRadius: 'var(--Style-Border-Radius)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        zIndex: 99999,
        maxHeight: DROPDOWN_MAX_HEIGHT + 'px',
        overflowY: 'auto',
        py: 0.5,
      }}
    >
      {options.map((opt, idx) => {
        const optValue = typeof opt === 'string' ? opt : opt.value;
        const optLabel = typeof opt === 'string' ? opt : opt.label;
        const optColor = typeof opt === 'object' ? opt.color : null;
        const isSelected = optValue === currentValue;
        const styles = getSelectedStyles(selectionStyle, isSelected);
        const isLast = idx === options.length - 1;

        return (
          <React.Fragment key={optValue}>
            <Box
              role="option"
              aria-selected={isSelected}
              aria-label={isColor && !showColorLabels ? optLabel : undefined}
              onClick={() => handleSelect(optValue)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                px: 1.5, py: 1, mx: 0.5,
                cursor: 'pointer',
                fontSize: sizeConfig.fontSize,
                fontFamily: 'inherit',
                borderRadius: '4px',
                ...styles,
                transition: 'background-color 0.1s ease',
                '&:hover': !isSelected ? { backgroundColor: 'var(--Hover)' } : {},
                '&:active': !isSelected ? { backgroundColor: 'var(--Active)' } : {},
              }}
            >
              {isColor && optColor && (
                <Box sx={{
                  width: 20, height: 20, borderRadius: '4px',
                  backgroundColor: optColor,
                  border: isSelected ? '2px solid var(--Buttons-Default-Border)' : '1px solid var(--Border)',
                  flexShrink: 0,
                }} />
              )}
              {(!isColor || showColorLabels) && (
                <Box sx={{ flex: 1 }}>{optLabel}</Box>
              )}
              {isSelected && <Box sx={{ fontSize: '14px', flexShrink: 0, opacity: 0.6 }}>✓</Box>}
            </Box>
            {showDividers && !isLast && (
              <Box aria-hidden="true" sx={{ height: '1px', backgroundColor: 'var(--Border)', mx: 1, my: 0.25 }} />
            )}
          </React.Fragment>
        );
      })}
    </Box>,
    document.body
  ) : null;

  return (
    <Box
      ref={wrapperRef}
      data-surface="Container-Lowest"
      className={
        'select-wrapper select-' + size +
        ' select-label-' + labelPosition +
        ' select-style-' + selectionStyle +
        (open ? ' select-open' : '') +
        (disabled ? ' select-disabled' : '') +
        (className ? ' ' + className : '')
      }
      sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto', display: 'inline-block', fontFamily: 'inherit', ...sx }}
      {...props}
    >
      {/* Top label */}
      {isTop && label && (
        <Box sx={{
          display: 'block', marginBottom: '6px',
          color: disabled ? 'var(--Text-Quiet)' : 'var(--Text)',
          fontSize: sizeConfig.fontSize, fontWeight: 500,
          opacity: disabled ? 0.6 : 1,
        }}>
          {label}
        </Box>
      )}

      {/* Trigger */}
      <Box
        ref={triggerRef}
        component="button"
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label || placeholder}
        tabIndex={disabled ? -1 : 0}
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          width: fullWidth ? '100%' : 'auto', minWidth: 140,
          height: sizeConfig.height + 'px',
          padding: sizeConfig.padding,
          backgroundColor: 'var(--Background)',
          border: '1px solid ' + borderColor,
          borderRadius: 'var(--Style-Border-Radius)',
          color: hasValue ? 'var(--Text)' : 'var(--Text-Quiet)',
          fontSize: sizeConfig.fontSize,
          fontFamily: 'inherit',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          outline: 'none', textAlign: 'left', position: 'relative',
          transition: 'border-color 0.15s ease',
          '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
        }}
      >
        {startDecoration && (
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: 'var(--Text-Quiet)' }}>
            {startDecoration}
          </Box>
        )}

        {/* Floating label */}
        {isFloating && label && (
          <Box sx={{
            position: 'absolute',
            top: hasValue || open ? '6px' : '50%',
            left: (sizeConfig.leftPad || 14) + (startDecoration ? 32 : 0) + 'px',
            transform: hasValue || open ? 'scale(0.75)' : 'translateY(-50%)',
            transformOrigin: 'top left',
            color: open ? 'var(--Hotlink)' : 'var(--Text-Quiet)',
            fontSize: sizeConfig.fontSize, fontWeight: 400,
            pointerEvents: 'none',
            transition: 'top 0.15s ease, transform 0.15s ease, color 0.15s ease',
          }}>
            {label}
          </Box>
        )}

        {/* Value display */}
        <Box sx={{
          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          ...(isFloating && { mt: hasValue || open ? '8px' : 0 }),
        }}>
          {isColor && hasValue ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, borderRadius: '4px', backgroundColor: currentValue, border: '1px solid var(--Border)', flexShrink: 0 }} />
              {showColorLabels && <Box component="span">{selectedLabel}</Box>}
            </Box>
          ) : (
            hasValue ? selectedLabel : (isFloating && label ? '' : placeholder)
          )}
        </Box>

        <ExpandMoreIcon sx={{
          fontSize: (sizeConfig.iconSize || 18) + 'px',
          color: 'var(--Text-Quiet)',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease', flexShrink: 0,
        }} />
      </Box>

      {/* Portal dropdown — renders into document.body to escape overflow:hidden */}
      {dropdown}
    </Box>
  );
}

export default Select;