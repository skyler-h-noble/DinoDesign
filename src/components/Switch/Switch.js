// src/components/Switch/Switch.js
import React, { useRef, useState } from 'react';
import { Label, LabelSmall, LabelLarge } from '../Typography';
import { SHADOW_LEVEL_2 } from '../_shadows';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox } from '../_lazyFallback';
import { ControlLabel } from '../_controlLabel';
import { Glyph, SVG_ICON_DECLS } from '../_glyph';

/**
 * Switch Component
 *
 * Geometry, color roles and states follow the Figma component
 * (Omni-Designs, node 6779:2252).
 *
 * VARIANTS:
 *   variant="default"           the design-file switch — theme-driven, no
 *                               color ramp. On: --Border track, --Text dot.
 *                               Off: --Background track, --Quiet border + dot.
 *                               `default-outline` and `outline` are the same.
 *   variant="{color}-outline"   bordered track + colored dot, all 8 colors
 *
 * SIZES (track, straight from the design):
 *   small  20×12, 8px dot     medium 30×16, 12px dot     large 48×24, 20px dot
 *   The dot is trackH - 4 and sits 2px in on every side.
 *   The ROOT keeps a 24×24 box for the WCAG 2.2 AA touch target even where the
 *   track is smaller.
 *
 * ICON: on by default, as Figma's Icon boolean — a check when ON, a close (×)
 *   when OFF, inside the dot and painted in the track's own fill. icon={false}
 *   hides both. Pass a node to `icon` for the same glyph both ways, or
 *   `iconOn` / `iconOff` for one side — each falls back to `icon`, then to the
 *   default.
 *
 * STATES: checked | unchecked | disabled | hover | active | focus-visible
 *   Hover and press lift the TRACK. Focus draws a 1px --Focus-Visible ring
 *   outside the track. Disabled dims the whole control to --Disabled (0.38).
 */

const COLORS = ['default', 'primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// --- Variant Style Builders --------------------------------------------------

// The Figma component is THEME-DRIVEN: it reads the surface tokens of whatever
// data-theme / data-surface it is placed in, rather than a per-color Buttons-*
// ramp. On is the surface's --Border with a --Text dot; off is --Background
// with a --Quiet border and dot. That is what `default` renders, and it is the
// only model the design file has — the color variants below are the lib's own
// addition and keep working on the same geometry.
//
// iconOff/iconOn are the track's own fill, so a glyph inside the dot reads as a
// knockout rather than a second color.
export function themedStyles() {
  return {
    type: 'themed',
    // No fill: Figma's Off Switch-Body is only its Quiet edge, so the track
    // shows whatever it sits on.
    trackOff:       'transparent',
    trackOffBorder: 'var(--Quiet)',
    // ON is a FILLED track with a knockout dot, painted from the ICONS
    // collection — Figma binds Switch-Body's fill AND stroke to Icons::Icon and
    // the Dot's fill to Icons::On-Icon (verified on the Switch set, all three
    // On variants). Icons is a mode collection like Buttons, so a mode there
    // flattens into the name: mode Default x var Icon -> --Icons-Default.
    //
    // This replaced --Buttons-*-Button / -Text. That pair was chosen to escape
    // the design file's original --Border / --Text, which resolved to #784284
    // on #593462 on Popsicles' Default surface — a 1.39:1 dot. Icon / On-Icon
    // is the pair the system now publishes for exactly this shape (a fill and
    // a mark ON that fill), and the generator picks On-Icon by resolving the
    // icon's rendered tone and indexing the Text table at it, so the 4.5:1 is
    // structural rather than a second contrast pass.
    //
    // The track's border is the SAME token as its fill. Figma binds both to
    // Icon; there is no separate edge color in the On state.
    /* PRIMARY, not Default, and the difference is a mode rather than a token.
     *
     * The Figma set pins `Icons=Primary`, so a switch dropped in the file
     * resolves `Icons::Icon` through the Primary palette — that pin IS the
     * component's default appearance. `--Icons-Default` is a different thing:
     * the Default MODE of the same collection, which resolves to
     * Neutral-Color-4. Reading it here made the library's default switch grey
     * while every switch in the design file was the brand's color.
     *
     * CSS has no modes, so the mode a component pins has to be spelt as the
     * token that mode resolves to. Pinned Primary means --Icons-Primary. */
    trackOn:        'var(--Icons-Primary)',
    trackOnBorder:  'var(--Icons-Primary)',
    dotOff:         'var(--Quiet)',
    dotOn:          'var(--Icons-On-Primary)',
    // Off: the glyph sits on the Quiet dot in On-Icon (Figma's Icons::On-Icon).
    iconOff:        'var(--Icons-On-Primary)',
    // An icon inside the dot sits ON On-Icon, so it returns to Icon — the same
    // alternation the collection is built around.
    iconOn:         'var(--Icons-Primary)',
  };
}

export function outlineStyles(color) {
  const C = cap(color);
  return {
    type: 'outline',
    color: C,
    trackOff:       'transparent',
    /* --Border, not --Border-Variant. In the OFF state this edge is the only
       thing drawing the control at all — the track is the page color — so it
       is the control's boundary and carries WCAG 1.4.11's 3:1. Border-Variant
       is documented as DECORATIVE and guarantees no ratio, which is the same
       mistake Slider's rail had before it was moved to --Border. */
    trackOffBorder: 'var(--Border)',
    // ON is a FILLED track, same as the design's default. It used to be
    // transparent, which read as "nothing happened" next to the default
    // variant — only the border changed color. Fill, edge and dot come from
    // the Icons collection; see themedStyles above for why.
    trackOn:        'var(--Icons-' + C + ')',
    trackOnBorder:  'var(--Icons-' + C + ')',
    dotOff:         'var(--Quiet)',
    dotOn:          'var(--Icons-On-' + C + ')',
    iconOff:        'var(--Icons-On-' + C + ')',
    iconOn:         'var(--Icons-' + C + ')',
  };
}

// The `-light` shape is removed here too. It filled the track with
// --<C>-Color-11 and drew the dot in --Buttons-<C>-Border — a tinted fill that
// is not a shape in the Figma component. The Switch set has exactly two axes,
// State and Status, so there was never a variant to check it against; the ON
// state's color now arrives from the Icons collection instead.
//
// A hard delete would have been silent: an unknown variant falls through to
// `variantMap.default`, so every existing `X-light` call site would have
// repainted as the brand-default switch with no error. Strip the suffix to the
// color of the same name and say so once in development — the same treatment
// Button, Chip and Badge got in 0.9.0.
const LIGHT_SUFFIX = /-light$/;
const warnedVariants = new Set();

export function normalizeSwitchVariant(variant) {
  const v = String(variant || 'default');
  if (v !== 'light' && !LIGHT_SUFFIX.test(v)) return v;
  const base = v === 'light' ? 'primary' : v.replace(LIGHT_SUFFIX, '');
  if (process.env.NODE_ENV !== 'production' && !warnedVariants.has(v)) {
    warnedVariants.add(v);
    console.warn(
      '[Switch] variant="' + v + '" — the -light shape was removed. Rendering ' +
      'variant="' + base + '". The on state takes its color from the Icons ' +
      'collection (--Icons-<Color> / --Icons-On-<Color>).',
    );
  }
  return base;
}

function buildVariantMap() {
  const map = {};
  COLORS.forEach((color) => {
    /* BOTH spellings, for every color.
       Only `-outline` was registered here, plus `primary` as a one-off at the
       bottom — so `secondary`, `tertiary`, `neutral`, `info`, `success`,
       `warning` and `error` were not in the map at all and fell through to the
       default. Nine documented variants, one color on screen, and primary the
       only one that looked right because it was the only one written down.
       The suffix is vestigial on this component: the Figma set has State and
       Status axes and no shape axis, so there is no outline shape for
       `{color}-outline` to mean. It stays because the prop table documents it
       and a published spelling that stops resolving is worse than a redundant
       one. */
    map[color]             = outlineStyles(color);
    map[color + '-outline'] = outlineStyles(color);
  });
  // `default` in every spelling is the design-file switch.
  map['default']         = themedStyles();
  map['default-outline'] = themedStyles();
  map['outline']         = themedStyles();
  return map;
}

// --- Sizing ------------------------------------------------------------------

// WCAG 2.2 AA. The design's small switch is 12px tall, which is far under the
// minimum tappable size, so the ROOT keeps a 24px box around the track. The
// track itself still renders at the design's size.
const TOUCH_MIN = 24;

// Straight from the Figma variant matrix.
//
// The dot is trackH - 4: Figma strokes the track on the INSIDE, so the 1px
// border overlaps the 2px padding instead of adding to it, and the dot ends up
// 2px in from the outer edge on every side.
//
// The focus ring is the track + 4px (2px a side). The design file positions it
// at -3px on the left, which would make it 1px lop-sided; it is centred here.
const THUMB_INSET = 2;

/* Figma's Component-Size collection, not a ramp fitted here.
   These were 28x16 and 40x24 at small and medium against the collection's 35x20
   and 42x24 — large matched, which is how it went unnoticed: one size agreeing
   reads as the set agreeing. The values are published per mode and each one was
   chosen, so a switch scaled by ratio lands on numbers the system does not
   contain. docs/foundations.js carries the same table, and
   SwitchSizeParity.test.js asserts the two against each other. */
const SIZE_MAP = {
  small:  { trackW: 35, trackH: 20, handle: 15, dotRadius: 'var(--Sizing-2, 16px)',          icon: 12 },
  medium: { trackW: 42, trackH: 24, handle: 20, dotRadius: 'var(--Sizing-2-and-Half, 20px)', icon: 16 },
  large:  { trackW: 56, trackH: 32, handle: 28, dotRadius: 'var(--Sizing-2-and-Half, 20px)', icon: 24 },
};

// --- Static sheet ------------------------------------------------------------
//
// Switch was MUI's Switch (SwitchBase on ButtonBase) with an sx override. It
// is now its own markup over the same tokens, with the same parts and class
// names — .MuiSwitch-root > .MuiSwitch-switchBase (> input + .MuiSwitch-thumb)
// + .MuiSwitch-track — so a consumer rule that targeted them still lands.
//
// The rules keep the selectors and weights the sx produced (root class, then
// the MUI part classes under it), so a caller's sx — which emotion appends
// after this sheet — still wins wherever it did. Size and colour arrive as
// custom properties declared on the root by one class each; nothing between
// the root and its parts sets a data-theme, so the tokens resolve against the
// same scope they did when the parts named them directly.
const SxBox = lazySxBox('Switch');
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
const SIZE_KEY = { small: 'sm', medium: 'md', large: 'lg' };
const MOTION_FAST = 'var(--Motion-Duration-Fast, 150ms) var(--Motion-Easing-Standard, cubic-bezier(0.2, 0, 0, 1))';
const VARIANT_CLASSES = [['default', themedStyles()], ...COLORS.filter((c) => c !== 'default').map((c) => [c, outlineStyles(c)])];
const variantClass = (resolved) => {
  const s = buildVariantMap()[resolved];
  if (!s || s.type === 'themed') return 'default';
  return s.color.toLowerCase();
};

registerStaticStyles('omni-switch', [
  '.omni-sw{display:inline-flex;box-sizing:border-box;position:relative;flex-shrink:0;z-index:0;vertical-align:middle;'
    + 'width:var(--_sw-tw);min-width:24px;height:var(--_sw-rh);min-height:24px;padding:0;overflow:visible;opacity:1}',
  // The design dims the WHOLE control rather than its parts.
  '.omni-sw-off{opacity:var(--Disabled, 0.38)}',
  '@media print{.omni-sw{print-color-adjust:exact}}',
  ...Object.entries(SIZE_KEY).map(([size, k]) => {
    const sc = SIZE_MAP[size];
    const rootW = Math.max(TOUCH_MIN, sc.trackW);
    const rootH = Math.max(TOUCH_MIN, sc.trackH);
    return `.omni-sw-${k}{--_sw-tw:${sc.trackW}px;--_sw-th:${sc.trackH}px;--_sw-rh:${rootH}px;`
      + `--_sw-top:${(rootH - sc.trackH) / 2}px;--_sw-pr:${rootW - sc.trackW + THUMB_INSET}px;`
      + `--_sw-dot:${sc.handle}px;--_sw-dot-r:${sc.dotRadius};--_sw-icon:${sc.icon}px}`;
  }),
  ...VARIANT_CLASSES.map(([name, s]) => `.omni-sw-v-${name}{--_sw-track-off:${s.trackOff};--_sw-track-off-border:${s.trackOffBorder};`
    + `--_sw-track-on:${s.trackOn};--_sw-track-on-border:${s.trackOnBorder};--_sw-dot-off:${s.dotOff};--_sw-dot-on:${s.dotOn};`
    + `--_sw-icon-off:${s.iconOff};--_sw-icon-on:${s.iconOn}}`),
  /* The switch base: ButtonBase's reset. It FILLS the root and places the
     thumb with padding, so the <input> hit area is the whole 24px root. */
  '.omni-sw-base{display:inline-flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;'
    + 'box-sizing:border-box;-webkit-tap-highlight-color:transparent;background-color:transparent;outline:0;border:0;margin:0;'
    + 'cursor:pointer;user-select:none;vertical-align:middle;-moz-appearance:none;-webkit-appearance:none;appearance:none;'
    + 'text-decoration:none;padding:9px;border-radius:50%;position:absolute;top:0;left:0;z-index:1;color:transparent}',
  '.omni-sw-base::-moz-focus-inner{border-style:none}',
  '.omni-sw-base.Mui-disabled{pointer-events:none;cursor:default}',
  '.omni-sw .MuiSwitch-switchBase{' + `position:absolute;top:0;left:0;width:100%;height:100%;display:flex;-webkit-box-pack:start;justify-content:flex-start;`
    + '-webkit-box-align:center;align-items:center;padding-top:0;padding-bottom:0;padding-left:' + THUMB_INSET + 'px;'
    + 'padding-right:var(--_sw-pr);color:transparent;'
    /* KNOWN DEFECT: justify-content is a discrete property, so this
       transition is inert and the thumb snaps between ends. */
    + 'transition:justify-content var(--Motion-Duration-Instant, 100ms) var(--Motion-Easing-Standard, cubic-bezier(0.2, 0, 0, 1));'
    + 'transform:none}',
  `.omni-sw .MuiSwitch-switchBase .MuiSwitch-input{left:0;top:0;width:100%;height:100%;margin:0}`,
  `.omni-sw .MuiSwitch-switchBase .MuiSwitch-thumb{width:var(--_sw-dot);height:var(--_sw-dot);border-radius:var(--_sw-dot-r);box-shadow:none;`
    + 'border-width:medium;border-style:none;border-color:currentcolor;border-image:none;display:flex;'
    + '-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;'
    + `transition:background-color ${MOTION_FAST};background-color:var(--_sw-dot-off);color:var(--_sw-icon-off)}`,
  `.omni-sw .MuiSwitch-switchBase .MuiSwitch-thumb > *{width:var(--_sw-icon);height:var(--_sw-icon);display:block}`,
  // ON
  `.omni-sw .MuiSwitch-switchBase.Mui-checked{-webkit-box-pack:end;justify-content:flex-end;transform:none}`,
  `.omni-sw .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb{background-color:var(--_sw-dot-on);color:var(--_sw-icon-on)}`,
  `.omni-sw .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track{background-color:var(--_sw-track-on);border-color:var(--_sw-track-on-border);opacity:1}`,
  /* Hover lifts the TRACK — Figma's Buttons-Hover effect style (Level 2).
     Pressed does not lift, as Button: the toggle is its own feedback. */
  `.omni-sw .MuiSwitch-switchBase:hover,.omni-sw .MuiSwitch-switchBase.Mui-checked:hover{background-color:transparent}`,
  `.omni-sw .MuiSwitch-switchBase:hover + .MuiSwitch-track{box-shadow:${SHADOW_LEVEL_2}}`,
  `.omni-sw .MuiSwitch-switchBase:active + .MuiSwitch-track{box-shadow:none}`,
  /* Focus ring sits OUTSIDE the track, not on the dot: the house 2px ring,
     1px clear. */
  `.omni-sw .MuiSwitch-switchBase.Mui-focusVisible + .MuiSwitch-track{outline-width:2px;outline-style:solid;outline-color:var(--Focus-Visible);outline-offset:1px}`,
  `.omni-sw .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track{opacity:1}`,
  '.omni-sw-input{cursor:inherit;position:absolute;opacity:0;width:100%;height:100%;top:0;left:0;margin:0;padding:0;z-index:1}',
  /* The default glyphs, as SvgIcon drew them: 1.5rem, sized down by the
     thumb's `> *` rule above. */
  `.omni-sw-glyph{${SVG_ICON_DECLS};font-size:1.5rem}`,
  /* With no glyph the thumb is MUI's own thumb element, which is border-box. */
  '.omni-sw-thumb-plain{box-sizing:border-box}',
  /* MUI's track base sits under the design's track rule, which overrides all
     of it but the stacking. */
  '.omni-sw-track{height:100%;width:100%;border-radius:7px;box-sizing:border-box;border:1px solid transparent;z-index:-1;'
    + 'transition:opacity 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);'
    + 'background-color:rgb(0, 0, 0);opacity:0.38}',
  '.omni-sw .MuiSwitch-track{width:var(--_sw-tw);height:var(--_sw-th);border-radius:var(--Sizing-3, 24px);'
    + 'background-color:var(--_sw-track-off);border-width:1px;border-style:solid;border-color:var(--_sw-track-off-border);'
    + 'box-sizing:border-box;opacity:1;position:absolute;top:var(--_sw-top);left:0;'
    + `transition:background-color ${MOTION_FAST},border-color ${MOTION_FAST},box-shadow ${MOTION_FAST}}`,
  /* The label: the Label style's size and weight; the colour and the dim are
     two classes deep because the Typography sheet's colour class is one and
     either sheet may load first. */
  '.omni-type.omni-sw-text{color:var(--Text);opacity:1}',
  '.omni-type.omni-sw-text-off{color:var(--Text-Quiet);opacity:var(--Disabled, 0.38)}',
].join('\n'));

const capFirst = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const isHandler = (key, v) => /^on[A-Z]/.test(key) && typeof v === 'function';
function matchesFocusVisible(el) {
  try { return el.matches(':focus-visible'); } catch (e) { return false; }
}

// --- Component ---------------------------------------------------------------

export function Switch({
  variant = 'default',
  size = 'medium',
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  label,
  labelPlacement = 'end',
  name,
  value,
  // Optional glyph inside the dot — the design's `icon` boolean, as slots.
  // Sized to the design's 8px (small/medium) or 16px (large) and painted in the
  // track's own fill.
  //
  // The design draws a different glyph either side of the toggle, so ON and OFF
  // are separate slots. `icon` is the shorthand for "same glyph both ways";
  // iconOn / iconOff override it per state.
  icon,
  iconOn,
  iconOff,
  className = '',
  sx = {},
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  /* What MUI's SwitchBase routed to the <input> rather than the switch base. */
  id,
  inputRef,
  inputProps,
  autoFocus,
  required = false,
  readOnly,
  tabIndex,
  onFocus,
  onBlur,
  /* MUI's palette prop. It only ever named a class here — `variant` picks the
     colour — and still does. */
  color = 'primary',
  ...props
}) {
  useStaticStyles('omni-switch');
  const resolvedVariant = normalizeSwitchVariant(variant);
  const sizeKey = SIZE_MAP[size] ? size : 'medium';
  // The Label type style, as SwitchField's Form-Label sets it.
  const LabelComp = size === 'small' ? LabelSmall : size === 'large' ? LabelLarge : Label;

  const { current: isControlled } = useRef(checked !== undefined);
  const [checkedState, setCheckedState] = useState(Boolean(defaultChecked));
  const isChecked = isControlled ? checked : checkedState;
  const [focusVisible, setFocusVisible] = useState(false);

  // The input names the control. role="switch" comes first so a caller's
  // inputProps can still override it, as MUI merged them.
  const external = {
    role: 'switch',
    ...inputProps,
    ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
    ...(ariaLabelledby ? { 'aria-labelledby': ariaLabelledby } : {}),
  };
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
  };
  const handleFocus = (event) => {
    if (matchesFocusVisible(event.target)) setFocusVisible(true);
    if (onFocus) onFocus(event);
  };
  const handleBlur = (event) => {
    if (!matchesFocusVisible(event.target)) setFocusVisible(false);
    if (onBlur) onBlur(event);
  };

  // The thumb holds the glyph — a check ON and a close (×) OFF by default.
  const showIcons = icon !== false && icon !== null;
  const pickGlyph = (side, fallback) => (side !== undefined ? side : (icon !== undefined && icon !== true ? icon : fallback));
  const glyphOff = showIcons ? pickGlyph(iconOff, <Glyph name="Close" className="omni-sw-glyph" />) : undefined;
  const glyphOn  = showIcons ? pickGlyph(iconOn, <Glyph name="Check" className="omni-sw-glyph" />) : undefined;

  const switchBase = (
    <span
      className={'MuiButtonBase-root MuiSwitch-switchBase MuiSwitch-color' + capFirst(color) + ' PrivateSwitchBase-root'
        + (isChecked ? ' Mui-checked' : '') + (disabled ? ' Mui-disabled' : '') + (focusVisible ? ' Mui-focusVisible' : '')
        + ' omni-sw-base'}
      {...props}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <input
        {...inputHandlers}
        onChange={handleInputChange}
        autoFocus={autoFocus}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        id={id}
        name={name}
        readOnly={readOnly}
        required={required}
        tabIndex={tabIndex}
        type="checkbox"
        {...(value === undefined ? {} : { value })}
        {...inputRest}
        className={'PrivateSwitchBase-input MuiSwitch-input omni-sw-input' + (inputClassName ? ' ' + inputClassName : '')}
        ref={inputRef}
      />
      {showIcons
        ? <span className="MuiSwitch-thumb">{isChecked ? glyphOn : glyphOff}</span>
        : <span className="MuiSwitch-thumb omni-sw-thumb-plain" />}
    </span>
  );

  const rootProps = {
    className: 'MuiSwitch-root MuiSwitch-sizeMedium switch-' + resolvedVariant + ' ' + className
      + ' omni-sw omni-sw-' + SIZE_KEY[sizeKey] + ' omni-sw-v-' + variantClass(resolvedVariant) + (disabled ? ' omni-sw-off' : ''),
  };
  const children = (
    <>
      {switchBase}
      <span className="MuiSwitch-track omni-sw-track" />
    </>
  );
  const switchElement = hasSx(sx)
    ? <SxBox component="span" sx={sx} {...rootProps}>{children}</SxBox>
    : <span {...rootProps}>{children}</span>;

  if (label) {
    return (
      <ControlLabel
        control={switchElement}
        label={
          // Size and weight are the Label style's (Figma's Dynamic-Label),
          // as Radio and Checkbox.
          <LabelComp component="span" className={'MuiBox-root omni-sw-text' + (disabled ? ' omni-sw-text-off' : '')}>
            {label}
          </LabelComp>
        }
        // FormControlLabel took `disabled` from its control.
        disabled={disabled}
        labelPlacement={labelPlacement}
        size={size === 'small' || size === 'large' ? size : 'medium'}
      />
    );
  }

  return switchElement;
}


// ─── Convenience Exports ──────────────────────────────────────────────────────

// Solid
export const PrimarySwitch                = (p) => <Switch variant="primary"              {...p} />;
export const SecondarySwitch              = (p) => <Switch variant="secondary"            {...p} />;
export const TertiarySwitch               = (p) => <Switch variant="tertiary"             {...p} />;
export const NeutralSwitch                = (p) => <Switch variant="neutral"              {...p} />;
export const InfoSwitch                   = (p) => <Switch variant="info"                 {...p} />;
export const SuccessSwitch                = (p) => <Switch variant="success"              {...p} />;
export const WarningSwitch                = (p) => <Switch variant="warning"              {...p} />;
export const ErrorSwitch                  = (p) => <Switch variant="error"                {...p} />;

// Outline
export const PrimaryOutlineSwitch         = (p) => <Switch variant="primary-outline"      {...p} />;
export const SecondaryOutlineSwitch       = (p) => <Switch variant="secondary-outline"    {...p} />;
export const TertiaryOutlineSwitch        = (p) => <Switch variant="tertiary-outline"     {...p} />;
export const NeutralOutlineSwitch         = (p) => <Switch variant="neutral-outline"      {...p} />;
export const InfoOutlineSwitch            = (p) => <Switch variant="info-outline"         {...p} />;
export const SuccessOutlineSwitch         = (p) => <Switch variant="success-outline"      {...p} />;
export const WarningOutlineSwitch         = (p) => <Switch variant="warning-outline"      {...p} />;
export const ErrorOutlineSwitch           = (p) => <Switch variant="error-outline"        {...p} />;


// Legacy alias
export const SwitchInput = Switch;

export default Switch;