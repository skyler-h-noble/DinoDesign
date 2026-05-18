// src/components/Select/Select.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import { Icon } from '../Icon/Icon';
import { Body, BodySmall } from '../Typography';
import { SHADOW_LEVEL_1, SHADOW_LEVEL_2 } from '../_shadows';

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

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SIZE_MAP = {
  small:  { height: 'var(--Small-Button-Height)', fontSize: '13px', padding: '4px 8px', iconSize: 16 },
  medium: { height: 'var(--Button-Height)',        fontSize: '14px', padding: '6px 12px', iconSize: 18 },
  large:  { height: 'var(--Large-Button-Height)',  fontSize: '16px', padding: '8px 16px', iconSize: 20 },
};

const FLOATING_SIZE_MAP = {
  small:  { height: 48, fontSize: '13px', padding: '20px 12px 4px', labelSize: '11px', leftPad: 12 },
  medium: { height: 56, fontSize: '14px', padding: '22px 14px 6px', labelSize: '12px', leftPad: 14 },
  large:  { height: 64, fontSize: '16px', padding: '24px 16px 6px', labelSize: '14px', leftPad: 16 },
};

const DROPDOWN_MAX_HEIGHT = 240;

function getSelectedStyles(selectionStyle, isSelected, colorName) {
  const C = cap(colorName || 'default');
  if (!isSelected) {
    return {
      color: 'var(--Text)',
      backgroundColor: 'transparent',
      border: '1px solid transparent',
    };
  }
  if (selectionStyle === 'solid') {
    return {
      backgroundColor: 'var(--Buttons-' + C + '-Button)',
      color: 'var(--Buttons-' + C + '-Text)',
      border: '1px solid var(--Buttons-' + C + '-Border)',
      fontWeight: 600,
    };
  }
  if (selectionStyle === 'light') {
    return {
      backgroundColor: 'var(--Buttons-' + C + '-Light-Button)',
      color: 'var(--Buttons-' + C + '-Light-Text)',
      border: '1px solid var(--Buttons-' + C + '-Light-Border)',
      fontWeight: 600,
    };
  }
  // default selection style
  return {
    backgroundColor: 'var(--Buttons-' + C + '-Button)',
    color: 'var(--Buttons-' + C + '-Text)',
    border: '1px solid var(--Buttons-' + C + '-Border)',
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
  variant = 'outline',        // 'outline' | 'light'
  color = 'primary',          // 'default' | 'primary' | 'secondary' | ...
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
  const effectiveColor = color === 'default' ? 'primary' : color;
  const C = cap(effectiveColor);
  const isLight = variant === 'light';
  const borderToken = 'var(--Buttons-' + C + '-Border)';
  const activeTextColor = color === 'default' ? 'var(--Text)' : 'var(--Text-' + C + ')';
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
  // Flatten groups so lookups and counts work whether options are flat or grouped
  const flatOptions = options.flatMap((o) => (o && Array.isArray(o.options)) ? o.options : [o]);
  const selectedOption = flatOptions.find((o) => (typeof o === 'string' ? o : o.value) === currentValue);
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

  const dropdownRef = useRef(null);

  const focusOption = useCallback((dir) => {
    const container = dropdownRef.current;
    if (!container) return;
    const items = container.querySelectorAll('[role="option"]');
    if (!items.length) return;
    const active = container.querySelector('[role="option"]:focus');
    let idx = Array.prototype.indexOf.call(items, active);
    if (dir === 'down') idx = idx < items.length - 1 ? idx + 1 : 0;
    else idx = idx > 0 ? idx - 1 : items.length - 1;
    items[idx].focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); return; }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleOpen(); return; }
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); setOpen(true); return; }
    if (open && e.key === 'ArrowDown') { e.preventDefault(); focusOption('down'); }
    if (open && e.key === 'ArrowUp') { e.preventDefault(); focusOption('up'); }
  };

  const handleOptionKeyDown = (e, optValue) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(optValue); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); focusOption('down'); }
    if (e.key === 'ArrowUp') { e.preventDefault(); focusOption('up'); }
    if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
  };


  // Focus selected or first option when dropdown opens
  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      const container = dropdownRef.current;
      if (!container) return;
      const selected = container.querySelector('[aria-selected="true"]');
      const first = container.querySelector('[role="option"]');
      (selected || first)?.focus();
    });
  }, [open]);

  // The dropdown rendered into document.body via portal
  const dropdown = open ? ReactDOM.createPortal(
    <Box
      ref={dropdownRef}
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
        borderRadius: '4px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        zIndex: 99999,
        maxHeight: DROPDOWN_MAX_HEIGHT + 'px',
        overflowY: 'auto',
        py: 0.5,
      }}
    >
      {(() => {
        const renderOption = (opt, idx, total) => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          const optColor = typeof opt === 'object' ? opt.color : null;
          const isSelected = optValue === currentValue;
          const styles = getSelectedStyles(selectionStyle, isSelected, effectiveColor);
          const isLast = idx === total - 1;

          return (
            <React.Fragment key={optValue}>
              <Box
                role="option"
                tabIndex={-1}
                aria-selected={isSelected}
                aria-label={isColor && !showColorLabels ? optLabel : undefined}
                onClick={() => handleSelect(optValue)}
                onKeyDown={(e) => handleOptionKeyDown(e, optValue)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 1.5, py: 0, mx: 0.5, my: '1px',
                  minHeight: sizeConfig.height,
                  cursor: 'pointer',
                  fontSize: sizeConfig.fontSize,
                  fontFamily: 'inherit',
                  borderRadius: '4px',
                  outline: 'none',
                  ...styles,
                  transition: 'background-color 0.1s ease',
                  '&:hover': !isSelected ? { backgroundColor: 'var(--Buttons-' + C + '-Hover)', color: 'var(--Buttons-' + C + '-Text)' } : {},
                  '&:active': !isSelected ? { backgroundColor: 'var(--Buttons-' + C + '-Active)', color: 'var(--Buttons-' + C + '-Text)' } : {},
                  '&:focus-visible': {
                    outline: '2px solid var(--Focus-Visible)',
                    outlineOffset: '2px',
                  },
                }}
              >
                {isColor && optColor && (
                  <Box sx={{
                    // Swatch scales with the Select's own height (-8px
                    // gives a generous gap on top/bottom for the option
                    // row's vertical padding to breathe).
                    height: 'calc(' + sizeConfig.height + ' - 8px)',
                    width: 'calc(' + sizeConfig.height + ' - 8px)',
                    // Radius follows the input swatch token so the swatch
                    // scales independently of the button radius (the input
                    // can have a different roundness from buttons).
                    borderRadius: 'var(--Input-Swatch-Radius, var(--Button-Radius))',
                    backgroundColor: optColor,
                    // Always 1px so the selected ring doesn't read as a
                    // double border next to the swatch's own outline.
                    // Selected uses the accent border color, unselected
                    // uses --Border — same stroke width either way.
                    border: '1px solid ' + (isSelected ? 'var(--Buttons-' + C + '-Border)' : 'var(--Border)'),
                    flexShrink: 0,
                  }} />
                )}
                {(!isColor || showColorLabels) && (
                  <BodySmall style={{ flex: 1, color: 'inherit', fontWeight: 'inherit' }}>{optLabel}</BodySmall>
                )}
                {isSelected && <Icon size="small" sx={{ opacity: 0.6, flexShrink: 0 }}><CheckIcon /></Icon>}
              </Box>
              {showDividers && !isLast && (
                <Box aria-hidden="true" sx={{ height: '1px', backgroundColor: 'var(--Border)', mx: 1, my: 0.25 }} />
              )}
            </React.Fragment>
          );
        };

        return options.map((opt, gIdx) => {
          // Group: has an `options` array of children
          if (opt && Array.isArray(opt.options)) {
            const groupItems = opt.options;
            return (
              <React.Fragment key={'group-' + (opt.label || gIdx)}>
                <Box
                  role="presentation"
                  sx={{
                    px: 1.5,
                    pt: gIdx === 0 ? 0.75 : 1.25,
                    pb: 0.5,
                    fontSize: '11px',
                    fontFamily: 'inherit',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--Text-Quiet)',
                  }}
                >
                  {opt.label}
                </Box>
                {groupItems.map((child, cIdx) => renderOption(child, cIdx, groupItems.length))}
              </React.Fragment>
            );
          }
          return renderOption(opt, gIdx, options.length);
        });
      })()}
    </Box>,
    document.body
  ) : null;

  return (
    <Box
      ref={wrapperRef}
      className={
        'select-wrapper select-' + size +
        ' select-label-' + labelPosition +
        ' select-style-' + selectionStyle +
        ' select-variant-' + variant +
        (open ? ' select-open' : '') +
        (disabled ? ' select-disabled' : '') +
        (className ? ' ' + className : '')
      }
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
        boxShadow: SHADOW_LEVEL_1,
        '&:hover': { boxShadow: SHADOW_LEVEL_2 },
        '&:focus-within': {
          outline: '2px solid var(--Focus-Visible)',
          outlineOffset: '2px',
        },
      }}>

      {/* Inner themed surface */}
      <Box
        {...(isLight ? { 'data-theme': C + '-Light', 'data-surface': 'Surface-Dim' } : { 'data-surface': 'Container' })}
      >

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
          width: '100%', minWidth: 140,
          height: sizeConfig.height,
          padding: sizeConfig.padding,
          backgroundColor: 'var(--Background)',
          border: 'none',
          borderRadius: 0,
          color: (hasValue || open) ? activeTextColor : 'var(--Quiet)',
          fontSize: sizeConfig.fontSize,
          fontFamily: 'inherit',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          outline: 'none', textAlign: 'left', position: 'relative',
          transition: 'color 0.15s ease',
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
            color: open ? activeTextColor : 'var(--Quiet)',
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
              <Box sx={{
                height: 'calc(' + sizeConfig.height + ' - 8px)',
                width: 'calc(' + sizeConfig.height + ' - 8px)',
                borderRadius: 'var(--Input-Swatch-Radius, var(--Button-Radius))',
                // selectedOption holds the option object (label, value,
                // color). The trigger swatch needs the option's `color`
                // — not currentValue, which is just the value string
                // (e.g. "primary") and isn't a valid CSS color.
                backgroundColor: (selectedOption && typeof selectedOption !== 'string' && selectedOption.color) || 'transparent',
                border: '1px solid var(--Border)',
                flexShrink: 0,
              }} />
              {showColorLabels && <BodySmall style={{ color: 'inherit' }}>{selectedLabel}</BodySmall>}
            </Box>
          ) : (
            <BodySmall style={{ color: 'inherit' }}>
              {hasValue ? selectedLabel : (isFloating && label ? '' : placeholder)}
            </BodySmall>
          )}
        </Box>

        <ExpandMoreIcon sx={{
          fontSize: (sizeConfig.iconSize || 18) + 'px',
          color: 'var(--Text-Quiet)',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease', flexShrink: 0,
        }} />
      </Box>

      </Box>{/* end inner themed surface */}
      </Box>{/* end outer border shell */}

      {/* Portal dropdown — renders into document.body to escape overflow:hidden */}
      {dropdown}
    </Box>
  );
}

export default Select;