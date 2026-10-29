// src/components/Autocomplete/Autocomplete.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ExpandMoreIcon from '@omni-design/icons/ExpandMore';
import CloseIcon from '@omni-design/icons/Close';
import CheckIcon from '@omni-design/icons/Check';
import { Icon } from '../Icon/Icon';
import { Body, BodySmall } from '../Typography';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

/**
 * Autocomplete Component
 *
 * VARIANTS:
 *   outline   Outer border shell. Sets NO data-surface — it inherits the
 *             surface it is placed on, so the field matches its container
 *             rather than pinning one level.
 *
 * There was a `light` variant. The docblock described it as
 * data-theme="{C}-Light" + data-surface="Surface-Dim" — a theme shade that no
 * longer exists, for a behaviour the code never implemented: `isLight` was
 * computed and read by no code path, so the prop was accepted and changed
 * nothing but a class name. Documented behaviour and actual behaviour were
 * both wrong, in different directions.
 *
 * For a lighter Autocomplete, put it on data-surface="Surface-Brightest"
 *
 * COLORS: default | primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * LABEL: top | floating | none
 * SIZES: small | medium | large (matches button heights)
 * ASYNC: loading prop shows spinner
 * FEATURES: clearable, freeSolo, disabled, helper text
 *
 * Focus: outline on outer shell via :focus-within
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SIZE_MAP = {
  small:  { height: 'var(--Small-Button-Height)', fontSize: '13px', padding: '4px 8px', iconSize: 16 },
  medium: { height: 'var(--Button-Height)',        fontSize: '14px', padding: '6px 12px', iconSize: 18 },
  large:  { height: 'var(--Large-Button-Height)',  fontSize: '16px', padding: '8px 16px', iconSize: 20 },
};

const FLOATING_SIZE_MAP = {
  small:  { height: '48px', fontSize: '13px', padding: '20px 12px 4px', leftPad: 12 },
  medium: { height: '56px', fontSize: '14px', padding: '22px 14px 6px', leftPad: 14 },
  large:  { height: '64px', fontSize: '16px', padding: '24px 16px 6px', leftPad: 16 },
};

/* Static sheet — the MUI Box sx blocks this was built from, as plain rules.
   The size tables generate one class per size (standard and floating); the
   palette's active text arrives as a custom property declared on the root
   (--_ac-act). State rules weigh one class + one pseudo-class, as emotion's
   did. The loading spinner was MUI's CircularProgress (indeterminate, 16px):
   its markup, classes and animation are reproduced here, so a loading field
   no longer pulls in MUI. */
const SxBox = lazySxBox('Autocomplete');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
const RADIUS = {
  small: 'var(--Sm-Input-Radius, var(--Input-Radius, var(--Style-Border-Radius)))',
  medium: 'var(--Input-Radius, var(--Style-Border-Radius))',
  large: 'var(--Lg-Input-Radius, var(--Input-Radius, var(--Style-Border-Radius)))',
};
const sizeRules = (tag, map) => Object.entries(map).map(([size, c]) => [
  `.omni-ac-row-${tag}${size}{min-height:${c.height}}`,
  `.omni-ac-in-${tag}${size}{font-size:${c.fontSize};padding:${c.padding}}`,
  `.omni-ac-opt-${tag}${size}{min-height:${c.height};font-size:${c.fontSize}}`,
  `.omni-ac-msg-${tag}${size}{font-size:${c.fontSize}}`,
  c.leftPad ? `.omni-ac-fl-${size}{left:${c.leftPad}px;font-size:${c.fontSize}}` : '',
].filter(Boolean).join('\n')).join('\n');

/* Emotion's prefixer wrote the old flexbox aliases next to align-items and
   justify-content; Chrome still computes them (-webkit-box-align / -pack), so
   the sheet writes them too. */
const wk = (css) => css
  .replace(/(^|[{;])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
  .replace(/(^|[{;])justify-content:([^;}]+)/g, (m, p, v) => p + '-webkit-box-pack:' + v.replace(/^flex-/, '').replace(/^space-between$/, 'justify') + ';justify-content:' + v);
registerStaticStyles('omni-autocomplete', wk([
  '.omni-ac{position:relative;width:auto;display:inline-block;font-family:inherit}',
  '.omni-ac-full{width:100%}',
  /* Outer border shell — size-aware Input-Radius so each size rounds by its
     own height, not the medium button's. */
  '.omni-ac-shell{border:1px solid var(--Border);overflow:hidden;transition:border-color 0.15s ease;box-shadow:none;opacity:1}',
  ...Object.entries(RADIUS).map(([size, r]) => `.omni-ac-shell-${size}{border-radius:${r}}`),
  '.omni-ac-shell-off{opacity:var(--Disabled, 0.38)}',
  '.omni-ac-shell:focus-within{outline:2px solid var(--Focus-Visible);outline-offset:2px}',
  /* Input container — uses --Hover for affordance against parent surface. */
  '.omni-ac-row{position:relative;display:flex;align-items:center;background-color:var(--Hover)}',
  sizeRules('s', SIZE_MAP),
  sizeRules('f', FLOATING_SIZE_MAP),
  '.omni-ac-fl{position:absolute;top:50%;transform:translateY(-50%);transform-origin:top left;color:var(--Quiet);font-weight:400;'
    + 'pointer-events:none;z-index:1;transition:top 0.15s ease, transform 0.15s ease, color 0.15s ease}',
  '.omni-ac-fl-up{top:6px;transform:scale(0.75)}',
  '.omni-ac-fl-focus{color:var(--_ac-act)}',
  '.omni-ac-in{flex:1;border:none;outline:none;background-color:transparent;color:var(--Quiet);'
    + 'font-family:var(--Body-Font-Family);font-weight:var(--Body-Font-Weight);min-width:0}',
  '.omni-ac-in-on{color:var(--_ac-act)}',
  '.omni-ac-in::placeholder{color:var(--Quiet);opacity:1;font-family:var(--Body-Font-Family);font-weight:var(--Body-Font-Weight)}',
  '.omni-ac-in:disabled{cursor:not-allowed}',
  /* MUI CircularProgress, indeterminate — with the sx it was given. */
  '@keyframes omni-ac-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}',
  '@keyframes omni-ac-dash{0%{stroke-dasharray:1px, 200px;stroke-dashoffset:0}50%{stroke-dasharray:100px, 200px;stroke-dashoffset:-15px}'
    + '100%{stroke-dasharray:1px, 200px;stroke-dashoffset:-126px}}',
  '.omni-ac-spin{display:inline-block;animation:omni-ac-spin 1.4s linear infinite;color:var(--Quiet);margin-right:8px}',
  '.omni-ac-spin-svg{display:block}',
  '.omni-ac-spin-circle{stroke:currentColor;stroke-dasharray:80px, 200px;stroke-dashoffset:0;animation:omni-ac-dash 1.4s ease-in-out infinite}',
  '.omni-ac-clear{display:flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;margin-right:4px;'
    + 'border:none;background-color:transparent;color:var(--Quiet);cursor:pointer}',
  '.omni-ac-clear-hidden{visibility:hidden}',
  '.omni-ac-clear:hover{color:var(--Text);background-color:var(--Hover)}',
  '.omni-ac-clear:focus-visible{outline:2px solid var(--Focus-Visible)}',
  '.omni-ac-chev{display:flex;align-items:center;justify-content:center;width:28px;height:100%;border:none;background-color:transparent;'
    + 'color:var(--Quiet);cursor:pointer}',
  '.omni-ac-chev-off{cursor:not-allowed}',
  '.omni-ac-help{font-size:12px;color:var(--Quiet);margin-top:4px;margin-left:2px}',
  /* The floating panel's corner, as Select's: min(Input, Card, 16px). */
  '.omni-ac-list{position:absolute;top:100%;left:0;right:0;margin-top:4px;background-color:var(--Hover);border:1px solid var(--Border);'
    + 'border-radius:var(--Dropdown-Frame-Radius, var(--Input-Radius, var(--Style-Border-Radius, 4px)));box-shadow:none;'
    + 'z-index:9999;max-height:240px;overflow-y:auto;padding-top:4px;padding-bottom:4px}',
  '.omni-ac-msg{padding-left:12px;padding-right:12px;padding-top:16px;padding-bottom:16px;text-align:center;color:var(--Quiet)}',
  '.omni-ac-opt{display:flex;align-items:center;gap:8px;padding-left:12px;padding-right:12px;padding-top:0px;padding-bottom:0px;'
    + 'margin-left:4px;margin-right:4px;border-radius:4px;cursor:pointer;font-family:inherit;'
    + 'background-color:transparent;color:var(--Text-Quiet);transition:background-color 0.1s ease}',
  '.omni-ac-opt-hl{background-color:var(--Hover);color:var(--Text)}',
  '.omni-ac-opt-sel{background-color:transparent;color:var(--Text);font-weight:600}',
  '.omni-ac-opt:active{background-color:var(--Pressed)}',
  /* Two classes: the Icon's own rule is one. */
  '.omni-ac .omni-ac-check{opacity:0.6;flex-shrink:0}',
].join('\n')));

export function Autocomplete({
  options = [],
  value: controlledValue,
  defaultValue = null,
  onChange,
  inputValue: controlledInputValue,
  onInputChange,
  label,
  labelPosition = 'top',
  placeholder = 'Type to search',
  helperText,
  size = 'medium',
  variant = 'outline',         // 'outline' — `light` was removed, see above
  color = 'primary',           // 'default' | 'primary' | ...
  loading = false,
  loadingText = 'Loading\u2026',
  noOptionsText = 'No options',
  freeSolo = false,
  clearable = true,
  disabled = false,
  fullWidth = false,
  className = '',
  sx = {},
  style,
  ...props
}) {
  useStaticStyles('omni-autocomplete');
  const effectiveColor = color === 'default' ? 'primary' : color;
  const C = cap(effectiveColor);
  if (process.env.NODE_ENV !== 'production' && variant === 'light') {
    // eslint-disable-next-line no-console
    console.warn(
      '[Autocomplete] variant="light" was removed and had never done anything '
      + '— it was read by no code path. For a lighter Autocomplete use '
      + 'data-surface="Surface-Brightest" on its container.',
    );
  }
  const effectiveVariant = variant === 'light' ? 'outline' : variant;
  /* Edges are the neutral --Border: the color marks the SELECTION, not the
     frame, so field and panel read as one control at the 3:1 an edge needs. */
  const borderToken = 'var(--Border)';
  const activeTextColor = color === 'default' ? 'var(--Text)' : 'var(--Text-' + C + ')';

  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalInput, setInternalInput] = useState(
    defaultValue ? (typeof defaultValue === 'string' ? defaultValue : defaultValue.label || '') : ''
  );
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const isControlledValue = controlledValue !== undefined;
  const isControlledInput = controlledInputValue !== undefined;
  const currentValue = isControlledValue ? controlledValue : internalValue;
  const currentInput = isControlledInput ? controlledInputValue : internalInput;

  const isFloating = labelPosition === 'floating';
  const isTop = labelPosition === 'top';
  const hasValue = currentInput !== '';
  const sizeKey = (isFloating ? FLOATING_SIZE_MAP : SIZE_MAP)[size] ? size : 'medium';
  const sz = (isFloating ? 'f' : 's') + sizeKey;

  // Filter options
  const filtered = currentInput
    ? options.filter((opt) => {
        const lbl = typeof opt === 'string' ? opt : opt.label;
        return lbl.toLowerCase().includes(currentInput.toLowerCase());
      })
    : options;

  const setInput = useCallback((val) => {
    if (!isControlledInput) setInternalInput(val);
    onInputChange?.(val);
  }, [isControlledInput, onInputChange]);

  const selectOption = useCallback((opt) => {
    const lbl = typeof opt === 'string' ? opt : opt.label;
    if (!isControlledValue) setInternalValue(opt);
    setInput(lbl);
    onChange?.(opt);
    setOpen(false);
    setHighlightIndex(-1);
    inputRef.current?.focus();
  }, [isControlledValue, onChange, setInput]);

  const clearValue = () => {
    if (!isControlledValue) setInternalValue(null);
    setInput('');
    onChange?.(null);
    inputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!open) setOpen(true);
    setHighlightIndex(-1);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Keyboard
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      setHighlightIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    }
    if (e.key === 'Enter' && open && highlightIndex >= 0 && filtered[highlightIndex]) {
      e.preventDefault();
      selectOption(filtered[highlightIndex]);
    }
  };

  const rootProps = {
    ref: wrapperRef,
    className: 'MuiBox-root autocomplete autocomplete-' + size + ' autocomplete-variant-' + effectiveVariant +
      (open ? ' autocomplete-open' : '') +
      (disabled ? ' autocomplete-disabled' : '') +
      (className ? ' ' + className : '') +
      ' omni-ac' + (fullWidth ? ' omni-ac-full' : ''),
    style: { '--_ac-act': activeTextColor, ...style },
    ...props,
  };
  const radiusKey = size === 'small' || size === 'large' ? size : 'medium';
  const raised = hasValue || focused;

  const body = (
    <>
      {/* Top label */}
      {isTop && label && (() => {
        const LabelComp = size === 'small' ? BodySmall : Body;
        return (
          <LabelComp
            component="label"
            style={{
              /* Start-aligned whatever the page's text-align — a label sits on
                 the field's leading edge, and a centred container centred it. */
              display: 'block', marginBottom: '6px', textAlign: 'start',
              color: disabled ? 'var(--Quiet)' : 'var(--Text)',
              fontWeight: 500,
              opacity: disabled ? 'var(--Disabled, 0.38)' : 1,
            }}
          >
            {label}
          </LabelComp>
        );
      })()}

      <div className={'MuiBox-root omni-ac-shell omni-ac-shell-' + radiusKey + (disabled ? ' omni-ac-shell-off' : '')}>

      {/* Inner wrapper — no data-surface so the field inherits parent
          scope and doesn't drag the brand --Background through. */}
      <div className="MuiBox-root">

      <div className={'MuiBox-root omni-ac-row omni-ac-row-' + sz}>
        {/* Floating label */}
        {isFloating && label && (
          <div className={'MuiBox-root omni-ac-fl omni-ac-fl-' + sizeKey + (raised ? ' omni-ac-fl-up' : '') + (focused ? ' omni-ac-fl-focus' : '')}>
            {label}
          </div>
        )}

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-label={label || placeholder}
          autoComplete="off"
          value={currentInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { setFocused(true); setOpen(true); }}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder={isFloating ? undefined : placeholder}
          className={'MuiBox-root omni-ac-in omni-ac-in-' + sz + (raised ? ' omni-ac-in-on' : '')}
        />

        {/* Loading spinner */}
        {loading && open && (
          <span className="MuiCircularProgress-root MuiCircularProgress-indeterminate MuiCircularProgress-colorPrimary omni-ac-spin"
            style={{ width: 16, height: 16 }} role="progressbar">
            <svg className="MuiCircularProgress-svg omni-ac-spin-svg" viewBox="22 22 44 44">
              <circle className="MuiCircularProgress-circle MuiCircularProgress-circleIndeterminate omni-ac-spin-circle"
                cx={44} cy={44} r={20.2} fill="none" strokeWidth={3.6} />
            </svg>
          </span>
        )}

        {/* Clear button. Its space is ALWAYS reserved, and it only becomes
            visible with a value: the field must not change width as the user
            types — appearing in the flow, it widened the field by 24px on
            the first keystroke and shoved everything beside it. Hidden, it is
            out of the tab order and the accessibility tree. */}
        {clearable && !disabled && (
          <button type="button" aria-label="Clear" onClick={clearValue}
            tabIndex={currentInput ? 0 : -1}
            aria-hidden={currentInput ? undefined : true}
            className={'MuiBox-root omni-ac-clear' + (currentInput ? '' : ' omni-ac-clear-hidden')}>
            <CloseIcon sx={{ fontSize: 14 }} />
          </button>
        )}

        {/* Chevron */}
        <button type="button" aria-label={open ? 'Close' : 'Open'} tabIndex={-1}
          onClick={() => { if (!disabled) setOpen(!open); }}
          className={'MuiBox-root omni-ac-chev' + (disabled ? ' omni-ac-chev-off' : '')}>
          <ExpandMoreIcon sx={{
            fontSize: ((isFloating ? undefined : SIZE_MAP[sizeKey].iconSize) || 18) + 'px',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }} />
        </button>
      </div>

      </div>{/* end inner themed surface */}
      </div>{/* end outer border shell */}

      {/* Helper text */}
      {helperText && (
        <div className="MuiBox-root omni-ac-help">{helperText}</div>
      )}

      {/* Dropdown */}
      {open && (
        <div role="listbox" aria-label={label || 'Options'} className="MuiBox-root omni-ac-list">
          {loading ? (
            <div className={'MuiBox-root omni-ac-msg omni-ac-msg-' + sz}>
              {loadingText}
            </div>
          ) : filtered.length === 0 ? (
            <div className={'MuiBox-root omni-ac-msg omni-ac-msg-' + sz}>
              {noOptionsText}
            </div>
          ) : (
            filtered.map((opt, idx) => {
              const optLabel = typeof opt === 'string' ? opt : opt.label;
              const optValue = typeof opt === 'string' ? opt : opt.value;
              const selectedLabel = currentValue ? (typeof currentValue === 'string' ? currentValue : currentValue.label) : null;
              const isSelected = optLabel === selectedLabel;
              const isHighlighted = idx === highlightIndex;

              return (
                <div key={optValue || optLabel} role="option" aria-selected={isSelected}
                  onClick={() => selectOption(opt)}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  className={'MuiBox-root omni-ac-opt omni-ac-opt-' + sz
                    + (isSelected ? ' omni-ac-opt-sel' : (isHighlighted ? ' omni-ac-opt-hl' : ''))}>
                  <BodySmall style={{ flex: 1, color: 'inherit', fontWeight: 'inherit' }}>{optLabel}</BodySmall>
                  {isSelected && <Icon size="small" className="MuiBox-root omni-ac-check"><CheckIcon /></Icon>}
                </div>
              );
            })
          )}
        </div>
      )}
    </>
  );
  return hasSx(sx) ? <SxBox sx={sx} {...rootProps}>{body}</SxBox> : <div {...rootProps}>{body}</div>;
}

export default Autocomplete;
