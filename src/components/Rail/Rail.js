// src/components/Rail/Rail.js
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Rail (Navigation Rail) Component
 *
 * THEME: data-theme="Default", data-surface="Surface-Dim"
 *
 * SELECTED:
 *   bg: var(--Buttons-Default-Button)
 *   icon/text: var(--Buttons-Default-Text)
 *
 * UNSELECTED:
 *   icon/text: var(--Text-Quiet)
 *   hover bg: var(--Hover)
 *   active bg: var(--Active)
 *
 * MODES:
 *   fixed       — always collapsed (icon + label below)
 *   expandable  — toggles between collapsed and expanded
 *     partial   — expanded: 240px, icon + label inline
 *     full      — expanded: 320px, icon + label inline
 *
 * COLLAPSED: 72px, icon in pill (selected) + label below
 * SECTIONS: groups separated by dividers
 */

const COLLAPSED_WIDTH = 72;
const PARTIAL_WIDTH = 240;
const FULL_WIDTH = 320;

export function Rail({
  items = [],
  sections,
  value: controlledValue,
  defaultValue = 0,
  onChange,
  expandable = false,
  expandedWidth = 'partial',
  defaultExpanded = false,
  fabAction,
  className = '',
  sx = {},
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [expanded, setExpanded] = useState(defaultExpanded);

  const isControlled = controlledValue !== undefined;
  const activeIndex = isControlled ? controlledValue : internalValue;

  const handleSelect = useCallback((index) => {
    if (!isControlled) setInternalValue(index);
    onChange?.(index);
  }, [isControlled, onChange]);

  const toggleExpand = () => setExpanded((prev) => !prev);

  const isExpanded = expandable && expanded;
  const width = isExpanded
    ? (expandedWidth === 'full' ? FULL_WIDTH : PARTIAL_WIDTH)
    : COLLAPSED_WIDTH;

  // Render items from sections or flat list
  const renderItems = () => {
    if (sections && sections.length > 0) {
      const elements = [];
      let globalIndex = 0;

      sections.forEach((section, si) => {
        if (si > 0) {
          elements.push(
            <Box key={'divider-' + si} aria-hidden="true"
              sx={{ height: '1px', backgroundColor: 'var(--Border)', mx: isExpanded ? 2 : 1.5, my: 1 }} />
          );
        }
        section.items.forEach((item) => {
          const idx = globalIndex;
          elements.push(
            <RailItem
              key={'item-' + idx}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              selected={activeIndex === idx}
              expanded={isExpanded}
              onClick={() => handleSelect(idx)}
            />
          );
          globalIndex++;
        });
      });
      return elements;
    }

    return items.map((item, i) => (
      <RailItem
        key={i}
        icon={item.icon}
        label={item.label}
        badge={item.badge}
        selected={activeIndex === i}
        expanded={isExpanded}
        onClick={() => handleSelect(i)}
      />
    ));
  };

  return (
    <Box
      component="nav"
      role="navigation"
      aria-label="Navigation rail"
      data-theme="Default"
      data-surface="Surface-Dim"
      className={'rail' +
        (isExpanded ? ' rail-expanded' : ' rail-collapsed') +
        (expandable ? ' rail-expandable' : ' rail-fixed') +
        (className ? ' ' + className : '')}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: width + 'px',
        minHeight: '100%',
        backgroundColor: 'var(--Background)',
        borderRight: '1px solid var(--Border)',
        fontFamily: 'inherit',
        transition: 'width 0.25s ease',
        overflow: 'hidden',
        flexShrink: 0,
        ...sx,
      }}
      {...props}
    >
      {/* Menu toggle — hamburger / close */}
      {expandable && (
        <Box
          component="button"
          type="button"
          aria-label={isExpanded ? 'Collapse menu' : 'Expand menu'}
          onClick={toggleExpand}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            width: '100%',
            height: 56,
            px: isExpanded ? 2.5 : 0,
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--Text-Quiet)',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'color 0.15s ease',
            '&:hover': { color: 'var(--Text)', backgroundColor: 'var(--Hover)' },
            '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-3px' },
          }}
        >
          {isExpanded
            ? <CloseIcon sx={{ fontSize: 24 }} />
            : <MenuIcon sx={{ fontSize: 24 }} />}
        </Box>
      )}

      {/* FAB action (top highlight button) */}
      {fabAction && (
        <Box sx={{ px: isExpanded ? 2 : 1, py: 1, flexShrink: 0 }}>
          <Box
            component="button"
            type="button"
            aria-label={fabAction.label || 'Action'}
            onClick={fabAction.onClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isExpanded ? 'flex-start' : 'center',
              gap: isExpanded ? 1.5 : 0,
              width: isExpanded ? '100%' : 56,
              height: isExpanded ? 48 : 56,
              px: isExpanded ? 2 : 0,
              border: 'none',
              borderRadius: isExpanded ? '28px' : 'var(--Style-Border-Radius)',
              backgroundColor: 'var(--Buttons-Primary-Light-Button)',
              color: 'var(--Buttons-Primary-Light-Text)',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'inherit',
              fontWeight: 600,
              flexShrink: 0,
              mx: 'auto',
              transition: 'all 0.2s ease',
              '&:hover': { backgroundColor: 'var(--Buttons-Primary-Light-Hover)' },
              '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '2px' },
              '& .MuiSvgIcon-root': { fontSize: isExpanded ? 20 : 24 },
            }}
          >
            {fabAction.icon}
            {isExpanded && fabAction.label && (
              <Box component="span" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {fabAction.label}
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Nav items */}
      <Box role="tablist" aria-orientation="vertical"
        sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1 }}>
        {renderItems()}
      </Box>
    </Box>
  );
}

/* ─── Rail Item ─── */
function RailItem({ icon, label, badge, selected, expanded, onClick }) {
  const selectedBg = 'var(--Buttons-Default-Button)';
  const selectedColor = 'var(--Buttons-Default-Text)';
  const unselectedColor = 'var(--Text-Quiet)';

  if (expanded) {
    return (
      <Box
        component="button" type="button" role="tab"
        aria-selected={selected} aria-label={label} onClick={onClick}
        sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          width: '100%', height: 48, px: 2.5,
          border: 'none', borderRadius: 0,
          backgroundColor: selected ? selectedBg : 'transparent',
          color: selected ? selectedColor : unselectedColor,
          cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit',
          fontWeight: selected ? 600 : 500, textAlign: 'left',
          transition: 'background-color 0.15s ease, color 0.15s ease',
          '&:hover': !selected ? { backgroundColor: 'var(--Hover)', color: 'var(--Text)' } : {},
          '&:active': !selected ? { backgroundColor: 'var(--Active)' } : {},
          '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-3px' },
          '& .MuiSvgIcon-root': { fontSize: 24 },
        }}
      >
        <Box sx={{ position: 'relative', display: 'flex', flexShrink: 0 }}>
          {icon}
          {badge && <RailBadge value={badge} />}
        </Box>
        <Box component="span" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
          {label}
        </Box>
      </Box>
    );
  }

  // Collapsed: icon pill + label below
  return (
    <Box
      component="button" type="button" role="tab"
      aria-selected={selected} aria-label={label} onClick={onClick}
      sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 0.25,
        width: '100%', minHeight: 56, py: 1, px: 0.5,
        border: 'none', backgroundColor: 'transparent',
        color: selected ? selectedColor : unselectedColor,
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'color 0.15s ease',
        '&:hover': !selected ? { color: 'var(--Text)' } : {},
        '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-3px' },
      }}
    >
      <Box sx={{
        position: 'relative', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        width: selected ? 56 : 24, height: 32, borderRadius: '16px',
        backgroundColor: selected ? selectedBg : 'transparent',
        transition: 'background-color 0.2s ease, width 0.2s ease',
        '&:hover': !selected ? { backgroundColor: 'var(--Hover)', width: 56 } : {},
        '& .MuiSvgIcon-root': { fontSize: 24 },
      }}>
        {icon}
        {badge && <RailBadge value={badge} />}
      </Box>
      {label && (
        <Box sx={{
          fontSize: '11px', fontWeight: selected ? 600 : 400,
          lineHeight: 1.2, textAlign: 'center', whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
        }}>
          {label}
        </Box>
      )}
    </Box>
  );
}

/* ─── Badge ─── */
function RailBadge({ value }) {
  return (
    <Box sx={{
      position: 'absolute', top: -4, right: -6,
      minWidth: 16, height: 16, borderRadius: '8px',
      backgroundColor: 'var(--Tags-Error-BG, #ef4444)',
      color: 'var(--Tags-Error-Text, #fff)',
      fontSize: '10px', fontWeight: 700, px: 0.5,
      display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
    }}>
      {value}
    </Box>
  );
}

export default Rail;
