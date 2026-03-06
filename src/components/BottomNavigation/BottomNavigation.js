// src/components/BottomNavigation/BottomNavigation.js
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';

/**
 * BottomNavigation Component
 *
 * Always: data-surface="Surface-Dim", bg var(--Background)
 *
 * BAR COLORS (sets data-theme):
 *   default        data-theme="Nav-Bar"
 *   primary        data-theme="Primary"
 *   primary-light  data-theme="Primary-Light"
 *   primary-medium data-theme="Primary-Medium"
 *   primary-dark   data-theme="Primary-Dark"
 *   white          data-theme="White"
 *   black          data-theme="Black"
 *
 * SELECTED STATE:
 *   Without backfill: icon/label color var(--Text)
 *   With backfill:    pill bg var(--Buttons-Primary-Button),
 *                     pill border 1px solid var(--Buttons-Primary-Border),
 *                     icon/label color var(--Buttons-Primary-Text)
 *
 * UNSELECTED: icon/label color var(--Text-Quiet)
 */

const THEME_MAP = {
  'default':        'Nav-Bar',
  'primary':        'Primary',
  'primary-light':  'Primary-Light',
  'primary-medium': 'Primary-Medium',
  'primary-dark':   'Primary-Dark',
  'white':          'White',
  'black':          'Black',
};

export function BottomNavigation({
  items = [],
  value: controlledValue,
  defaultValue = 0,
  onChange,
  showLabels = true,
  labelOrientation = 'vertical',
  backfill = true,
  barColor = 'default',
  fixed = true,
  className = '',
  sx = {},
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const activeIndex = isControlled ? controlledValue : internalValue;

  const handleSelect = useCallback((index) => {
    if (!isControlled) setInternalValue(index);
    onChange?.(index);
  }, [isControlled, onChange]);

  const effectiveOrientation = (items.length > 4) ? 'vertical' : labelOrientation;
  const isHorizontal = effectiveOrientation === 'horizontal';

  const dataTheme = THEME_MAP[barColor] || THEME_MAP.default;

  return (
    <Box
      component="nav"
      role="navigation"
      aria-label="Bottom navigation"
      data-theme={dataTheme}
      data-surface="Surface-Dim"
      className={'bottom-nav bottom-nav-' + barColor +
        (showLabels ? ' bottom-nav-labels' : '') +
        (isHorizontal && showLabels ? ' bottom-nav-horizontal' : '') +
        (backfill ? ' bottom-nav-backfill' : '') +
        (fixed ? ' bottom-nav-fixed' : '') +
        (className ? ' ' + className : '')}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--Background)',
        borderTop: '1px solid var(--Border)',
        fontFamily: 'inherit',
        width: '100%',
        ...(fixed && {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
        }),
        ...sx,
      }}
      {...props}
    >
      <Box
        role="tablist"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          width: '100%',
          maxWidth: 600,
          height: showLabels && !isHorizontal ? 72 : 64,
          px: 1,
        }}
      >
        {items.map((item, index) => {
          const isSelected = index === activeIndex;
          return (
            <BottomNavItem
              key={item.key || index}
              icon={item.icon}
              label={item.label}
              selected={isSelected}
              showLabel={showLabels}
              horizontal={isHorizontal}
              backfill={backfill}
              onClick={() => handleSelect(index)}
              ariaLabel={item.label || 'Tab ' + (index + 1)}
            />
          );
        })}
      </Box>
    </Box>
  );
}

function BottomNavItem({
  icon, label, selected, showLabel, horizontal, backfill, onClick, ariaLabel,
}) {
  const unselectedColor = 'var(--Text-Quiet)';
  const selectedColor = 'var(--Text)';
  const pillBg = 'var(--Buttons-Primary-Button)';
  const pillBorder = '1px solid var(--Buttons-Primary-Border)';
  const pillText = 'var(--Buttons-Primary-Text)';

  const iconColor = selected
    ? (backfill ? pillText : selectedColor)
    : unselectedColor;

  const labelColor = selected
    ? (backfill && horizontal ? pillText : selectedColor)
    : unselectedColor;

  const isVertical = !horizontal;

  const pillContent = (
    <Box sx={{
      display: 'flex',
      flexDirection: horizontal ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: horizontal ? 0.75 : 0,
      ...(selected && backfill && {
        backgroundColor: pillBg,
        border: pillBorder,
        borderRadius: '16px',
        px: horizontal ? 2 : 2.5,
        py: 0.5,
      }),
      ...(!selected || !backfill ? { px: horizontal ? 1 : 0, border: '1px solid transparent' } : {}),
      transition: 'background-color 0.2s ease, border-color 0.2s ease',
    }}>
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '24px', color: iconColor,
        transition: 'color 0.15s ease',
        '& .MuiSvgIcon-root': { fontSize: 'inherit', color: 'inherit' },
      }}>
        {icon}
      </Box>
      {showLabel && horizontal && label && (
        <Box sx={{
          fontSize: '13px', fontWeight: selected ? 600 : 500,
          color: selected && backfill ? pillText : (selected ? selectedColor : unselectedColor),
          whiteSpace: 'nowrap', lineHeight: 1,
          transition: 'color 0.15s ease',
        }}>
          {label}
        </Box>
      )}
    </Box>
  );

  return (
    <Box
      component="button" type="button" role="tab"
      aria-selected={selected} aria-label={ariaLabel} onClick={onClick}
      sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        flex: 1, gap: isVertical && showLabel ? 0.25 : 0,
        border: 'none', backgroundColor: 'transparent', cursor: 'pointer', outline: 'none',
        fontFamily: 'inherit', py: 1, minWidth: 0,
        transition: 'transform 0.1s ease',
        '&:hover': { transform: 'scale(1.04)' },
        '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-2px', borderRadius: '8px' },
      }}
    >
      {pillContent}
      {showLabel && isVertical && label && (
        <Box sx={{
          fontSize: '11px', fontWeight: selected ? 600 : 400, color: labelColor,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          maxWidth: '100%', lineHeight: 1.2, mt: 0.25,
          transition: 'color 0.15s ease',
        }}>
          {label}
        </Box>
      )}
    </Box>
  );
}

export default BottomNavigation;
