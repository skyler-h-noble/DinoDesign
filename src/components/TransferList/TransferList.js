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
import { Divider } from '../Divider/Divider';
import { BodySmall, Caption } from '../Typography';
import { SHADOW_LEVEL_2 } from '../_shadows';

/**
 * TransferList Component — Figma-aligned
 *
 * STRUCTURE (per panel):
 *   <fill> ← outer flex slot
 *     <hug + Card-Radius + Level-2 shadow> ← elevation wrapper
 *       <Container surface + bg + 1px border + Card-Radius, vstack> ← frame
 *         Header   (min-h 40, hstack, left-top, BodySmall bold title + quiet count)
 *         Divider  (horizontal, default color → --Border-Variant, size small)
 *         List     (vstack, gap 16, padding 12/16)
 *
 * Between the two panels: a vstack Button Container (gap 8, padding 8).
 * Outer layout: hstack, centered, gap 4. Available + Chosen are fill.
 *
 * MODES:
 *   basic      2 move buttons (one each direction)
 *   enhanced   4 move buttons + select-all header checkbox
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
    const countText = isEnhanced
      ? checkedItems.length + '/' + items.length
      : items.length + ' items';

    return (
      // OUTER: fill — the panel takes equal share of the parent row.
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* MIDDLE: hug, Card-Radius, Level-2 shadow */}
        <Box sx={{
          borderRadius: 'var(--Card-Radius)',
          boxShadow: SHADOW_LEVEL_2,
        }}>
          {/* INNER FRAME: Container surface, bg, 1px border, Card-Radius,
              vstack with no gap. Header → Divider → List flow. */}
          <Box
            data-surface="Container"
            sx={{
              backgroundColor: 'var(--Background)',
              border: '1px solid var(--Border)',
              borderRadius: 'var(--Card-Radius)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              opacity: disabled ? 0.5 : 1,
            }}
          >
            {/* HEADER — min-h 40, hstack, left/top aligned */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              gap: 1,
              minHeight: '40px',
              padding: '12px 16px',
            }}>
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
              {/* Left title — fill, BodySmall bold, --Text */}
              <BodySmall style={{ flex: 1, fontWeight: 700, color: 'var(--Text)' }}>
                {title}
              </BodySmall>
              {/* Right title — hug, Caption, --Quiet */}
              <Caption style={{ color: 'var(--Quiet)' }}>
                {countText}
              </Caption>
            </Box>

            {/* DIVIDER — horizontal, default color (resolves to --Border-Variant), small */}
            <Divider orientation="horizontal" color="default" size="small" />

            {/* LIST — vstack, gap 16, padding 12px 16px */}
            <Box
              component="ul"
              role="list"
              sx={{
                m: 0,
                listStyle: 'none',
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                overflowY: 'auto',
                maxHeight: 240,
              }}
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: disabled ? 'not-allowed' : 'pointer',
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
                <Box component="li" sx={{ p: 2, textAlign: 'center' }}>
                  <Caption style={{ color: 'var(--Quiet)' }}>No items</Caption>
                </Box>
              )}
            </Box>
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
        // hstack, centered both axes, gap 4. Available + Chosen are fill (set
        // via flex: 1 on each renderPanel root).
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        fontFamily: 'inherit',
        ...sx,
      }}
      {...props}
    >
      {renderPanel(leftTitle, left, leftChecked)}

      {/* Button Container — vstack, gap 8, padding 8. 2 buttons in basic
          mode; 4 buttons (with move-all) in enhanced mode. */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '8px',
        flexShrink: 0,
      }}>
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
