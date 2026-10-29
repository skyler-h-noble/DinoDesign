// src/components/SearchField/SearchField.js
import React, { useState, useRef } from 'react';
import SearchIcon from '@omni-design/icons/Search';
import CloseIcon from '@omni-design/icons/Close';
import { Icon } from '../Icon/Icon';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';

/**
 * SearchField Component
 *
 * STRUCTURE:
 *   <Box border="1px solid var(--Buttons-{C}-Border)">   — outer border shell
 *     <Box data-surface="Container">                      — surface scoping
 *       <Icon><SearchIcon /></Icon>
 *       <input />
 *       <Icon><CloseIcon /></Icon>  (when has value)
 *     </Box>
 *   </Box>
 *
 * COLORS: default | primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * SIZES: small | medium | large (matches button heights)
 *
 * Accessibility:
 *   role="searchbox", aria-label
 *   Clear: aria-label="Clear search"
 *   Escape clears, Enter submits
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SIZE_MAP = {
  small:  { height: 'var(--Small-Button-Height)', fontSize: '13px', iconSize: 18, px: 12 },
  medium: { height: 'var(--Button-Height)',        fontSize: '14px', iconSize: 20, px: 16 },
  large:  { height: 'var(--Large-Button-Height)',  fontSize: '15px', iconSize: 22, px: 16 },
};
const RADIUS = {
  small: 'var(--Sm-Input-Radius, var(--Input-Radius, var(--Style-Border-Radius)))',
  medium: 'var(--Input-Radius, var(--Style-Border-Radius))',
  large: 'var(--Lg-Input-Radius, var(--Input-Radius, var(--Style-Border-Radius)))',
};

/* Static sheet — the five MUI Box sx blocks this was built from, as plain
   rules. The palette arrives as custom properties declared on the root
   (--_sf-bd / -hv / -pr border, --_sf-act the active text); nothing between
   the root and the parts sets a data-theme, so they resolve against the same
   scope the parts named them in. State rules weigh one class + one
   pseudo-class, as emotion's did; hover / pressed stay off a disabled field
   (.omni-sf-off), which the sx left them out of. */
const SxBox = lazySxBox('SearchField');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
const SZ = { small: 'sm', medium: 'md', large: 'lg' };

/* Emotion's prefixer wrote the old flexbox aliases next to align-items and
   justify-content; Chrome still computes them (-webkit-box-align / -pack), so
   the sheet writes them too. */
const wk = (css) => css
  .replace(/(^|[{;])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
  .replace(/(^|[{;])justify-content:([^;}]+)/g, (m, p, v) => p + '-webkit-box-pack:' + v.replace(/^flex-/, '').replace(/^space-between$/, 'justify') + ';justify-content:' + v);
registerStaticStyles('omni-searchfield', wk([
  '.omni-sf{display:flex;box-sizing:border-box}',
  '.omni-sf-shell{border:1px solid var(--_sf-bd);overflow:hidden;opacity:1;transition:border-color 0.15s ease, box-shadow 0.15s ease;box-shadow:none;width:100%}',
  ...Object.entries(SZ).map(([size, k]) => `.omni-sf-shell-${k}{border-radius:${RADIUS[size]}}`),
  '.omni-sf-off .omni-sf-shell{opacity:var(--Disabled, 0.38)}',
  '.omni-sf-shell:where(:not(.omni-sf-shell-off)):hover{border-color:var(--_sf-hv)}',
  '.omni-sf-shell:where(:not(.omni-sf-shell-off)):active{border-color:var(--_sf-pr)}',
  '.omni-sf-shell:focus-within{outline:2px solid var(--Focus-Visible);outline-offset:2px}',
  '.omni-sf-field{display:flex;align-items:center;gap:8px;width:100%;box-sizing:border-box;background-color:var(--Hover)}',
  ...Object.entries(SZ).map(([size, k]) => `.omni-sf-field-${k}{min-height:${SIZE_MAP[size].height};padding-left:${SIZE_MAP[size].px}px;padding-right:${SIZE_MAP[size].px}px}`),
  /* Two classes: the Icon's own colour rule is one. */
  '.omni-sf .omni-sf-icon{color:var(--Quiet);flex-shrink:0;transition:color 0.15s ease}',
  '.omni-sf .omni-sf-icon-on{color:var(--_sf-act)}',
  '.omni-sf-input{flex:1;border:none;outline:none;background-color:transparent;color:var(--Quiet);'
    + 'font-family:var(--Body-Font-Family);font-weight:var(--Body-Font-Weight);min-width:0}',
  ...Object.entries(SZ).map(([size, k]) => `.omni-sf-input-${k}{font-size:${SIZE_MAP[size].fontSize}}`),
  '.omni-sf-input-on{color:var(--_sf-act)}',
  '.omni-sf-input::placeholder{color:var(--Quiet);opacity:1;font-family:var(--Body-Font-Family);font-weight:var(--Body-Font-Weight)}',
  '.omni-sf-input:disabled{cursor:not-allowed}',
  '.omni-sf-clear{display:flex;align-items:center;justify-content:center;border-radius:50%;border:none;background-color:transparent;'
    + 'color:var(--Quiet);cursor:pointer;flex-shrink:0;padding:0;transition:color 0.15s ease, background-color 0.15s ease}',
  ...Object.entries(SZ).map(([size, k]) => `.omni-sf-clear-${k}{width:${SIZE_MAP[size].iconSize + 4}px;height:${SIZE_MAP[size].iconSize + 4}px}`),
  '.omni-sf-clear:hover{background-color:var(--Hover);color:var(--_sf-act)}',
  '.omni-sf-clear:active{background-color:var(--Pressed);color:var(--_sf-act)}',
  '.omni-sf-clear:focus-visible{outline:2px solid var(--Focus-Visible);outline-offset:1px}',
].join('\n')));

export function SearchField({
  value: controlledValue,
  defaultValue = '',
  onChange,
  onFocus,
  onBlur,
  onClear,
  onSubmit,
  placeholder = 'Search\u2026',
  size = 'medium',
  color = 'default',
  showClearButton = true,
  disabled = false,
  ariaLabel = 'Search',
  className = '',
  sx = {},
  style,
  ...props
}) {
  useStaticStyles('omni-searchfield');
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  const hasValue = currentValue.length > 0;
  const isActive = focused || hasValue;

  const effectiveColor = color === 'default' ? 'primary' : color;
  const C = cap(effectiveColor);
  const borderToken = 'var(--Buttons-' + C + '-Border)';
  const activeTextColor = color === 'default' ? 'var(--Text)' : 'var(--Text-' + C + ')';

  const k = SZ[size] || 'md';

  const handleChange = (e) => {
    const val = e.target.value;
    if (!isControlled) setInternalValue(val);
    onChange?.(val, e);
  };

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue('');
    onChange?.('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSubmit?.(currentValue, e);
    if (e.key === 'Escape' && hasValue) handleClear();
  };

  const rootProps = {
    className: 'MuiBox-root search-field search-field-' + size +
      (focused ? ' search-field-focused' : '') +
      (hasValue ? ' search-field-filled' : '') +
      (disabled ? ' search-field-disabled' : '') +
      (className ? ' ' + className : '') +
      ' omni-sf' + (disabled ? ' omni-sf-off' : ''),
    style: {
      '--_sf-bd': borderToken,
      '--_sf-hv': 'var(--Buttons-' + C + '-Hover)',
      '--_sf-pr': 'var(--Buttons-' + C + '-Pressed)',
      '--_sf-act': activeTextColor,
      ...style,
    },
    ...props,
  };
  const body = (
    <>
      {/* Outer border shell — size-aware Input-Radius so each size rounds
          by its own height, not the medium button's. Hover and pressed move
          the BORDER, matching Input: this field's resting background is
          already --Hover, so a background scrim would paint --Hover over
          --Hover and show nothing. Off while disabled: :hover still MATCHES a
          disabled field, so an unguarded rule lights up a control that cannot
          be used. */}
      <div className={'MuiBox-root omni-sf-shell omni-sf-shell-' + k + (disabled ? ' omni-sf-shell-off' : '')}>

      {/* Inner field. No data-surface — inherits parent's surface so the
          field's background blends with the surrounding container. Uses
          --Hover (a subtle tint of the parent surface) for affordance
          without dragging the brand --Background through. */}
      <div className={'MuiBox-root omni-sf-field omni-sf-field-' + k}>
        <Icon size="small" className={'MuiBox-root omni-sf-icon' + (isActive ? ' omni-sf-icon-on' : '')}>
          <SearchIcon />
        </Icon>

        <input
          ref={inputRef}
          type="text"
          role="searchbox"
          aria-label={ariaLabel}
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={'MuiBox-root omni-sf-input omni-sf-input-' + k + (isActive ? ' omni-sf-input-on' : '')}
        />

        {showClearButton && hasValue && !disabled && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            className={'MuiBox-root omni-sf-clear omni-sf-clear-' + k}
          >
            <Icon size="small"><CloseIcon /></Icon>
          </button>
        )}
      </div>

      </div>{/* end outer border shell */}
    </>
  );
  return hasSx(sx) ? <SxBox sx={sx} {...rootProps}>{body}</SxBox> : <div {...rootProps}>{body}</div>;
}

export default SearchField;
