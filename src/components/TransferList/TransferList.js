// src/components/TransferList/TransferList.js
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Checkbox } from '../Checkbox/Checkbox';
import { BodySmall, Caption } from '../Typography';

/**
 * TransferList Component
 *
 * MODES:
 *   basic      Two lists with >/< move buttons. Checkboxes to select items.
 *   enhanced   Adds select-all header with count, move-all buttons.
 *
 * TOKENS:
 *   Panel:   data-surface="Container", bg var(--Background), border var(--Buttons-Default-Border)
 *   Header:  bg var(--Hover), border-bottom var(--Border)
 *   Buttons: DynoDesign Button component (default-outline)
 *   Shadow:  Level 1 rest, Level 2 hover
 */

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
    update(not(left, leftChecked), [...right, ...leftChecked]);
    setChecked(not(checked, leftChecked));
  };

  const moveLeft = () => {
    update([...left, ...rightChecked], not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const moveAllRight = () => { update([], [...right, ...left]); setChecked([]); };
  const moveAllLeft = () => { update([...left, ...right], []); setChecked([]); };

  const renderPanel = (title, items, checkedItems) => {
    const allChecked = items.length > 0 && items.every((i) => checked.includes(i));
    const someChecked = items.some((i) => checked.includes(i)) && !allChecked;

    return (
      <Box sx={{
        flex: 1, minWidth: 160,
        border: '1px solid var(--Buttons-Default-Border)',
        borderRadius: 'var(--Style-Border-Radius)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        opacity: disabled ? 0.5 : 1,
        boxShadow: 'var(--Effect-Level-1)',
        transition: 'box-shadow 0.15s ease',
        '&:hover': { boxShadow: 'var(--Effect-Level-2)' },
      }}>
        {/* Header */}
        <Box
          data-surface="Container"
          sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            px: 1.5, py: 1,
            backgroundColor: 'var(--Background)',
            borderBottom: '1px solid var(--Border)',
          }}
        >
          {isEnhanced && (
            <Checkbox
              size="small"
              variant="default-outline"
              checked={allChecked}
              indeterminate={someChecked}
              onChange={() => handleToggleAll(items)}
              disabled={disabled || items.length === 0}
              aria-label={allChecked ? 'Deselect all' : 'Select all'}
            />
          )}
          <BodySmall style={{ flex: 1, fontWeight: 600, color: 'var(--Text)' }}>
            {title}
          </BodySmall>
          <Caption style={{ color: 'var(--Quiet)' }}>
            {isEnhanced
              ? checkedItems.length + '/' + items.length
              : items.length + ' items'}
          </Caption>
        </Box>

        {/* Item list */}
        <Box
          data-surface="Container"
          sx={{ flex: 1, overflowY: 'auto', maxHeight: 240, backgroundColor: 'var(--Background)' }}
        >
          <Box
            component="ul"
            role="list"
            sx={{ m: 0, p: 0, listStyle: 'none' }}
          >
            {items.map((item) => {
              const isItemChecked = checked.includes(item);
              return (
                <Box
                  component="li"
                  key={item}
                  role="listitem"
                  onClick={() => handleToggle(item)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    px: 1.5, py: 0.75,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    backgroundColor: isItemChecked ? 'var(--Hover)' : 'transparent',
                    transition: 'background-color 0.1s ease',
                    '&:hover': !disabled ? { backgroundColor: 'var(--Hover)' } : {},
                  }}
                >
                  <Checkbox
                    size="small"
                    variant="default-outline"
                    checked={isItemChecked}
                    onChange={() => handleToggle(item)}
                    disabled={disabled}
                    aria-label={'Select ' + item}
                    sx={{ pointerEvents: 'none' }}
                  />
                  <BodySmall style={{ color: 'var(--Text)', flex: 1 }}>{item}</BodySmall>
                </Box>
              );
            })}
            {items.length === 0 && (
              <Box component="li" sx={{ p: 2, textAlign: 'center', listStyle: 'none' }}>
                <Caption style={{ color: 'var(--Quiet)' }}>No items</Caption>
              </Box>
            )}
          </Box>
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
      {renderPanel(leftTitle, left, leftChecked)}

      {/* Move buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1, flexShrink: 0 }}>
        {isEnhanced && (
          <Button iconOnly variant="default-outline" size="small" onClick={moveAllRight}
            disabled={disabled || left.length === 0} aria-label="Move all right">
            <Icon size="small"><KeyboardDoubleArrowRightIcon /></Icon>
          </Button>
        )}
        <Button iconOnly variant="default-outline" size="small" onClick={moveRight}
          disabled={disabled || leftChecked.length === 0} aria-label="Move selected right">
          <Icon size="small"><ChevronRightIcon /></Icon>
        </Button>
        <Button iconOnly variant="default-outline" size="small" onClick={moveLeft}
          disabled={disabled || rightChecked.length === 0} aria-label="Move selected left">
          <Icon size="small"><ChevronLeftIcon /></Icon>
        </Button>
        {isEnhanced && (
          <Button iconOnly variant="default-outline" size="small" onClick={moveAllLeft}
            disabled={disabled || right.length === 0} aria-label="Move all left">
            <Icon size="small"><KeyboardDoubleArrowLeftIcon /></Icon>
          </Button>
        )}
      </Box>

      {renderPanel(rightTitle, right, rightChecked)}
    </Box>
  );
}

export default TransferList;
