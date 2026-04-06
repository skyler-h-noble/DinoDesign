// src/components/Rail/Rail.js
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Caption } from '../Typography';

/**
 * Rail (Navigation Rail) Component
 *
 * data-theme="Default", data-surface="Surface-Dim"
 *
 * SELECTED: bg var(--Buttons-Default-Button), text var(--Buttons-Default-Text)
 * UNSELECTED: text var(--Quiet), hover var(--Text)
 *
 * MODES:
 *   fixed       — always collapsed (icon + label below)
 *   expandable  — toggles between collapsed and expanded
 *
 * Items take the same vertical space in both collapsed and expanded states.
 */

const COLLAPSED_WIDTH = 72;
const PARTIAL_WIDTH = 240;
const FULL_WIDTH = 320;
const ITEM_HEIGHT = 56;

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

  const renderItems = () => {
    if (sections && sections.length > 0) {
      const elements = [];
      let globalIndex = 0;
      sections.forEach((section, si) => {
        if (si > 0) {
          elements.push(
            <Box key={'divider-' + si} aria-hidden="true"
              sx={{ height: '1px', backgroundColor: 'var(--Border)', mx: isExpanded ? 2 : 1.5, my: 0.5 }} />
          );
        }
        section.items.forEach((item) => {
          const idx = globalIndex;
          elements.push(
            <RailItem key={'item-' + idx} icon={item.icon} label={item.label} badge={item.badge}
              selected={activeIndex === idx} expanded={isExpanded} onClick={() => handleSelect(idx)} />
          );
          globalIndex++;
        });
      });
      return elements;
    }
    return items.map((item, i) => (
      <RailItem key={i} icon={item.icon} label={item.label} badge={item.badge}
        selected={activeIndex === i} expanded={isExpanded} onClick={() => handleSelect(i)} />
    ));
  };

  return (
    <Box
      component="nav" role="navigation" aria-label="Navigation rail"
      data-theme="Default" data-surface="Surface-Dim"
      className={'rail' + (isExpanded ? ' rail-expanded' : ' rail-collapsed') + ' ' + className}
      sx={{
        display: 'flex', flexDirection: 'column',
        width: width + 'px', minHeight: '100%',
        backgroundColor: 'var(--Background)',
        borderRight: '1px solid var(--Border)',
        fontFamily: 'inherit',
        transition: 'width 0.25s ease',
        overflow: 'hidden', flexShrink: 0,
        ...sx,
      }}
      {...props}
    >
      {/* Toggle button */}
      {expandable && (
        <Box sx={{ display: 'flex', justifyContent: isExpanded ? 'flex-start' : 'center', px: isExpanded ? 1.5 : 0, height: ITEM_HEIGHT, alignItems: 'center' }}>
          <Button iconOnly variant="ghost" size="small"
            onClick={toggleExpand} aria-label={isExpanded ? 'Collapse menu' : 'Expand menu'}>
            <Icon size="small" sx={{ color: 'inherit' }}>
              {isExpanded ? <CloseIcon /> : <MenuIcon />}
            </Icon>
          </Button>
        </Box>
      )}

      {/* FAB action */}
      {fabAction && (
        <Box sx={{ px: isExpanded ? 2 : 1, py: 1, flexShrink: 0 }}>
          <Button
            variant="primary-light"
            size="medium"
            onClick={fabAction.onClick}
            aria-label={fabAction.label || 'Action'}
            startIcon={fabAction.icon ? <Icon size="small" sx={{ color: 'inherit' }}>{fabAction.icon}</Icon> : undefined}
            sx={{
              width: isExpanded ? '100%' : 56,
              borderRadius: isExpanded ? '28px' : 'var(--Style-Border-Radius)',
              justifyContent: isExpanded ? 'flex-start' : 'center',
              transition: 'all 0.2s ease',
            }}
          >
            {isExpanded ? fabAction.label : null}
          </Button>
        </Box>
      )}

      {/* Nav items */}
      <Box role="tablist" aria-orientation="vertical"
        sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 0.5 }}>
        {renderItems()}
      </Box>
    </Box>
  );
}

/* ─── Rail Item ─── */
function RailItem({ icon, label, badge, selected, expanded, onClick }) {
  const selectedBg = 'var(--Buttons-Default-Button)';
  const selectedColor = 'var(--Buttons-Default-Text)';
  const unselectedColor = 'var(--Quiet)';

  return (
    <Box
      component="button" type="button" role="tab"
      aria-selected={selected} aria-label={label} onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: expanded ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: expanded ? 'flex-start' : 'center',
        gap: expanded ? 1.5 : 0.25,
        width: '100%',
        height: ITEM_HEIGHT,
        px: expanded ? 2.5 : 0.5,
        border: 'none', borderRadius: 0,
        backgroundColor: expanded && selected ? selectedBg : 'transparent',
        color: selected ? (expanded ? selectedColor : selectedColor) : unselectedColor,
        cursor: 'pointer', fontFamily: 'inherit',
        textAlign: expanded ? 'left' : 'center',
        transition: 'background-color 0.15s ease, color 0.15s ease',
        outline: 'none',
        '&:hover': !selected ? { backgroundColor: 'var(--Hover)', color: 'var(--Text)' } : {},
        '&:focus-visible': { outline: '3px solid var(--Focus-Visible)', outlineOffset: '-3px' },
      }}
    >
      {/* Icon — pill shape when collapsed + selected */}
      <Box sx={{
        position: 'relative', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        ...(!expanded && {
          width: selected ? 56 : 24, height: 32, borderRadius: '16px',
          backgroundColor: selected ? selectedBg : 'transparent',
          transition: 'background-color 0.2s ease, width 0.2s ease',
        }),
        ...(expanded && { flexShrink: 0 }),
      }}>
        <Icon size="small" sx={{ color: 'inherit' }}>{icon}</Icon>
        {badge && <RailBadge value={badge} />}
      </Box>

      {/* Label */}
      {label && (
        <Caption style={{
          color: 'inherit',
          fontWeight: 500,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          ...(expanded ? { flex: 1 } : { maxWidth: '100%', fontSize: '11px' }),
        }}>
          {label}
        </Caption>
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
      backgroundColor: 'var(--Tags-Error-BG)',
      color: 'var(--Tags-Error-Text)',
      fontSize: '10px', fontWeight: 700, px: 0.5,
      display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
    }}>
      {value}
    </Box>
  );
}

export default Rail;
