// src/components/Select/Select.js
import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import ReactDOM from 'react-dom';
import { Swatch } from '../Swatch/Swatch';
import { Icon } from '../Icon/Icon';
import { BodySmall } from '../Typography';
import { FormLabel } from '../FormLabel/FormLabel';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import { Glyph, SVG_ICON_DECLS } from '../_glyph';

/**
 * Select Component
 *
 * MODES: standard (text), color (swatches)
 * LABEL: top | left | floating | none — Figma's SelectField: label-top (Sizing-Half
 *   below the label), label-left (Sizing-1 beside it, centred), none
 * SIZES: small (32/48px), medium (40/56px), large (56/64px)
 * SELECTION STYLE: default | solid
 *
 * There was a `light` style. It is gone with the -Light button shades it
 * named: --Buttons-{C}-Light-{Button,Text,Border} are published by no design
 * system and none of the three carried a fallback, so all three declarations
 * were invalid at computed-value time and a selected option rendered
 * unstyled — no fill, no text color, no border. For a lighter selected row,
 * put the dropdown on data-surface="Surface-Brightest" and keep the style.
 *
 * NOTE: `default` and `solid` currently return identical styles. They are kept
 * apart because the rendered class (select-style-default / -solid) is a
 * consumer-facing hook, so a stylesheet outside this file can still select
 * between them — which is the test for redundancy, not whether the values
 * match. If nothing turns out to target those classes, the prop should go.
 * DIVIDERS: optional divider between each option
 * COLOR LABELS: show/hide text labels next to color swatches (aria-label always present)
 * START DECORATION: icon or avatar
 * OPTION ICONS: { value, label, icon } — a small picture before the label,
 *   shown in the closed field once chosen (e.g. a Shape for a shape picker)
 *
 * Dropdown renders via React portal so it escapes parent overflow:hidden.
 * Smart positioning: opens downward if space allows, upward otherwise.
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* The trigger is Figma's Input with no start icon and an end decorator (the
   Select set is built from Input instances), so it shares the Input's ramp:
   Button-Height tall, Body text, the input padding before the text and after
   the decorator, the in-button icon in a Button-Height square. */
const SIZE_MAP = {
  small:  { height: 'var(--Small-Button-Height)', fontSize: 'var(--Body-Small-Font-Size, 14px)',  lineHeight: 'var(--Body-Small-Line-Height, 20px)',  pad: 'var(--Input-Padding, 8px)',  icon: 'var(--Sm-Button-Icon, 16px)', radius: 'var(--Sm-Input-Radius, var(--Input-Radius, var(--Style-Border-Radius)))', iconSize: 16 },
  medium: { height: 'var(--Button-Height)',        fontSize: 'var(--Body-Medium-Font-Size, 16px)', lineHeight: 'var(--Body-Medium-Line-Height, 24px)', pad: 'var(--Input-Padding, 12px)', icon: 'var(--Button-Icon, 20px)',    radius: 'var(--Input-Radius, var(--Style-Border-Radius))', iconSize: 20 },
  large:  { height: 'var(--Large-Button-Height)',  fontSize: 'var(--Body-Large-Font-Size, 18px)',  lineHeight: 'var(--Body-Large-Line-Height, 28px)',  pad: 'var(--Input-Padding, 16px)', icon: 'var(--Lg-Button-Icon, 32px)', radius: 'var(--Lg-Input-Radius, var(--Input-Radius, var(--Style-Border-Radius)))', iconSize: 32 },
};

const FLOATING_SIZE_MAP = {
  // No right padding: the chevron's own box is the inset (as Input's end decorator).
  small:  { height: 48, fontSize: '13px', padding: '20px 0 4px 12px', labelSize: '11px', leftPad: 12 },
  medium: { height: 56, fontSize: '14px', padding: '22px 0 6px 14px', labelSize: '12px', leftPad: 14 },
  large:  { height: 64, fontSize: '16px', padding: '24px 0 6px 16px', labelSize: '14px', leftPad: 16 },
};

const DROPDOWN_MAX_HEIGHT = 240;

// --- Static sheet --------------------------------------------------------------
//
// Select was built from MUI Boxes styled by sx. Each Box is now a plain
// element with the same classes (MuiBox-root included) and these rules, at the
// weights the sx had — one class per part, one class plus a pseudo-class for
// a state, the shell's descendant rule over the trigger — so a caller's sx
// still wins over them. Size and floating values are one class per mode.
const SxBox = lazySxBox('Select');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
const SZ = { small: 'sm', medium: 'md', large: 'lg' };
const px = (v) => (typeof v === 'number' ? v + 'px' : v);
const MODES = Object.keys(SZ).flatMap((s) => [['s' + SZ[s], SIZE_MAP[s], false], ['f' + SZ[s], FLOATING_SIZE_MAP[s], true]]);
const longPad = (padding) => {
  const p = padding.match(/(?:var\([^()]*\)|[^\s])+/g);
  const [t, r = t, b = t, l = r] = p;
  return `padding-top:${t};padding-right:${r};padding-bottom:${b};padding-left:${l}`;
};

registerStaticStyles('omni-select', [
  '.omni-sel{position:relative;width:auto;display:inline-block;font-family:inherit}',
  '.omni-sel-full{width:100%}',
  '.omni-sel-left{display:inline-grid;grid-template-columns:auto minmax(0, 1fr);column-gap:var(--Sizing-1, 8px);-webkit-box-align:center;align-items:center}',
  '.omni-sel-left-full{display:grid}',

  /* The shell, as Input's. */
  '.omni-sel-shell{position:relative;border:none;overflow:hidden;background-color:var(--Hover);transition:background-color 0.15s ease;box-shadow:none}',
  '.omni-sel-shell::after{content:"";position:absolute;inset:0;pointer-events:none;border-width:1px;border-style:solid;border-color:var(--Border);border-radius:inherit}',
  ...Object.keys(SZ).map((s) => `.omni-sel-shell-${SZ[s]}{border-radius:${SIZE_MAP[s].radius}}`),
  '.omni-sel-shell-f{border-radius:var(--Input-Radius, var(--Style-Border-Radius))}',
  '.omni-sel-on:hover{background-color:var(--Pressed)}',
  '.omni-sel-on:active{background-color:var(--Hover)}',
  // Pressed, the edge is 2px — Figma's Select (as Input) draws its stroke at 2 there.
  '.omni-sel-on:active::after{border-width:2px}',
  '.omni-sel-on:hover .select-trigger,.omni-sel-on:active .select-trigger,.omni-sel-on:focus-within .select-trigger{color:var(--Text)}',
  '.omni-sel-shell:focus-within{outline-width:2px;outline-style:solid;outline-color:var(--Focus-Visible);outline-offset:1px}',
  '.omni-sel-shell-off{opacity:var(--Disabled, 0.38)}',

  /* The trigger. The field's text is --Text; only the placeholder is Quiet. */
  '.omni-sel-trg{display:flex;-webkit-box-align:center;align-items:center;gap:var(--Sizing-1-and-Half, 12px);width:100%;min-width:var(--_sel-minw);'
    + 'background-color:transparent;border:none;border-radius:0;color:var(--Quiet);font-family:var(--Body-Font-Family, inherit);'
    + 'cursor:pointer;outline:none;text-align:left;position:relative;transition:color 0.15s ease}',
  ...MODES.map(([k, sc, flt]) => `.omni-sel-trg-${k}{height:${px(sc.height)};`
    + (flt ? longPad(sc.padding) : `padding-top:0;padding-right:0;padding-bottom:0;padding-left:${sc.pad}`)
    + `;font-size:${sc.fontSize}` + (sc.lineHeight ? `;line-height:${sc.lineHeight}` : '') + (flt ? ';gap:8px' : '') + '}'),
  '.omni-sel-trg-val{color:var(--Text)}',
  '.omni-sel-trg-off{cursor:not-allowed}',
  '.omni-sel-deco{display:flex;-webkit-box-align:center;align-items:center;flex-shrink:0;color:inherit}',
  '.omni-sel-deco-start{color:var(--Text-Quiet)}',
  /* The floating label. */
  '.omni-sel-flabel{position:absolute;top:50%;transform:translateY(-50%);transform-origin:top left;color:var(--Quiet);font-weight:400;'
    + 'pointer-events:none;transition:top 0.15s ease, transform 0.15s ease, color 0.15s ease}',
  ...Object.keys(SZ).flatMap((s) => {
    const sc = FLOATING_SIZE_MAP[s];
    return [`.omni-sel-flabel-${SZ[s]}{left:${(sc.leftPad || 14)}px;font-size:${sc.fontSize}}`,
      `.omni-sel-flabel-${SZ[s]}-deco{left:${(sc.leftPad || 14) + 32}px}`];
  }),
  '.omni-sel-flabel-up{top:6px;transform:scale(0.75)}',
  '.omni-sel-flabel-open{color:var(--Text)}',
  '.omni-sel-val{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
  '.omni-sel-val-up{margin-top:8px}',
  '.omni-sel-val-down{margin-top:0}',
  '.omni-sel-colorval{display:flex;-webkit-box-align:center;align-items:center;gap:8px}',
  '.omni-sel-value{color:inherit;font:inherit}',
  /* The end decorator: a Button-Height square holding the chevron. */
  '.omni-sel-dec{display:inline-flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;flex-shrink:0;'
    + 'color:var(--Icons-Default, var(--Text))}',
  ...MODES.map(([k, sc, flt]) => `.omni-sel-dec-${k}{width:${flt ? 'auto' : sc.height};height:${flt ? 'auto' : sc.height}}`),
  '.omni-sel-dec .MuiSvgIcon-root{transform:rotate(0deg);transition:transform 0.2s ease}',
  ...MODES.map(([k, sc, flt]) => `.omni-sel-dec-${k} .MuiSvgIcon-root{font-size:${flt ? (sc.iconSize || 18) + 'px' : sc.icon}}`),
  '.omni-sel-dec-open .MuiSvgIcon-root{transform:rotate(180deg)}',
  `.omni-sel-glyph{${SVG_ICON_DECLS};font-size:1.5rem}`,

  /* The dropdown panel. */
  '.omni-sel-list{position:fixed;background-color:var(--Hover);border-width:1px;border-style:solid;border-color:var(--Border);'
    + 'border-radius:var(--Dropdown-Frame-Radius, var(--Input-Radius, var(--Style-Border-Radius, 4px)));box-shadow:none;z-index:99999;'
    + `max-height:${DROPDOWN_MAX_HEIGHT}px;overflow-y:auto;padding-top:4px;padding-bottom:4px}`,
  '.omni-sel-opt{display:flex;-webkit-box-align:center;align-items:center;gap:8px;padding-left:12px;padding-right:12px;padding-top:0;padding-bottom:0;'
    + 'margin-left:4px;margin-right:4px;margin-top:1px;margin-bottom:1px;cursor:pointer;font-family:inherit;border-radius:4px;outline:none;'
    + 'color:var(--Text);background-color:transparent;border-width:1px;border-style:solid;border-color:transparent;'
    + 'transition:background-color 0.1s ease}',
  ...MODES.map(([k, sc]) => `.omni-sel-opt-${k}{min-height:${px(sc.height)};font-size:${sc.fontSize}}`),
  '.omni-sel-opt-on{background-color:var(--_sel-btn);color:var(--_sel-btn-text);border-color:var(--_sel-btn-border);font-weight:600}',
  '.omni-sel-opt-off:hover{background-color:var(--_sel-hover);color:var(--_sel-btn-text)}',
  '.omni-sel-opt-off:active{background-color:var(--_sel-pressed);color:var(--_sel-btn-text)}',
  '.omni-sel-opt:focus-visible{outline-width:2px;outline-style:solid;outline-color:var(--Focus-Visible);outline-offset:2px}',
  '.omni-sel-opt-icon{display:inline-flex;-webkit-box-align:center;align-items:center;flex-shrink:0}',
  '.omni-sel-div{height:1px;background-color:var(--Border);margin-left:8px;margin-right:8px;margin-top:2px;margin-bottom:2px}',
  '.omni-sel-group{padding-left:12px;padding-right:12px;padding-top:10px;padding-bottom:4px;font-size:11px;font-family:inherit;font-weight:700;'
    + 'letter-spacing:0.06em;text-transform:uppercase;color:var(--Text-Quiet)}',
  '.omni-sel-group-first{padding-top:6px}',
].join('\n'));

/* The selected row: the palette's button fill, label and border, at 600.
   `default` and `solid` selection styles paint the same row (see the note in
   the header) — .omni-sel-opt-on in the sheet above. Unselected rows are
   --Text on transparent, with a transparent 1px border so nothing moves. */

export function Select({
  options = [],
  value: controlledValue,
  defaultValue = '',
  onChange,
  label,
  labelPosition = 'top',
  size = 'medium',
  variant = 'outline',        // 'outline' — see the note on `light` above
  /* The palette of the SELECTED and hovered rows in the open list — the
     field itself has one look (the Border edge, --Text value) whatever this
     is. 'default' (the brand's Default buttons), not primary: it used to be
     primary, and 'default' was quietly forced to primary too. */
  color = 'default',          // 'default' | 'primary' | 'secondary' | ...
  selectionStyle = 'default',
  mode = 'standard',
  placeholder = 'Select\u2026',
  showDividers = false,
  showColorLabels = true,
  startDecoration,
  disabled = false,
  fullWidth = false,
  /* The trigger's floor. 140 keeps a lone select from collapsing around a
     short value; two side by side in a narrow row (a gradient stop's family
     and tone) need it lower, so it is a prop rather than a literal. */
  minWidth = 140,
  className = '',
  sx = {},
  ...props
}) {
  useStaticStyles('omni-select');
  const effectiveColor = color;
  const C = cap(effectiveColor);
  /* There was an `isLight = variant === 'light'` here, read by nothing. So
     variant="light" never changed a color, a token or a style — its ONLY
     effect was the class name below, which is why it looked supported. */

  /* Normalise both props, so neither can emit a class for a style that no
     longer exists. A stale class is not harmless here: select-variant-light
     is a consumer-facing hook, and a brand stylesheet still targeting it
     would keep styling a variant the component no longer implements. */
  if (process.env.NODE_ENV !== 'production') {
    if (variant === 'light') {
      // eslint-disable-next-line no-console
      console.warn(
        '[Select] variant="light" was removed and had never done anything — '
        + 'it was read by no code path. Rendering outline. For a lighter '
        + 'Select, use data-surface="Surface-Brightest" on its container.',
      );
    }
    if (selectionStyle === 'light') {
      // eslint-disable-next-line no-console
      console.warn(
        '[Select] selectionStyle="light" was removed with the -Light button '
        + 'shades. It named --Buttons-{C}-Light-{Button,Text,Border}, which no '
        + 'design system publishes, and carried no fallbacks — a selected '
        + 'option rendered with no fill, no text color and no border. '
        + 'Rendering default.',
      );
    }
  }
  const effectiveVariant = variant === 'light' ? 'outline' : variant;
  const effectiveSelectionStyle = selectionStyle === 'light' ? 'default' : selectionStyle;
  // The trigger is never tinted — a coloured value reads as a state (see Input).
  const activeTextColor = 'var(--Text)';
  const triggerId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 0,
    direction: 'down',
  });

  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const [parentTheme, setParentTheme] = useState(null);
  const [parentSurface, setParentSurface] = useState(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  // Flatten groups so lookups and counts work whether options are flat or grouped
  const flatOptions = options.flatMap((o) => (o && Array.isArray(o.options)) ? o.options : [o]);
  const selectedOption = flatOptions.find((o) => (typeof o === 'string' ? o : o.value) === currentValue);
  const selectedLabel = selectedOption ? (typeof selectedOption === 'string' ? selectedOption : selectedOption.label) : '';
  /* An option may carry an `icon` — any small picture: a shape, a glyph, a
     logo. It sits before the label in the list and, once chosen, in the
     closed field too, unless the field has its own startDecoration. */
  const selectedIcon = selectedOption && typeof selectedOption === 'object' ? selectedOption.icon : null;
  const fieldDecoration = startDecoration || selectedIcon;
  const hasValue = currentValue !== '' && currentValue != null;

  const isFloating = labelPosition === 'floating';
  const isLeft = labelPosition === 'left';
  const isTop = labelPosition === 'top' || isLeft;
  const isColor = mode === 'color';
  /* The Swatch one step under the field: a 32px field holds the 24px chip,
     a 56px field the 32px one, as the old height − 8 square did. */
  const swatchSize = size === 'large' ? 'medium' : 'small';
  const sizeConfig = isFloating
    ? (FLOATING_SIZE_MAP[size] || FLOATING_SIZE_MAP.medium)
    : (SIZE_MAP[size] || SIZE_MAP.medium);

  const handleSelect = useCallback((val) => {
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
    setOpen(false);
    triggerRef.current?.focus();
  }, [isControlled, onChange]);

  // Compute position for the dropdown — must be defined before toggleOpen
  const getDropdownPos = useCallback(() => {
    if (!triggerRef.current) return { top: 0, left: 0, width: 0 };
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const direction = spaceBelow >= DROPDOWN_MAX_HEIGHT || spaceBelow >= spaceAbove ? 'down' : 'up';
    return {
      top: direction === 'down' ? rect.bottom + 4 : undefined,
      bottom: direction === 'up' ? (window.innerHeight - rect.top + 4) : undefined,
      left: rect.left,
      width: rect.width,
      direction,
    };
  }, []);

  const toggleOpen = useCallback(() => {
    if (disabled) return;
    setOpen((prev) => {
      if (!prev) {
        setDropdownPos(getDropdownPos());
      }
      return !prev;
    });
  }, [disabled, getDropdownPos]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        wrapperRef.current && !wrapperRef.current.contains(e.target) &&
        !e.target.closest('[data-select-dropdown]')
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Capture parent theme/surface and reposition on scroll/resize
  useEffect(() => {
    if (!open || !triggerRef.current) return;

    // Capture closest data-theme and data-surface from the trigger's ancestors
    const themeEl = triggerRef.current.closest('[data-theme]');
    const surfaceEl = triggerRef.current.closest('[data-surface]');
    setParentTheme(themeEl?.getAttribute('data-theme') || null);
    setParentSurface(surfaceEl?.getAttribute('data-surface') || null);

    // Force re-render on scroll/resize to update position
    const forceUpdate = () => setDropdownPos(getDropdownPos());
    window.addEventListener('scroll', forceUpdate, true);
    window.addEventListener('resize', forceUpdate);
    return () => {
      window.removeEventListener('scroll', forceUpdate, true);
      window.removeEventListener('resize', forceUpdate);
    };
  }, [open, getDropdownPos]);

  const dropdownRef = useRef(null);

  const focusOption = useCallback((dir) => {
    const container = dropdownRef.current;
    if (!container) return;
    const items = container.querySelectorAll('[role="option"]');
    if (!items.length) return;
    const active = container.querySelector('[role="option"]:focus');
    let idx = Array.prototype.indexOf.call(items, active);
    if (dir === 'down') idx = idx < items.length - 1 ? idx + 1 : 0;
    else idx = idx > 0 ? idx - 1 : items.length - 1;
    items[idx].focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); return; }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleOpen(); return; }
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); setOpen(true); return; }
    if (open && e.key === 'ArrowDown') { e.preventDefault(); focusOption('down'); }
    if (open && e.key === 'ArrowUp') { e.preventDefault(); focusOption('up'); }
  };

  const handleOptionKeyDown = (e, optValue) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(optValue); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); focusOption('down'); }
    if (e.key === 'ArrowUp') { e.preventDefault(); focusOption('up'); }
    if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
  };


  // Focus selected or first option when dropdown opens
  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      const container = dropdownRef.current;
      if (!container) return;
      const selected = container.querySelector('[aria-selected="true"]');
      const first = container.querySelector('[role="option"]');
      (selected || first)?.focus();
    });
  }, [open]);

  // The dropdown rendered into document.body via portal. No data-surface —
  // the dropdown uses --Hover (a subtle tint of whatever scope the body
  // resolves to) for its background so it stays consistent with the
  // trigger field and doesn't fight saturated brand surfaces. We still
  // carry data-theme so per-palette tokens (Buttons, Border, etc.)
  // resolve correctly against the brand the user picked.
  //
  // The row palette arrives as custom properties declared on the listbox,
  // which carries the same data-theme the rows resolve against.
  const sk = SZ[size] ? size : 'medium';
  const modeKey = (isFloating ? 'f' : 's') + SZ[sk];
  const dropdown = open ? ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      data-select-dropdown
      data-theme={parentTheme || undefined}
      role="listbox"
      aria-label={label || 'Options'}
      className="MuiBox-root omni-sel-list"
      style={{
        top: dropdownPos.top ?? 'unset',
        bottom: dropdownPos.bottom ?? 'unset',
        left: dropdownPos.left,
        width: dropdownPos.width + 'px',
        '--_sel-btn': 'var(--Buttons-' + C + '-Button)',
        '--_sel-btn-text': 'var(--Buttons-' + C + '-Text)',
        '--_sel-btn-border': 'var(--Buttons-' + C + '-Border)',
        '--_sel-hover': 'var(--Buttons-' + C + '-Hover)',
        '--_sel-pressed': 'var(--Buttons-' + C + '-Pressed)',
      }}
    >
      {(() => {
        const renderOption = (opt, idx, total) => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          const optColor = typeof opt === 'object' ? opt.color : null;
          const optIcon = typeof opt === 'object' ? opt.icon : null;
          const isSelected = optValue === currentValue;
          const isLast = idx === total - 1;

          return (
            <React.Fragment key={optValue}>
              <div
                role="option"
                tabIndex={-1}
                aria-selected={isSelected}
                aria-label={isColor && !showColorLabels ? optLabel : undefined}
                onClick={() => handleSelect(optValue)}
                onKeyDown={(e) => handleOptionKeyDown(e, optValue)}
                className={'MuiBox-root omni-sel-opt omni-sel-opt-' + modeKey + (isSelected ? ' omni-sel-opt-on' : ' omni-sel-opt-off')}
              >
                {isColor && optColor && (
                  /* The library's Swatch — the chip Figma's color dropdown
                     puts in each row. The row marks selection with its check,
                     so the chip stays plain. */
                  <Swatch color={optColor} size={swatchSize} aria-hidden="true" />
                )}
                {optIcon && (
                  <div aria-hidden="true" className="MuiBox-root omni-sel-opt-icon">{optIcon}</div>
                )}
                {(!isColor || showColorLabels) && (
                  <BodySmall style={{ flex: 1, color: 'inherit', fontWeight: 'inherit' }}>{optLabel}</BodySmall>
                )}
                {isSelected && <Icon size="small" sx={{ opacity: 0.6, flexShrink: 0 }}><Glyph name="Check" className="omni-sel-glyph" /></Icon>}
              </div>
              {showDividers && !isLast && (
                <div aria-hidden="true" className="MuiBox-root omni-sel-div" />
              )}
            </React.Fragment>
          );
        };

        return options.map((opt, gIdx) => {
          // Group: has an `options` array of children
          if (opt && Array.isArray(opt.options)) {
            const groupItems = opt.options;
            return (
              <React.Fragment key={'group-' + (opt.label || gIdx)}>
                <div role="presentation" className={'MuiBox-root omni-sel-group' + (gIdx === 0 ? ' omni-sel-group-first' : '')}>
                  {opt.label}
                </div>
                {groupItems.map((child, cIdx) => renderOption(child, cIdx, groupItems.length))}
              </React.Fragment>
            );
          }
          return renderOption(opt, gIdx, options.length);
        });
      })()}
    </div>,
    document.body
  ) : null;

  const raised = hasValue || open;
  const wrapperProps = {
    className:
      'select-wrapper select-' + size +
      ' select-label-' + labelPosition +
      ' select-style-' + effectiveSelectionStyle +
      ' select-variant-' + effectiveVariant +
      (open ? ' select-open' : '') +
      (disabled ? ' select-disabled' : '') +
      (className ? ' ' + className : '') +
      ' MuiBox-root omni-sel' + (fullWidth ? ' omni-sel-full' : '') +
      // Left label: label in its own column, centred on the field — as Input.
      (isLeft && label ? (fullWidth ? ' omni-sel-left omni-sel-left-full' : ' omni-sel-left') : ''),
    ...props,
  };
  const body = (
    <>
      {/* Top label: the lib's FormLabel, as Input's. The trigger is a
          <button>, which IS labelable, so <label for> names it. */}
      {isTop && label && (
        <FormLabel htmlFor={triggerId} disabled={disabled}
          sx={{ ...(isLeft ? { flexShrink: 0 } : { marginBottom: 'var(--Sizing-Half, 4px)' }), ...(disabled && { opacity: 'var(--Disabled, 0.38)' }) }}>
          {label}
        </FormLabel>
      )}

      {/* Outer shell — Input's: the edge an inside-stroke overlay, the fill
          resting on --Hover, deepening to --Pressed under the pointer and back
          to --Hover while pressed; the 2px ring 1px out; 38% when disabled. */}
      {/* The wrapper is the shell's parent — read from here so it is found
          whether the wrapper is a plain div or the sx box. */}
      <div ref={(n) => { wrapperRef.current = n ? n.parentElement : null; }}
        className={'select-shell MuiBox-root omni-sel-shell omni-sel-shell-' + (isFloating ? 'f' : SZ[sk])
        + (disabled ? ' omni-sel-shell-off' : ' omni-sel-on')}>
      {/* Inner wrapper — no data-surface so trigger inherits parent scope */}
      <div className="MuiBox-root">

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        id={triggerId}
        aria-label={isTop && label ? undefined : (label || placeholder)}
        className={'select-trigger MuiBox-root omni-sel-trg omni-sel-trg-' + modeKey
          + ((hasValue || open) ? ' omni-sel-trg-val' : '') + (disabled ? ' omni-sel-trg-off' : '')}
        style={{ '--_sel-minw': typeof minWidth === 'number' ? minWidth + 'px' : minWidth }}
        tabIndex={disabled ? -1 : 0}
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {fieldDecoration && (
          <div aria-hidden={startDecoration ? undefined : true}
               className={'MuiBox-root omni-sel-deco' + (startDecoration ? ' omni-sel-deco-start' : '')}>
            {fieldDecoration}
          </div>
        )}

        {/* Floating label */}
        {isFloating && label && (
          <div className={'MuiBox-root omni-sel-flabel omni-sel-flabel-' + SZ[sk] + (raised ? ' omni-sel-flabel-up' : '')
            + (open ? ' omni-sel-flabel-open' : '') + (fieldDecoration ? ' omni-sel-flabel-' + SZ[sk] + '-deco' : '')}>
            {label}
          </div>
        )}

        {/* Value display */}
        <div className={'MuiBox-root omni-sel-val' + (isFloating ? (raised ? ' omni-sel-val-up' : ' omni-sel-val-down') : '')}>
          {isColor && hasValue ? (
            <div className="MuiBox-root omni-sel-colorval">
              {/* selectedOption holds the option object; the trigger shows
                  its color as the same library Swatch the rows use. */}
              <Swatch color={(selectedOption && typeof selectedOption !== 'string' && selectedOption.color) || 'transparent'}
                size={swatchSize} aria-hidden="true" />
              {showColorLabels && <BodySmall style={{ color: 'inherit', padding: 0 }}>{selectedLabel}</BodySmall>}
            </div>
          ) : (
            <span className="select-value MuiBox-root omni-sel-value">
              {hasValue ? selectedLabel : (isFloating && label ? '' : placeholder)}
            </span>
          )}
        </div>

        {/* Figma's end decorator: an Input Decorator — a ghost icon button,
            Button-Height square. Drawn, not a <button>: the trigger is already
            one, and buttons do not nest. */}
        <span aria-hidden="true" className={'select-decorator MuiBox-root omni-sel-dec omni-sel-dec-' + modeKey + (open ? ' omni-sel-dec-open' : '')}>
          <Glyph name="ExpandMore" className="omni-sel-glyph" />
        </span>
      </button>

      </div>{/* end inner themed surface */}
      </div>{/* end outer border shell */}

      {/* Portal dropdown — renders into document.body to escape overflow:hidden */}
      {dropdown}
    </>
  );
  if (hasSx(sx)) return <SxBox sx={sx} {...wrapperProps}>{body}</SxBox>;
  return <div {...wrapperProps}>{body}</div>;
}

export default Select;
