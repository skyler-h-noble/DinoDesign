// src/components/Toolbar/Toolbar.js
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';

/**
 * Toolbar Component
 *
 * THEME: data-surface="Surface", data-theme per barColor:
 *   default → Nav-Bar, primary → Primary, primary-light → Primary-Light,
 *   primary-medium → Primary-Medium, primary-dark → Primary-Dark,
 *   white → Neutral, black → Neutral-Dark
 *
 * MODES:
 *   icon     Icon button toolbar (toggle selection)
 *   basic    Two action buttons: outlined (left) + solid (right)
 *
 * ICON MODE:
 *   Selected:   bg var(--Buttons-Default-Button), icon var(--Buttons-Default-Text),
 *               border 1px solid var(--Buttons-Default-Border)
 *   Unselected: icon var(--Text-Quiet), bg transparent
 *   Hover: var(--Hover), Active: var(--Active)
 *
 * BASIC MODE:
 *   Left:  bg transparent, border 1px solid var(--Buttons-Default-Border), text var(--Text)
 *   Right: bg var(--Buttons-Default-Button), text var(--Buttons-Default-Text),
 *          border 1px solid var(--Buttons-Default-Border)
 *
 * ORIENTATION: horizontal | vertical
 * FAB/SPEEDDIAL: optional — shown when ≤4 icon items
 */

const BAR_THEME_MAP = {
  default: 'Nav-Bar',
  primary: 'Primary',
  'primary-light': 'Primary-Light',
  'primary-medium': 'Primary-Medium',
  'primary-dark': 'Primary-Dark',
  white: 'Neutral',
  black: 'Neutral-Dark',
};

export function Toolbar({
  items = [],
  value: controlledValue,
  defaultValue,
  onChange,
  mode = 'icon',
  orientation = 'horizontal',
  barColor = 'default',
  fab,
  basicLeft,
  basicRight,
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

  const dataTheme = BAR_THEME_MAP[barColor] || BAR_THEME_MAP.default;
  const isVertical = orientation === 'vertical';
  const isBasic = mode === 'basic';

  return (
    <Box
      role="toolbar"
      aria-orientation={orientation}
      aria-label="Toolbar"
      data-theme={dataTheme}
      data-surface="Surface"
      className={'toolbar toolbar-' + mode + ' toolbar-' + orientation +
        ' toolbar-' + barColor +
        (className ? ' ' + className : '')}
      sx={{
        display: 'inline-flex',
        flexDirection: isVertical ? 'column' : 'row',
        alignItems: 'center',
        gap: isBasic ? 1 : 0.5,
        backgroundColor: 'var(--Background)',
        border: '1px solid var(--Border)',
        borderRadius: isVertical ? '999px' : 'var(--Style-Border-Radius)',
        padding: isBasic ? '6px 8px' : '6px',
        fontFamily: 'inherit',
        flexShrink: 0,
        ...sx,
      }}
      {...props}
    >
      {isBasic ? (
        /* ─── Basic mode: two action buttons ─── */
        <>
          {/* Left — outlined */}
          <Box
            component="button" type="button"
            onClick={basicLeft?.onClick}
            aria-label={basicLeft?.label || 'Back'}
            sx={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              gap: '6px',
              height: 36, px: 2,
              borderRadius: 'var(--Style-Border-Radius)',
              backgroundColor: 'transparent',
              border: '1px solid var(--Buttons-Default-Border)',
              color: 'var(--Text)',
              fontSize: '14px', fontFamily: 'inherit', fontWeight: 600,
              cursor: 'pointer', outline: 'none',
              transition: 'background-color 0.15s ease',
              '&:hover': { backgroundColor: 'var(--Hover)' },
              '&:active': { backgroundColor: 'var(--Active)' },
              '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
              '& .MuiSvgIcon-root': { fontSize: 18 },
            }}
          >
            {basicLeft?.icon}
            {basicLeft?.label || 'Back'}
          </Box>

          {/* Right — solid */}
          <Box
            component="button" type="button"
            onClick={basicRight?.onClick}
            aria-label={basicRight?.label || 'Next'}
            sx={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              gap: '6px',
              height: 36, px: 2,
              borderRadius: 'var(--Style-Border-Radius)',
              backgroundColor: 'var(--Buttons-Default-Button)',
              border: '1px solid var(--Buttons-Default-Border)',
              color: 'var(--Buttons-Default-Text)',
              fontSize: '14px', fontFamily: 'inherit', fontWeight: 600,
              cursor: 'pointer', outline: 'none',
              transition: 'background-color 0.15s ease',
              '&:hover': { backgroundColor: 'var(--Hover)' },
              '&:active': { backgroundColor: 'var(--Active)' },
              '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
              '& .MuiSvgIcon-root': { fontSize: 18 },
            }}
          >
            {basicRight?.label || 'Next'}
            {basicRight?.icon}
          </Box>
        </>
      ) : (
        /* ─── Icon mode: toggleable icon buttons + optional FAB ─── */
        <>
          {items.map((item, index) => {
            const isSelected = activeIndex === index;
            return (
              <Box
                key={item.key || index}
                component="button" type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={item.label}
                onClick={() => handleSelect(index)}
                sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 40, height: 40,
                  borderRadius: '50%',
                  backgroundColor: isSelected ? 'var(--Buttons-Default-Button)' : 'transparent',
                  border: isSelected ? '1px solid var(--Buttons-Default-Border)' : '1px solid transparent',
                  color: isSelected ? 'var(--Buttons-Default-Text)' : 'var(--Text-Quiet)',
                  cursor: 'pointer', outline: 'none',
                  flexShrink: 0,
                  transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
                  '&:hover': !isSelected ? { backgroundColor: 'var(--Hover)' } : {},
                  '&:active': !isSelected ? { backgroundColor: 'var(--Active)' } : {},
                  '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
                  '& .MuiSvgIcon-root': { fontSize: 24 },
                }}
              >
                {item.icon}
              </Box>
            );
          })}

          {/* FAB slot */}
          {fab && (
            <Box
              component="button" type="button"
              aria-label={fab.label || 'Action'}
              onClick={fab.onClick}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40,
                borderRadius: '50%',
                backgroundColor: 'var(--Buttons-Default-Button)',
                border: '1px solid var(--Buttons-Default-Border)',
                color: 'var(--Buttons-Default-Text)',
                cursor: 'pointer', outline: 'none', flexShrink: 0,
                transition: 'background-color 0.15s ease',
                '&:hover': { backgroundColor: 'var(--Hover)' },
                '&:active': { backgroundColor: 'var(--Active)' },
                '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
                '& .MuiSvgIcon-root': { fontSize: 24 },
              }}
            >
              {fab.icon}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default Toolbar;
