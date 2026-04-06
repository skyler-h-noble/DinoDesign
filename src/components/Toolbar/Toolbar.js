// src/components/Toolbar/Toolbar.js
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';

/**
 * Toolbar Component
 *
 * TYPES:
 *   floating     — pill shape (borderRadius 56px), padding 16px, shadow Level-2
 *   contextual   — standard border-radius, padding 8px, no shadow
 *
 * COLORS: default | primary | primary-light | white | black
 *   default → data-theme="Default"
 *   primary → data-theme="Primary"
 *   primary-light → data-theme="Primary-Light"
 *   white → data-theme="White"
 *   black → data-theme="Black"
 *
 * FAB: optional FAB button positioned to the right of the floating toolbar
 *
 * ORIENTATION: horizontal | vertical
 */

const THEME_MAP = {
  default: 'Default',
  primary: 'Primary',
  'primary-light': 'Primary-Light',
  white: 'White',
  black: 'Black',
};

export function Toolbar({
  items = [],
  value: controlledValue,
  defaultValue,
  onChange,
  type = 'floating',
  orientation = 'horizontal',
  color = 'default',
  fab,
  className = '',
  sx = {},
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? null);
  const isControlled = controlledValue !== undefined;
  const activeIndex = isControlled ? controlledValue : internalValue;

  const handleSelect = useCallback((index) => {
    const next = activeIndex === index ? null : index;
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }, [isControlled, activeIndex, onChange]);

  const dataTheme = THEME_MAP[color] || THEME_MAP.default;
  const isVertical = orientation === 'vertical';
  const isFloating = type === 'floating';

  const toolbar = (
    <Box
      role="toolbar"
      aria-orientation={orientation}
      aria-label="Toolbar"
      data-theme={dataTheme}
      data-surface="Surface"
      className={'toolbar toolbar-' + type + ' toolbar-' + orientation + ' toolbar-' + color + ' ' + className}
      sx={{
        display: 'inline-flex',
        flexDirection: isVertical ? 'column' : 'row',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: 'var(--Background)',
        border: '1px solid var(--Border-Variant)',
        borderRadius: isFloating ? '56px' : 'var(--Style-Border-Radius)',
        padding: isFloating ? '8px 16px' : '8px',
        fontFamily: 'inherit',
        flexShrink: 0,
        ...(isFloating && { boxShadow: 'var(--Effect-Level-2)' }),
        ...sx,
      }}
      {...props}
    >
      {items.map((item, index) => {
        const isSelected = activeIndex === index;
        return (
          <Button
            key={item.key || index}
            iconOnly
            variant={isSelected ? 'default' : 'ghost'}
            size="small"
            onClick={() => handleSelect(index)}
            aria-label={item.label}
            aria-checked={isSelected}
            role="radio"
          >
            <Icon size="small" sx={{ color: 'inherit' }}>{item.icon}</Icon>
          </Button>
        );
      })}
    </Box>
  );

  // With FAB: toolbar + FAB side by side
  if (fab && isFloating) {
    return (
      <Box sx={{ display: 'inline-flex', flexDirection: isVertical ? 'column' : 'row', alignItems: 'center', gap: 1 }}>
        {toolbar}
        <Button
          iconOnly
          variant="default"
          size="large"
          onClick={fab.onClick}
          aria-label={fab.label || 'Action'}
          sx={{ borderRadius: '50%', width: 56, height: 56, minWidth: 'unset', minHeight: 'unset' }}
        >
          <Icon size="medium" sx={{ color: 'inherit' }}>{fab.icon}</Icon>
        </Button>
      </Box>
    );
  }

  return toolbar;
}

export default Toolbar;
