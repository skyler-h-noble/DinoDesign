// src/components/Radio/Radio.js
import React, { createContext, useContext, useId, useRef, useState } from 'react';
import { Label, LabelSmall, LabelLarge } from '../Typography';
import { tokenSegment } from '../_shadows';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import { ControlLabel } from '../_controlLabel';

/**
 * Radio Component
 *
 * Single style (no outline/light split). Color drives the ring + dot.
 *
 * GEOMETRY (Figma-aligned):
 *   small  — parent 24×24, ring 16, dot 8,  LabelSmall label, --Sm-Label-Gap (4)
 *   medium — parent 24×24, ring 20, dot 10, Label label,      --Label-Gap (8)
 *   large  — parent 24×24, ring 24, dot 12, LabelLarge label, --Lg-Label-Gap (12)
 *
 * COLORS: default | primary | secondary | tertiary | neutral |
 *         info | success | warning | error
 *
 * ACCESSIBILITY:
 *   - aria-label / aria-labelledby forwarded to <input> per WCAG 1.3.1
 *   - Without a visible label prop, always provide aria-label
 *   - Use RadioGroup with a label for grouped radio buttons
 */

// black-white matches Button and Checkbox. It capitalises to `Black-white`,
// which is not a token — the system emits --Buttons-BlackWhite-*, so the name
// goes through the shared tokenSegment mapping rather than cap().
const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error', 'black-white'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const seg = tokenSegment;

// --- Sizing ------------------------------------------------------------------
// box is the outer ring; dot is the inner filled circle when checked. The
// control around them hugs the ring with 2px a side, at least Sizing-3 square
// (see `target` below).

const SIZE_MAP = {
/* Radio/Radio and Radio/Dot from Figma's Component-Size collection. The dot was
   9.5 at medium and large, where the design says 10 and 12.
 
   9.5 is also why it looked off-centre rather than merely small: the ring is
   20px with a 2px border, so a 9.5px dot centres at 3.25px — a subpixel offset
   the browser rounds per axis, and it lands visibly off. 10 in 20 is 5 either
   side, which is what Figma draws (Dot at x=5, y=5). Whole pixels centre; halves
   do not. Large was wrong by 2.5px on top of that. */
  /* LABEL is the Label type style (Figma's Form-Label, Dynamic-Label); the
     gap is --Label-Gap (_labelGap.js), shared with Checkbox and Switch. */
  small:  { box: 16, dot: 8,  LabelComp: LabelSmall },
  medium: { box: 20, dot: 10, LabelComp: Label },
  large:  { box: 24, dot: 12, LabelComp: LabelLarge },
};

// --- Static sheet ------------------------------------------------------------
//
// Radio was MUI's Radio (SwitchBase on ButtonBase) with an sx override, two
// MUI Boxes for the ring and dot, and — in a group — MUI's FormControl,
// FormLabel and RadioGroup. It is now its own markup over the same tokens; this
// sheet carries the base MUI gave each part and the design's layer on top, so
// the rendered control is unchanged. Same classes as MUI's (MuiRadio-root,
// PrivateSwitchBase-input, MuiFormControl-root, MuiFormLabel-root,
// MuiRadioGroup-root …) so a consumer's rule on them still lands.
//
// Colour arrives as a custom property declared on the root by one class per
// color (.omni-rd-Primary …). Nothing between the root and the ring sets a
// data-theme, so it resolves against the same scope the ring named it in.
//
// State rules weigh what emotion's did, so a caller's sx still wins over them.
// A caller's sx key that the component's own sx also had REPLACED that whole
// nested object when both were one sx; .omni-rd-no-<key> drops ours so the
// caller's alone applies, as it did.
const SxBox = lazySxBox('Radio');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
const SX_KEYS = {
  '&.Mui-checked': 'checked',
  '&:hover': 'hover',
  '&:hover .radio-circle-icon': 'hover-ring',
  '&:not(.Mui-checked):hover .radio-circle-icon': 'hover-off-ring',
  '&:active .radio-circle-icon': 'active-ring',
  '&:not(.Mui-checked):active .radio-circle-icon': 'active-off-ring',
  '&.Mui-focusVisible .radio-circle-icon': 'focus-ring',
  '&.Mui-disabled': 'disabled',
};
const ok = (key) => `:where(:not(.omni-rd-no-${key}))`;
const halo = (spread) => '0 0 0 1px var(--Background), 0 0 0 calc(1px + ' + spread + ') color-mix(in srgb, var(--_rd-c) 10%, transparent)';

/* Emotion's prefixer wrote the old flexbox aliases next to align-items and
   justify-content; Chrome still computes them (-webkit-box-align / -pack), so
   the sheet writes them too. */
const wk = (css) => css
  .replace(/(^|[{;])align-items:([^;}]+)/g, '$1-webkit-box-align:$2;align-items:$2')
  .replace(/(^|[{;])justify-content:([^;}]+)/g, (m, p, v) => p + '-webkit-box-pack:' + v.replace(/^flex-/, '').replace(/^space-between$/, 'justify') + ';justify-content:' + v);
/* A caller's sx key that replaced one of ours kept OUR key's place in the
   merged object, so our later keys still came after it and won ties. Each
   later rule is repeated one class heavier for an instance where an earlier
   key was replaced, which puts it back over the caller's (emotion's, inserted
   after this sheet). */
const after = (rule, root, prefix, earlier) => {
  const i = rule.indexOf('{');
  const sels = rule.slice(0, i).split(',');
  const extra = [];
  for (const k of earlier) for (const sel of sels) if (sel.startsWith(root)) extra.push(root + '.' + prefix + k + sel.slice(root.length));
  return [...sels, ...extra].join(',') + rule.slice(i);
};
registerStaticStyles('omni-radio', wk([
  /* The root: ButtonBase's reset, SwitchBase's round, then the design's
     touch-target frame — a frame that HUGS the ring with 2px of padding a
     side, never smaller than Sizing-3 (24px). */
  '.omni-rd{display:inline-flex;align-items:center;justify-content:center;position:relative;box-sizing:border-box;'
    + '-webkit-tap-highlight-color:transparent;background-color:transparent;outline:0;border:0;margin:0;cursor:pointer;'
    + 'user-select:none;vertical-align:middle;-moz-appearance:none;-webkit-appearance:none;appearance:none;text-decoration:none;'
    + 'padding:2px;min-width:var(--Sizing-3, 24px);min-height:var(--Sizing-3, 24px);border-radius:50%;color:inherit;'
    + 'transition:background-color 0.15s ease-in-out}',
  '.omni-rd::-moz-focus-inner{border-style:none}',
  '@media print{.omni-rd{print-color-adjust:exact}}',
  ...COLORS.map((c) => `.omni-rd-${seg(c)}{--_rd-c:var(--Buttons-${seg(c)}-Border)}`),
  /* MUI's disabled colour (nothing paints with it), then the sx's inherit
     for a checked root, disabled or not. */
  '.omni-rd.Mui-disabled{pointer-events:none;cursor:default;color:rgba(0, 0, 0, 0.26)}',
  `.omni-rd${ok('checked')}.Mui-checked{color:inherit}`,
  /* The ripple halo is suppressed and the ring takes the state instead, so the
     dot stays the one thing that means "selected". */
  after(`.omni-rd${ok('hover')}:hover{background-color:transparent}`, '.omni-rd', 'omni-rd-no-', ['checked']),
  /* Hover and Pressed are a HALO outside the ring, as the Figma set draws
     them: 1px of surface, then Sizing-Half (hover) or Sizing-1 (pressed) of
     the button Border at 10%. box-shadow: it takes no layout, so the pressed
     halo does not push the label or the next radio. */
  after(`.omni-rd${ok('hover-ring')}:hover .omni-rd-ring{box-shadow:${halo('var(--Sizing-Half, 4px)')}}`, '.omni-rd', 'omni-rd-no-', ['checked', 'hover']),
  // Unselected Hover also moves the ring to the button Border.
  after(`.omni-rd${ok('hover-off-ring')}:not(.Mui-checked):hover .omni-rd-ring{border-color:var(--_rd-c)}`, '.omni-rd', 'omni-rd-no-', ['checked', 'hover', 'hover-ring']),
  after(`.omni-rd${ok('active-ring')}:active .omni-rd-ring{box-shadow:${halo('var(--Sizing-1, 8px)')}}`, '.omni-rd', 'omni-rd-no-', ['checked', 'hover', 'hover-ring', 'hover-off-ring']),
  // Unselected Pressed keeps the resting --Border ring (Figma).
  after(`.omni-rd${ok('active-off-ring')}:not(.Mui-checked):active .omni-rd-ring{border-color:var(--Border)}`, '.omni-rd', 'omni-rd-no-', ['checked', 'hover', 'hover-ring', 'hover-off-ring', 'active-ring']),
  /* 2px, 1px out — its outer edge 3px outside the ring, as Figma's
     Focus-Visible frame. */
  after(`.omni-rd${ok('focus-ring')}.Mui-focusVisible .omni-rd-ring{outline:2px solid var(--Focus-Visible);outline-offset:1px}`, '.omni-rd', 'omni-rd-no-', ['checked', 'hover', 'hover-ring', 'hover-off-ring', 'active-ring', 'active-off-ring']),
  /* Once, on the root — Figma's Disabled is 0.38. */
  after(`.omni-rd${ok('disabled')}.Mui-disabled{opacity:var(--Disabled, 0.38);cursor:not-allowed;pointer-events:none}`, '.omni-rd', 'omni-rd-no-', ['checked', 'hover', 'hover-ring', 'hover-off-ring', 'active-ring', 'active-off-ring', 'focus-ring']),
  /* The native input: invisible, covering the root, so it takes the clicks. */
  '.omni-rd-input{cursor:inherit;position:absolute;opacity:0;width:100%;height:100%;top:0;left:0;margin:0;padding:0;z-index:1}',
  /* The ring. No fill: Figma's ring has none. Unselected it is the surface's
     --Border (the 3:1 control outline); selected, the button's Border. */
  '.omni-rd-ring{box-sizing:border-box;border-radius:50%;border:2px solid var(--Border);flex-shrink:0;background-color:transparent;'
    + 'position:relative;transition:border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out}',
  '.omni-rd-ring-on{border-color:var(--_rd-c)}',
  ...Object.entries(SIZE_MAP).map(([size, c]) => `.omni-rd-ring-${size}{width:${c.box}px;height:${c.box}px}`),
  /* The dot is centred by POSITION, not by flex: half the box, less half the
     dot, as a transform — there is no content box in that sum, so nothing can
     disagree about where the middle is. */
  '.omni-rd-dot{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);border-radius:50%;background-color:var(--_rd-c)}',
  ...Object.entries(SIZE_MAP).map(([size, c]) => `.omni-rd-dot-${size}{width:${c.dot}px;height:${c.dot}px}`),
  /* The label text. Two classes: the Typography sheet's colour class is one. */
  '.omni-type.omni-rd-text{color:var(--Text);user-select:none}',
  '.omni-type.omni-rd-text-off{color:var(--Text-Quiet)}',
  /* RadioGroup — MUI's FormControl (fieldset), FormLabel (legend) and
     RadioGroup / FormGroup, then the sx each was given. */
  '.omni-rg{display:inline-flex;flex-direction:column;position:relative;min-width:0;padding:0;margin:0;border:0;vertical-align:top}',
  '.omni-rg-legend{color:var(--Text);font-family:"Roboto","Helvetica","Arial",sans-serif;font-weight:500;font-size:15px;line-height:1.4375em;'
    + 'letter-spacing:0.00938em;padding:0;position:relative;margin-bottom:8px}',
  '.omni-rg-legend-sm{font-size:13px}',
  '.omni-rg-legend.Mui-focused{color:var(--Text)}',
  '.omni-rg-legend.Mui-disabled{color:var(--Text-Quiet);opacity:var(--Disabled, 0.38)}',
  '.omni-rg-group{display:flex;flex-direction:column;flex-wrap:nowrap;align-items:flex-start;gap:var(--_rg-gap)}',
  /* Explicit flex-direction so the layout flips; wrap keeps long horizontal
     groups from overflowing. */
  '.omni-rg-row{flex-direction:row;flex-wrap:wrap;align-items:center}',
].join('\n')));

// --- Ring + dot --------------------------------------------------------------

function RadioCircleIcon({ size, checked }) {
  useStaticStyles('omni-radio');
  /* As the Figma Radio set (6778:13571) binds it: unselected, the ring is the
     surface's --Border; selected, ring and dot are both the button's Border,
     so selecting is what brings in the color. Hover takes the button Border
     too — that is set on the root. */
  const sizeKey = SIZE_MAP[size] ? size : 'medium';
  return (
    <div className={'radio-circle-icon MuiBox-root omni-rd-ring omni-rd-ring-' + sizeKey + (checked ? ' omni-rd-ring-on' : '')}>
      {checked && <div className={'MuiBox-root omni-rd-dot omni-rd-dot-' + sizeKey} />}
    </div>
  );
}

// --- Group context -----------------------------------------------------------
//
// What MUI's RadioGroupContext and FormControlContext gave a Radio in a
// group: the group's value (a Radio is checked when its value matches), the
// shared name, the change handler, and focus reporting for the legend.
const RadioGroupContext = createContext(null);

function areEqualValues(a, b) {
  if (typeof b === 'object' && b !== null) return a === b;
  return String(a) === String(b);
}
const isHandler = (key, v) => /^on[A-Z]/.test(key) && typeof v === 'function';
/* What MUI's ButtonBase did with focus: the root wears Mui-focusVisible while
   the input inside it has :focus-visible (keyboard focus). */
function matchesFocusVisible(el) {
  try { return el.matches(':focus-visible'); } catch (e) { return false; }
}

// --- Radio Component ---------------------------------------------------------

/* ZONE PROPS — `theme` and `surface`.
 *
 * They become data-theme / data-surface on the root, which redefines
 * --Background, --Text, --Border, --Quiet, --Hover and --Pressed for
 * everything inside, so the component takes its colors from the zone it sits
 * in rather than from a prop.
 *
 * Deliberately NOT derived from `color`. The two are different knobs: `color`
 * chooses which PALETTE a filled part draws from, while `theme` moves the whole
 * surface — including the parts that carry a contrast requirement and therefore
 * have to stay on zone tokens. Folding one into the other would make a palette
 * choice silently restyle the contrast-bearing parts too.
 *
 * Both undefined when not passed, so the component INHERITS its ancestor's
 * zone. An empty string would match [data-theme] selectors and pin it to
 * nothing, which is worse than absent. */
export function Radio({
  theme,
  surface,
  // `default`, not `primary`: a control takes the Default button color unless
  // it asks for another, as the Figma Radio's Buttons mode does.
  color = 'default',
  size = 'medium',
  label,
  // 'end'    — label to the right of the radio (default)
  // 'bottom' — label below the radio (matches the "vertical" Figma layout)
  // 'top' / 'start' also accepted
  labelPlacement = 'end',
  checked,
  disabled = false,
  onChange,
  name,
  value,
  className = '',
  sx = {},
  // Extract aria props explicitly so they go to <input> not the outer <span>
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  inputProps: inputPropsProp = {},
  /* What MUI's SwitchBase routed to the <input> rather than the root. */
  id,
  inputRef,
  autoFocus,
  defaultChecked,
  required = false,
  readOnly,
  tabIndex,
  onFocus,
  onBlur,
  slotProps,
  ...props
}) {
  useStaticStyles('omni-radio');
  const group = useContext(RadioGroupContext);
  const effectiveColor = COLORS.includes(color) ? color : 'default';
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.medium;
  const LabelComp = sizeConfig.LabelComp;

  // In a group, checked and name come from it unless given.
  let checkedProp = checked;
  let nameProp = name;
  if (group) {
    if (checkedProp === undefined) checkedProp = areEqualValues(group.value, value);
    if (nameProp === undefined) nameProp = group.name;
  }
  // Checked state, controlled or not — the decision is made once, as MUI's.
  const { current: isControlled } = useRef(checkedProp !== undefined);
  const [checkedState, setCheckedState] = useState(Boolean(defaultChecked));
  const isChecked = isControlled ? checkedProp : checkedState;
  const [focusVisible, setFocusVisible] = useState(false);
  if (disabled && focusVisible) setFocusVisible(false);

  const mergedInputProps = {
    ...inputPropsProp,
    ...(ariaLabel       && { 'aria-label': ariaLabel }),
    ...(ariaLabelledBy  && { 'aria-labelledby': ariaLabelledBy }),
    ...(ariaDescribedBy && { 'aria-describedby': ariaDescribedBy }),
  };
  const external = slotProps?.input ?? mergedInputProps;
  const inputHandlers = {};
  const inputAttrs = {};
  Object.keys(external).forEach((key) => {
    if (isHandler(key, external[key])) inputHandlers[key] = external[key];
    else inputAttrs[key] = external[key];
  });
  const { className: inputClassName, ...inputRest } = inputAttrs;

  const handleInputChange = (event) => {
    if (inputHandlers.onChange) inputHandlers.onChange(event);
    // Workaround for https://github.com/facebook/react/issues/9023
    if (event.nativeEvent.defaultPrevented || readOnly) return;
    const next = event.target.checked;
    setCheckedState(next);
    if (onChange) onChange(event, next);
    if (group) group.onChange(event, next);
  };
  const handleFocus = (event) => {
    if (matchesFocusVisible(event.target)) setFocusVisible(true);
    if (onFocus) onFocus(event);
    if (group) group.onFocus(event);
  };
  const handleBlur = (event) => {
    if (!matchesFocusVisible(event.target)) setFocusVisible(false);
    if (onBlur) onBlur(event);
    if (group) group.onBlur(event);
  };

  const replaced = typeof sx === 'object' && sx !== null && !Array.isArray(sx)
    ? Object.keys(SX_KEYS).filter((k) => k in sx).map((k) => ' omni-rd-no-' + SX_KEYS[k]).join('')
    : '';
  const rootProps = {
    className: 'MuiButtonBase-root MuiRadio-root MuiRadio-colorPrimary PrivateSwitchBase-root'
      + (isChecked ? ' Mui-checked' : '') + (disabled ? ' Mui-disabled' : '') + (focusVisible ? ' Mui-focusVisible' : '')
      + ' radio-' + effectiveColor + ' ' + className
      + ' omni-rd omni-rd-' + seg(effectiveColor) + replaced,
    'data-theme': theme || undefined,
    'data-surface': surface || undefined,
    ...props,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };
  const children = (
    <>
      <input
        {...inputHandlers}
        onChange={handleInputChange}
        autoFocus={autoFocus}
        checked={checkedProp}
        defaultChecked={defaultChecked}
        disabled={disabled}
        id={id}
        name={nameProp}
        readOnly={readOnly}
        required={required}
        tabIndex={tabIndex}
        type="radio"
        value={value}
        {...inputRest}
        className={'PrivateSwitchBase-input omni-rd-input' + (inputClassName ? ' ' + inputClassName : '')}
        ref={inputRef}
      />
      <RadioCircleIcon size={size} checked={Boolean(isChecked)} />
    </>
  );
  const radioElement = hasSx(sx)
    ? <SxBox component="span" sx={sx} {...rootProps}>{children}</SxBox>
    : <span {...rootProps}>{children}</span>;

  if (label) {
    return (
      <ControlLabel
        control={radioElement}
        label={
          <LabelComp
            component="span"
            className={'MuiBox-root omni-rd-text' + (disabled ? ' omni-rd-text-off' : '')}
          >
            {label}
          </LabelComp>
        }
        disabled={disabled}
        labelPlacement={labelPlacement}
        size={size}
        quietDisabled
      />
    );
  }

  return radioElement;
}

// --- RadioGroup Component ----------------------------------------------------

export function RadioGroup({
  // `default`, not `primary`: a control takes the Default button color unless
  // it asks for another, as the Figma Radio's Buttons mode does.
  color = 'default',
  size = 'medium',
  label,
  options = [],
  value,
  /* UNCONTROLLED MODE, which this did not have. Every other input in the
     library takes one, the docs assumed it worked, and two lead examples
     passed `defaultValue` that went nowhere — so both rendered a group with
     nothing selected and looked like the component could not hold a choice.
     An ignored prop is worse than a missing one: nothing warns, and the page
     is simply wrong. */
  defaultValue,
  onChange,
  orientation = 'vertical',
  // Threaded to each child Radio. See Radio() for accepted values.
  labelPlacement = 'end',
  disabled = false,
  spacing = 1,
  name,
  className = '',
  sx = {},
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}) {
  useStaticStyles('omni-radio');
  /* Controlled the moment `value` is passed, and not before. Reading
     `value !== undefined` once keeps a group that starts empty and is later
     given a value from flipping modes mid-life without saying so. */
  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState(defaultValue);
  const current = isControlled ? value : innerValue;
  // The group's name, generated when none is given, as MUI's RadioGroup did.
  const generatedName = useId();
  const groupName = name ?? generatedName;
  // The legend shows focus while a radio inside the group has it (MUI's
  // FormControl tracked this); a disabled group is never focused.
  const [focused, setFocused] = useState(false);
  if (disabled && focused) setFocused(false);

  const handleChange = (event) => {
    const next = event.target.value;
    if (!isControlled) setInnerValue(next);
    onChange?.(event, next);
  };
  const ctx = {
    name: groupName,
    value: current ?? '',
    onChange: handleChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };

  const horizontal = orientation === 'horizontal';
  /* The group's own spacing — MUI sx `gap: spacing` — was a theme-spacing
     multiple (×8px) for a number, the value itself for a string. */
  const gap = typeof spacing === 'number' ? spacing * 8 + 'px' : spacing;
  const rootProps = {
    className: 'MuiFormControl-root radio-group-' + color + ' ' + className + ' omni-rg',
  };
  const body = (
    <>
      {label && (
        <legend className={'MuiFormLabel-root MuiFormLabel-colorPrimary' + (disabled ? ' Mui-disabled' : '') + (focused ? ' Mui-focused' : '')
          + ' omni-rg-legend' + (size === 'small' ? ' omni-rg-legend-sm' : '')}>
          {label}
        </legend>
      )}
      <div
        role="radiogroup"
        className={'MuiFormGroup-root' + (horizontal ? ' MuiFormGroup-row' : '') + ' MuiRadioGroup-root' + (horizontal ? ' MuiRadioGroup-row' : '') + ' omni-rg-group' + (horizontal ? ' omni-rg-row' : '')}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        style={{ '--_rg-gap': gap }}
        {...props}
      >
        <RadioGroupContext.Provider value={ctx}>
          {options.map((option) => (
            <Radio
              key={option.value}
              color={color}
              size={size}
              label={option.label}
              labelPlacement={labelPlacement}
              value={option.value}
              disabled={option.disabled || disabled}
            />
          ))}
        </RadioGroupContext.Provider>
      </div>
    </>
  );
  return hasSx(sx)
    ? <SxBox component="fieldset" sx={sx} {...rootProps}>{body}</SxBox>
    : <fieldset {...rootProps}>{body}</fieldset>;
}

// --- Legacy / Convenience Aliases --------------------------------------------

// `RadioInput` is the historic export name — kept so older consumers don't
// break when the variant prop was removed.
export const RadioInput = Radio;

export default Radio;
