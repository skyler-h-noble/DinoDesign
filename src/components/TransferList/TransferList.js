// src/components/TransferList/TransferList.js
import React, { useState, useCallback } from 'react';
import ChevronRightIcon from '@omni-design/icons/ChevronRight';
import ChevronLeftIcon from '@omni-design/icons/ChevronLeft';
import KeyboardDoubleArrowRightIcon from '@omni-design/icons/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@omni-design/icons/KeyboardDoubleArrowLeft';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Checkbox } from '../Checkbox/Checkbox';
import { Divider } from '../Divider/Divider';
import { BodySmall, Caption } from '../Typography';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

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

/* Static sheet — the MUI Box sx blocks of the panels, the list and the
   button column, as plain rules. */
const SxBox = lazySxBox('TransferList');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);

/* Emotion's prefixer wrote the old flexbox aliases next to align-items and
   justify-content; Chrome still computes them (-webkit-box-align / -pack), so
   the sheet writes them too. */
const wk = (css) => css
  .replace(/(^|[{;])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
  .replace(/(^|[{;])justify-content:([^;}]+)/g, (m, p, v) => p + '-webkit-box-pack:' + v.replace(/^flex-/, '').replace(/^space-between$/, 'justify') + ';justify-content:' + v);
registerStaticStyles('omni-transferlist', wk([
  /* TOP-ALIGNED, not centred: the two panels rarely hold the same number of
     rows, and their headers are the pair a reader compares. Start-aligned
     whatever the page centres. */
  '.omni-tl{display:flex;flex-direction:row;align-items:flex-start;justify-content:center;gap:4px;font-family:inherit;text-align:start}',
  /* OUTER: fill — equal share of the row, never narrower than 200 (or the
     row, on a phone). */
  '.omni-tl-slot{flex:1 1 200px;min-width:min(200px, 100%)}',
  '.omni-tl-hug{border-radius:var(--Card-Radius);box-shadow:none}',
  '.omni-tl-frame{background-color:var(--Background);border:1px solid var(--Border);border-radius:var(--Card-Radius);overflow:hidden;'
    + 'display:flex;flex-direction:column;gap:0;opacity:1}',
  '.omni-tl-frame-off{opacity:var(--Disabled, 0.38)}',
  /* 40 IS THE HEIGHT, not the height before padding (border-box). */
  '.omni-tl-head{display:flex;flex-direction:row;align-items:flex-start;justify-content:flex-start;gap:8px;box-sizing:border-box;min-height:40px;padding:12px 16px}',
  '.omni-tl-list{margin:0;list-style:none;padding:12px 16px;display:flex;flex-direction:column;gap:16px;overflow-y:auto;max-height:240px}',
  '.omni-tl-item{display:flex;align-items:center;gap:8px;cursor:pointer}',
  '.omni-tl-item-off{cursor:not-allowed}',
  /* Two classes: the Checkbox sheet's own pointer-events rules are one (plus
     a state class), and the row takes the click. */
  '.omni-tl .omni-tl-check{pointer-events:none}',
  '.omni-tl-empty{padding:16px;text-align:center}',
  /* Button Container — centred against the TALLER panel. */
  '.omni-tl-buttons{display:flex;flex-direction:column;gap:8px;padding:8px;flex-shrink:0;align-self:center}',
].join('\n')));

function not(a, b) { return a.filter((v) => !b.includes(v)); }
function intersection(a, b) { return a.filter((v) => b.includes(v)); }

/* ZONE PROPS — `theme` and `surface`.
 *
 * They become data-theme / data-surface on the root, which redefines
 * --Background, --Text, --Border, --Quiet, --Hover and --Pressed for
 * everything inside, so the component takes its colors from the zone it sits
 * in rather than from a prop.
 *
 * Deliberately NOT derived from `color`: that chooses which PALETTE a filled
 * part draws from, while `theme` moves the whole surface, including the parts
 * carrying a contrast requirement that have to stay on zone tokens.
 *
 * Undefined when not passed, so the component INHERITS its ancestor's zone. */
export function TransferList({
  theme,
  surface,
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
  useStaticStyles('omni-transferlist');
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
      : items.length + (items.length === 1 ? ' item' : ' items');

    return (
      // OUTER: fill — the panel takes equal share of the parent row, and is
      // never narrower than 200 (or the row, on a phone). Hugging its content,
      // a short list shrank until "Available · 2 items" wrapped onto two lines
      // and the two panels came out different widths.
      <div className="MuiBox-root omni-tl-slot">
        {/* MIDDLE: hug, Card-Radius, no shadow (inputs & dropdowns are flat) */}
        <div className="MuiBox-root omni-tl-hug">
          {/* INNER FRAME: Container surface, bg, 1px border, Card-Radius,
              vstack with no gap. Header → Divider → List flow. */}
          <div
            data-surface="Container"
            className={'MuiBox-root omni-tl-frame' + (disabled ? ' omni-tl-frame-off' : '')}
          >
            {/* HEADER — min-h 40, hstack, left/top aligned */}
            <div className="MuiBox-root omni-tl-head">
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
              <Caption style={{ color: 'var(--Quiet)', whiteSpace: 'nowrap' }}>
                {countText}
              </Caption>
            </div>

            {/* DIVIDER — horizontal, default color (resolves to --Border-Variant), small */}
            <Divider orientation="horizontal" color="default" size="small" />

            {/* LIST — vstack, gap 16, padding 12px 16px */}
            <ul role="list" className="MuiBox-root omni-tl-list">
              {items.map((item) => {
                const isItemChecked = checked.includes(item);
                return (
                  <li
                    key={item}
                    role="listitem"
                    onClick={() => handleToggle(item)}
                    className={'MuiBox-root omni-tl-item' + (disabled ? ' omni-tl-item-off' : '')}
                  >
                    <Checkbox
                      size="small"
                      variant="default-outline"
                      checked={isItemChecked}
                      onChange={() => handleToggle(item)}
                      disabled={disabled}
                      aria-label={'Select ' + item}
                      className="MuiBox-root omni-tl-check"
                    />
                    <BodySmall style={{ color: 'var(--Text)', flex: 1 }}>{item}</BodySmall>
                  </li>
                );
              })}
              {items.length === 0 && (
                <li className="MuiBox-root omni-tl-empty">
                  <Caption style={{ color: 'var(--Quiet)' }}>No items</Caption>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const rootProps = {
    className:
      'MuiBox-root transfer-list transfer-list-' + mode +
      (disabled ? ' transfer-list-disabled' : '') +
      (className ? ' ' + className : '') + ' omni-tl',
    'data-theme': theme || undefined,
    'data-surface': surface || undefined,
    role: 'group',
    'aria-label': 'Transfer list',
    ...props,
  };
  const Root = hasSx(sx) ? SxBox : 'div';

  return (
    <Root {...(hasSx(sx) ? { sx } : {})} {...rootProps}>
      {renderPanel(leftTitle, left, leftChecked)}

      {/* Button Container — vstack, gap 8, padding 8. 2 buttons in basic
          mode; 4 buttons (with move-all) in enhanced mode. */}
      <div className="MuiBox-root omni-tl-buttons">
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
      </div>

      {renderPanel(rightTitle, right, rightChecked)}
    </Root>
  );
}

export default TransferList;
