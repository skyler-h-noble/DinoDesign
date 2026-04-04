// src/components/TransferList/TransferList.js
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { Checkbox } from '../Checkbox/Checkbox';
import { List, ListItem } from '../List/List';

/**
 * TransferList Component
 *
 * Uses own Checkbox + List + ListItem components.
 *
 * MODES:
 *   basic      Two lists with >/< move buttons. Checkboxes to select items.
 *   enhanced   Adds select-all header with count, move-all buttons (>>/ <<).
 *
 * TOKENS:
 *   Container:       bg var(--Background), border 1px solid var(--Border)
 *   Header:          bg var(--Hover), border-bottom var(--Border)
 *   Move buttons:    bg var(--Buttons-Default-Light-Button), border var(--Buttons-Default-Border),
 *                    text var(--Buttons-Default-Light-Text)
 *   Hover:           var(--Buttons-Default-Hover)
 *   Active:          var(--Buttons-Default-Active)
 *   Selected row:    bg var(--Hover)
 *
 * ACCESSIBILITY:
 *   - Empty state renders as <li> to satisfy aria-required-children for role="list"
 *   - Move buttons have aria-label for screen reader clarity
 *   - Outer wrapper has role="group" with aria-label
 */

const MOVE_BTN_SX = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 36, height: 36, borderRadius: '8px',
  backgroundColor: 'var(--Buttons-Default-Light-Button)',
  border: '1px solid var(--Buttons-Default-Border)',
  color: 'var(--Buttons-Default-Light-Text)',
  cursor: 'pointer', outline: 'none', flexShrink: 0,
  transition: 'background-color 0.15s ease',
  '&:hover': { backgroundColor: 'var(--Buttons-Default-Hover)' },
  '&:active': { backgroundColor: 'var(--Buttons-Default-Active)' },
  '&:focus-visible': { outline: '2px solid var(--Focus-Visible)', outlineOffset: '2px' },
  '&:disabled': { opacity: 0.35, cursor: 'not-allowed' },
  '& .MuiSvgIcon-root': { fontSize: 20 },
};

function not(a, b) { return a.filter((v) => !b.includes(v)); }
function intersection(a, b) { return a.filter((v) => b.includes(v)); }

export function TransferList({
  leftItems: controlledLeft,
  rightItems: controlledRight,
  defaultLeftItems = [],
  defaultRightItems = [],
  onChange,
  leftTitle = 'Available',
  rightTitle = 'Chosen',
  mode = 'basic',
  disabled = false,
  className = '',
  sx = {},
  ...props
}) {
  const isControlled = controlledLeft !== undefined && controlledRight !== undefined;
  const [internalLeft, setInternalLeft] = useState(defaultLeftItems);
  const [internalRight, setInternalRight] = useState(defaultRightItems);
  const [checked, setChecked] = useState([]);

  const left = isControlled ? controlledLeft : internalLeft;
  const right = isControlled ? controlledRight : internalRight;
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  const isEnhanced = mode === 'enhanced';

  const update = useCallback((nextLeft, nextRight) => {
    if (!isControlled) { setInternalLeft(nextLeft); setInternalRight(nextRight); }
    onChange?.({ left: nextLeft, right: nextRight });
  }, [isControlled, onChange]);

  const handleToggle = (item) => {
    if (disabled) return;
    setChecked((prev) => prev.includes(item) ? prev.filter((v) => v !== item) : [...prev, item]);
  };

  const handleToggleAll = (items) => {
    if (disabled) return;
    const allChecked = items.every((i) => checked.includes(i));
    if (allChecked) {
      setChecked((prev) => not(prev, items));
    } else {
      setChecked((prev) => [...new Set([...prev, ...items])]);
    }
  };

  const moveRight = () => {
    const nextRight = [...right, ...leftChecked];
    const nextLeft = not(left, leftChecked);
    update(nextLeft, nextRight);
    setChecked(not(checked, leftChecked));
  };

  const moveLeft = () => {
    const nextLeft = [...left, ...rightChecked];
    const nextRight = not(right, rightChecked);
    update(nextLeft, nextRight);
    setChecked(not(checked, rightChecked));
  };

  const moveAllRight = () => {
    update([], [...right, ...left]);
    setChecked([]);
  };

  const moveAllLeft = () => {
    update([...left, ...right], []);
    setChecked([]);
  };

  const renderPanel = (title, items, checkedItems) => {
    const allChecked = items.length > 0 && items.every((i) => checked.includes(i));
    const someChecked = items.some((i) => checked.includes(i)) && !allChecked;

    return (
      <Box sx={{
        flex: 1, minWidth: 160,
        border: '1px solid var(--Border)',
        borderRadius: 'var(--Style-Border-Radius)',
        backgroundColor: 'var(--Background)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        opacity: disabled ? 0.5 : 1,
      }}>
        {/* Header */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          px: 1.5, py: 1,
          backgroundColor: 'var(--Hover)',
          borderBottom: '1px solid var(--Border)',
        }}>
          {isEnhanced && (
            <Checkbox
              size="small"
              checked={allChecked}
              indeterminate={someChecked}
              onChange={() => handleToggleAll(items)}
              disabled={disabled || items.length === 0}
              aria-label={allChecked ? 'Deselect all' : 'Select all'}
            />
          )}
          <Box sx={{ flex: 1, fontSize: '13px', fontWeight: 600, color: 'var(--Text)' }}>
            {title}
          </Box>
          <Box sx={{ fontSize: '12px', color: 'var(--Text-Quiet)' }}>
            {isEnhanced
              ? checkedItems.length + '/' + items.length
              : items.length + ' items'}
          </Box>
        </Box>

        {/* Item list */}
        <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: 240 }}>
          <List size="small" sx={{ py: 0 }}>
            {items.map((item) => {
              const isItemChecked = checked.includes(item);
              return (
                <ListItem
                  key={item}
                  onClick={() => handleToggle(item)}
                  startDecorator={
                    <Checkbox
                      size="small"
                      checked={isItemChecked}
                      onChange={() => handleToggle(item)}
                      disabled={disabled}
                      aria-label={'Select ' + item}
                      sx={{ pointerEvents: 'none' }}
                    />
                  }
                  sx={{
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    backgroundColor: isItemChecked ? 'var(--Hover)' : 'transparent',
                    '&:hover': !disabled ? { backgroundColor: 'var(--Hover)' } : {},
                  }}
                >
                  {item}
                </ListItem>
              );
            })}
            {/* Empty state — must render as <li> to satisfy aria-required-children
                for the parent <ul role="list"> (WCAG aria-required-children) */}
            {items.length === 0 && (
              <Box
                component="li"
                sx={{
                  p: 2,
                  textAlign: 'center',
                  fontSize: '13px',
                  color: 'var(--Text-Quiet)',
                  listStyle: 'none',
                }}
              >
                No items
              </Box>
            )}
          </List>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      className={
        'transfer-list transfer-list-' + mode +
        (disabled ? ' transfer-list-disabled' : '') +
        (className ? ' ' + className : '')
      }
      role="group"
      aria-label="Transfer list"
      sx={{
        display: 'flex', alignItems: 'stretch', gap: 1.5,
        fontFamily: 'inherit',
        ...sx,
      }}
      {...props}
    >
      {/* Left panel */}
      {renderPanel(leftTitle, left, leftChecked)}

      {/* Move buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1, flexShrink: 0 }}>
        {isEnhanced && (
          <Box component="button" type="button" aria-label="Move all right" onClick={moveAllRight}
            disabled={disabled || left.length === 0} sx={MOVE_BTN_SX}>
            <KeyboardDoubleArrowRightIcon />
          </Box>
        )}
        <Box component="button" type="button" aria-label="Move selected right" onClick={moveRight}
          disabled={disabled || leftChecked.length === 0} sx={MOVE_BTN_SX}>
          <ChevronRightIcon />
        </Box>
        <Box component="button" type="button" aria-label="Move selected left" onClick={moveLeft}
          disabled={disabled || rightChecked.length === 0} sx={MOVE_BTN_SX}>
          <ChevronLeftIcon />
        </Box>
        {isEnhanced && (
          <Box component="button" type="button" aria-label="Move all left" onClick={moveAllLeft}
            disabled={disabled || right.length === 0} sx={MOVE_BTN_SX}>
            <KeyboardDoubleArrowLeftIcon />
          </Box>
        )}
      </Box>

      {/* Right panel */}
      {renderPanel(rightTitle, right, rightChecked)}
    </Box>
  );
}

export default TransferList;