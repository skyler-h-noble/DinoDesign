// src/components/NumberField/NumberField.js
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { Icon } from '../Icon/Icon';
import { Body, BodySmall } from '../Typography';
import { SHADOW_LEVEL_1, SHADOW_LEVEL_2 } from '../_shadows';
/* The SAME map Input uses, imported rather than copied. A NumberField beside an
   Input must not read as a different control, and two copies of a mapping drift
   the first time one is edited. */
import { FLOATING_LABEL_STYLE } from '../Input/Input';

/**
 * NumberField Component
 *
 * VARIANTS:
 *   outlined  Input with up/down stepper buttons inside right edge.
 *   spinner   Standalone −/+ buttons flanking a centered number.
 *
 * COLORS: default | primary | secondary | tertiary | neutral | info | success | warning | error
 *
 * STYLE: outline | light
 *   outline: outer border + data-surface="Container"
 *   light:   outer border + data-theme="{C}-Light" data-surface="Surface-Dim"
 *
 * SIZES: small | medium | large (matches button heights)
 *
 * LABEL: top | floating | none
 */

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const SIZE_MAP = {
  small:  { height: 'var(--Small-Button-Height)', fontSize: '13px', padding: '4px 8px',  iconSize: 16, btnSize: 28 },
  medium: { height: 'var(--Button-Height)',        fontSize: '14px', padding: '6px 12px', iconSize: 18, btnSize: 36 },
  large:  { height: 'var(--Large-Button-Height)',  fontSize: '16px', padding: '8px 16px', iconSize: 20, btnSize: 44 },
};

export function NumberField({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  min,
  max,
  step = 1,
  variant = 'outlined',   // 'outlined' | 'spinner'
  style: styleVariant = 'outline', // 'outline' | 'light'
  color = 'default',
  size = 'medium',
  label,
  labelPosition = 'top',
  placeholder,
  helperText,
  disabled = false,
  fullWidth = false,
  className = '',
  sx = {},
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const isControlled = controlledValue !== undefined;
  const current = isControlled ? controlledValue : internalValue;
  const hasValue = current !== '' && current != null;

  const effectiveColor = color === 'default' ? 'primary' : color;
  const C = cap(effectiveColor);
  const isLight = styleVariant === 'light';
  /* The design draws the field from the SURFACE tokens, not the button palette:
     border --Border, fill --Background, and the steppers use --Hover/--Pressed.
     A named `color` still routes through the button palette, which is what makes
     color="success" a themed field — but `default` now matches the design
     instead of borrowing a button's border. */
  const borderToken = color === 'default'
    ? 'var(--Border)'
    : 'var(--Buttons-' + C + '-Border)';
  const fieldBg = color === 'default'
    ? 'var(--Background)'
    : 'var(--Buttons-' + C + '-Light-Button, var(--Background))';
  const activeTextColor = color === 'default' ? 'var(--Text)' : 'var(--Text-' + C + ')';

  const isOutlined = variant === 'outlined';
  const isSpinner = variant === 'spinner';
  const isFloating = labelPosition === 'floating';
  const isTop = labelPosition === 'top';

  const sc = SIZE_MAP[size] || SIZE_MAP.medium;
  const LabelComp = size === 'small' ? BodySmall : Body;

  const setValue = useCallback((next) => {
    let v = typeof next === 'number' ? next : parseFloat(next);
    if (isNaN(v)) v = 0;
    if (min !== undefined && v < min) v = min;
    if (max !== undefined && v > max) v = max;
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
  }, [isControlled, onChange, min, max]);

  // Keep latest value in a ref so press-and-hold intervals don't see a stale closure.
  const currentRef = useRef(current);
  currentRef.current = current;

  const stepBy = useCallback((dir) => {
    if (disabled) return;
    const base = typeof currentRef.current === 'number' ? currentRef.current : parseFloat(currentRef.current) || 0;
    const next = base + dir * step;
    if (min !== undefined && dir < 0 && base <= min) return;
    if (max !== undefined && dir > 0 && base >= max) return;
    setValue(next);
  }, [disabled, step, min, max, setValue]);

  const increment = () => stepBy(1);
  const decrement = () => stepBy(-1);
  const atMin = min !== undefined && current <= min;
  const atMax = max !== undefined && current >= max;

  // Press-and-hold to repeat. Initial delay then accelerating interval.
  const holdTimeoutRef = useRef(null);
  const holdIntervalRef = useRef(null);

  const stopHold = useCallback(() => {
    if (holdTimeoutRef.current) { clearTimeout(holdTimeoutRef.current); holdTimeoutRef.current = null; }
    if (holdIntervalRef.current) { clearInterval(holdIntervalRef.current); holdIntervalRef.current = null; }
  }, []);

  const startHold = useCallback((dir) => {
    if (disabled) return;
    stopHold();
    // First tick fires immediately on press.
    stepBy(dir);
    // After a short delay, begin repeating.
    holdTimeoutRef.current = setTimeout(() => {
      let interval = 120;
      let ticks = 0;
      const tick = () => {
        stepBy(dir);
        ticks += 1;
        // Accelerate after sustained hold.
        if (ticks === 10 && interval > 60) {
          clearInterval(holdIntervalRef.current);
          interval = 60;
          holdIntervalRef.current = setInterval(tick, interval);
        } else if (ticks === 30 && interval > 30) {
          clearInterval(holdIntervalRef.current);
          interval = 30;
          holdIntervalRef.current = setInterval(tick, interval);
        }
      };
      holdIntervalRef.current = setInterval(tick, interval);
    }, 400);
  }, [disabled, stepBy, stopHold]);

  useEffect(() => stopHold, [stopHold]);

  /* Did a pointer sequence already step? Then the click that follows it must
     not step again. Ref, not state, because it is read and written inside one
     event sequence and a re-render between them would lose the guard. */
  const pointerSteppedRef = useRef(false);

  const holdHandlers = (dir) => ({
    onPointerDown: (e) => {
      // Only respond to primary button / touch / pen.
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();
      try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch (_) {}
      pointerSteppedRef.current = true;
      startHold(dir);
    },
    /* A CLICK with no pointer sequence before it still has to work.
     *
     * The stepper bound pointer and key handlers only, so a mouse press worked
     * and a keyboard press worked — but a synthetic click did nothing. Screen
     * readers and voice control routinely dispatch a bare `click` with no
     * preceding pointerdown, so "Increase" was inert for exactly the users who
     * cannot press and hold. It failed silently: the button was focusable,
     * announced correctly, and did nothing.
     *
     * Guarded so a real pointer press does not step twice — pointerdown fires
     * first, sets the flag, and the click that follows is ignored. */
    onClick: () => {
      if (pointerSteppedRef.current) { pointerSteppedRef.current = false; return; }
      stepBy(dir);
    },
    onPointerUp: (e) => {
      try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch (_) {}
      stopHold();
    },
    onPointerCancel: stopHold,
    onPointerLeave: stopHold,
    // Keyboard accessibility: hold Enter/Space to repeat.
    onKeyDown: (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
        e.preventDefault();
        startHold(dir);
      }
    },
    onKeyUp: (e) => {
      if (e.key === 'Enter' || e.key === ' ') stopHold();
    },
    onBlur: stopHold,
  });

  const handleInputChange = (e) => {
    const raw = e.target.value;
    if (raw === '' || raw === '-') {
      if (!isControlled) setInternalValue(raw);
      return;
    }
    const num = parseFloat(raw);
    if (!isNaN(num)) setValue(num);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') { e.preventDefault(); increment(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); decrement(); }
  };

  /* Stepper button.
   *
   * TRANSPARENT AT REST, so the field's own fill shows through — the design has
   * no separate button colour, only the hover and pressed states appearing on
   * top of it. It previously painted --Buttons-{C}-Light-Button at rest, which
   * put a visible block in the corner of every field.
   *
   * The state tokens are the SURFACE ones (--Hover, --Pressed), not the button
   * palette's, because these sit on the field's surface rather than being
   * buttons in their own right.
   *
   * FOCUS is an INSET border, not an offset outline. The steppers live inside a
   * clipped container, so an outline drawn outside the element is cut off by
   * the field's own overflow:hidden — it was invisible on the very control that
   * most needs it. */
  const stepperSx = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'transparent',
    color: color === 'default' ? 'var(--Text)' : 'var(--Text-' + C + ')',
    cursor: 'pointer', outline: 'none', flexShrink: 0, border: 'none', padding: 0,
    borderRadius: 'var(--Button-Icon-Radius, 0)',
    transition: 'background-color 0.15s ease',
    '&:hover:not(:disabled)': { backgroundColor: 'var(--Hover)' },
    '&:active:not(:disabled)': { backgroundColor: 'var(--Pressed)' },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: 'inset 0 0 0 1px var(--Focus-Visible)',
    },
    /* --Disabled is the system's own 0.38, not a number picked here. */
    '&:disabled': { opacity: 'var(--Disabled, 0.38)', cursor: 'not-allowed' },
  };

  // No data-surface — inherit parent scope; field uses --Hover for affordance.
  const innerAttrs = {};

  const renderLabel = () => {
    if (!isTop || !label) return null;
    return (
      <LabelComp
        component="label"
        style={{
          display: 'block', marginBottom: '6px',
          color: disabled ? 'var(--Quiet)' : 'var(--Text)',
          fontWeight: 500,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {label}
      </LabelComp>
    );
  };

  /* ─── OUTLINED ─── */
  if (isOutlined) {
    return (
      <Box
        className={'numberfield numberfield-outlined' +
          (disabled ? ' numberfield-disabled' : '') +
          (className ? ' ' + className : '')}
        sx={{ width: fullWidth ? '100%' : 'auto', fontFamily: 'inherit', ...sx }}
        {...props}
      >
        {renderLabel()}

        {/* Outer border shell — size-aware Input-Radius. */}
        <Box sx={{
          border: '1px solid ' + borderToken,
          borderRadius: size === 'small'
            ? 'var(--Sm-Input-Radius, var(--Input-Radius, var(--Style-Border-Radius)))'
            : size === 'large'
              ? 'var(--Lg-Input-Radius, var(--Input-Radius, var(--Style-Border-Radius)))'
              : 'var(--Input-Radius, var(--Style-Border-Radius))',
          overflow: 'hidden',
          transition: 'border-color 0.15s ease',
          boxShadow: 'none',
          opacity: disabled ? 0.5 : 1,
          '&:focus-within': {
            outline: '2px solid var(--Focus-Visible)',
            outlineOffset: '2px',
          },
        }}>

        {/* Inner wrapper (no data-surface; --Hover for field bg) */}
        <Box {...innerAttrs}>
          <Box sx={{
            position: 'relative', display: 'flex', alignItems: 'stretch',
            /* The stepper stack sets the floor.
             *
             * Two buttons at --Sizing-3 with a 1px rule between them is 49px,
             * and each of those 24px is the minimum target area — they cannot
             * be shorter. So the FIELD cannot be shorter either, whatever its
             * size prop says: --Small-Button-Height is 24px and --Button-Height
             * is 32px, and both would have clipped the steppers.
             *
             * They used to be `flex: 1`, which "fixed" this by letting each
             * button shrink to 11px in a small field — below the minimum, and
             * invisible as a bug because the icons still drew. */
            minHeight: 'max(' + sc.height + ', calc(var(--Sizing-3, 24px) * 2 + 1px))',
            /* --Background, not --Hover. The field was painting its own HOVER
               colour at rest, which left nothing for hover to move to and made
               every field read as already-interacted-with. */
            backgroundColor: fieldBg,
          }}>
            {/* Floating label.
              *
              * Two design-system text styles, not one size scaled: at rest it
              * sits where the input TEXT will be, so it is Body; shrunk it is a
              * label above the text, so it is Label. Same mapping Input uses.
              *
              * It was hardcoded — left:'14px' whatever the padding, fontSize
              * from sc, and scale(0.75) on top. scale() shrinks the RENDERED
              * PIXELS, so weight and tracking shrank with it and the result was
              * a squashed Body rather than a Label. */}
            {isFloating && label && (
              <Box sx={{
                position: 'absolute',
                top: hasValue || focused ? '6px' : '50%',
                left: sc.padding.split(' ')[1] || '14px',
                transform: hasValue || focused ? 'none' : 'translateY(-50%)',
                transformOrigin: 'top left',
                color: focused ? activeTextColor : 'var(--Quiet)',
                fontFamily: 'var(--Font-Families-Body, var(--Body-Font-Family))',
                ...(hasValue || focused
                  ? {
                      fontSize:      'var(--' + (FLOATING_LABEL_STYLE[size] || FLOATING_LABEL_STYLE.medium).shrunk + '-Font-Size)',
                      fontWeight:    'var(--' + (FLOATING_LABEL_STYLE[size] || FLOATING_LABEL_STYLE.medium).shrunk + '-Font-Weight)',
                      letterSpacing: 'var(--' + (FLOATING_LABEL_STYLE[size] || FLOATING_LABEL_STYLE.medium).shrunk + '-Letter-Spacing)',
                    }
                  : {
                      fontSize:      'var(--' + (FLOATING_LABEL_STYLE[size] || FLOATING_LABEL_STYLE.medium).resting + '-Font-Size)',
                      fontWeight:    'var(--' + (FLOATING_LABEL_STYLE[size] || FLOATING_LABEL_STYLE.medium).resting + '-Font-Weight)',
                      letterSpacing: 'var(--' + (FLOATING_LABEL_STYLE[size] || FLOATING_LABEL_STYLE.medium).resting + '-Letter-Spacing)',
                    }),
                pointerEvents: 'none',
                transition: 'top 0.15s ease, font-size 0.15s ease, color 0.15s ease',
                zIndex: 1,
              }}>
                {label}
              </Box>
            )}

            {/* Input */}
            <Box
              component="input"
              ref={inputRef}
              type="text"
              inputMode="numeric"
              role="spinbutton"
              aria-valuenow={typeof current === 'number' ? current : undefined}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-label={label || 'Number'}
              value={current}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={disabled}
              placeholder={isFloating ? undefined : (placeholder || '')}
              sx={{
                flex: 1, border: 'none', outline: 'none',
                backgroundColor: 'transparent',
                color: (hasValue || focused) ? activeTextColor : 'var(--Quiet)',
                fontSize: sc.fontSize,
                fontFamily: 'var(--Body-Font-Family)',
                fontWeight: 'var(--Body-Font-Weight)',
                padding: isFloating ? '22px 14px 6px' : sc.padding,
                minWidth: 0,
                '&::placeholder': { color: 'var(--Quiet)', opacity: 1 },
                '&:disabled': { cursor: 'not-allowed' },
              }}
            />

            {/* Up/Down steppers.
              *
              * A fixed-height pair CENTRED in the column, not two halves
              * stretched to fill it. They were `flex: 1`, so each button grew to
              * half the field — 22px in a small field, 36px in a large one, and
              * the icons floated in the middle of a tall empty box. The design
              * has them at a constant --Sizing-3 whatever the field height, with
              * the column centring the pair.
              *
              * The rule between them is a Box rather than <Divider>: it is a
              * 1px line inside a compound component, and importing Divider here
              * brings its own margins and orientation logic for no gain. */}
            <Box sx={{
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'stretch',
              borderLeft: '1px solid ' + borderToken,
              flexShrink: 0,
            }}>
              <Box component="button" type="button" aria-label="Increase" {...holdHandlers(1)}
                disabled={disabled || atMax}
                sx={{ ...stepperSx, width: 'var(--Sizing-4, 32px)', height: 'var(--Sizing-3, 24px)' }}>
                <Icon size="medium"><KeyboardArrowUpIcon /></Icon>
              </Box>
              <Box aria-hidden="true" sx={{
                height: '1px', backgroundColor: borderToken, flexShrink: 0,
              }} />
              <Box component="button" type="button" aria-label="Decrease" {...holdHandlers(-1)}
                disabled={disabled || atMin}
                sx={{ ...stepperSx, width: 'var(--Sizing-4, 32px)', height: 'var(--Sizing-3, 24px)' }}>
                <Icon size="medium"><KeyboardArrowDownIcon /></Icon>
              </Box>
            </Box>
          </Box>
        </Box>
        </Box>

        {/* Helper */}
        {helperText && (
          <BodySmall style={{ color: 'var(--Quiet)', marginTop: '4px', marginLeft: '2px' }}>
            {helperText}
          </BodySmall>
        )}
      </Box>
    );
  }

  /* ─── SPINNER ─── */
  return (
    <Box
      className={'numberfield numberfield-spinner' +
        (disabled ? ' numberfield-disabled' : '') +
        (className ? ' ' + className : '')}
      sx={{ fontFamily: 'inherit', ...sx }}
      {...props}
    >
      {renderLabel()}

      <Box sx={{
        display: 'inline-flex', alignItems: 'center', gap: size === 'small' ? 0.5 : 1,
        opacity: disabled ? 0.5 : 1,
      }}>
        {/* Decrement — icon button, uses size-aware icon-button radius. */}
        <Box component="button" type="button" aria-label="Decrease" {...holdHandlers(-1)}
          disabled={disabled || atMin}
          sx={{
            ...stepperSx,
            width: sc.btnSize, height: sc.btnSize,
            borderRadius: size === 'small'
              ? 'var(--Sm-Button-Icon-Radius, var(--Button-Icon-Radius, var(--Style-Border-Radius)))'
              : size === 'large'
                ? 'var(--Lg-Button-Icon-Radius, var(--Button-Icon-Radius, var(--Style-Border-Radius)))'
                : 'var(--Button-Icon-Radius, var(--Style-Border-Radius))',
            border: '1px solid ' + borderToken,
          }}>
          <Icon size="small"><RemoveIcon /></Icon>
        </Box>

        {/* Value — size-aware Input-Radius. */}
        <Box sx={{
          border: '1px solid ' + borderToken,
          borderRadius: size === 'small'
            ? 'var(--Sm-Input-Radius, var(--Input-Radius, var(--Style-Border-Radius)))'
            : size === 'large'
              ? 'var(--Lg-Input-Radius, var(--Input-Radius, var(--Style-Border-Radius)))'
              : 'var(--Input-Radius, var(--Style-Border-Radius))',
          overflow: 'hidden',
          '&:focus-within': {
            outline: '2px solid var(--Focus-Visible)',
            outlineOffset: '2px',
          },
        }}>
        <Box {...innerAttrs}>
          <Box
            component="input"
            ref={inputRef}
            type="text"
            inputMode="numeric"
            role="spinbutton"
            aria-valuenow={typeof current === 'number' ? current : undefined}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-label={label || 'Number'}
            value={current}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            sx={{
              width: size === 'small' ? 40 : 56,
              minHeight: sc.height,
              textAlign: 'center',
              border: 'none', outline: 'none',
              backgroundColor: 'var(--Hover)',
              color: 'var(--Text)',
              fontSize: sc.fontSize,
              fontFamily: 'var(--Body-Font-Family)',
              fontWeight: 600,
              '&:disabled': { cursor: 'not-allowed' },
            }}
          />
        </Box>
        </Box>

        {/* Increment — icon button, size-aware icon-button radius. */}
        <Box component="button" type="button" aria-label="Increase" {...holdHandlers(1)}
          disabled={disabled || atMax}
          sx={{
            ...stepperSx,
            width: sc.btnSize, height: sc.btnSize,
            borderRadius: size === 'small'
              ? 'var(--Sm-Button-Icon-Radius, var(--Button-Icon-Radius, var(--Style-Border-Radius)))'
              : size === 'large'
                ? 'var(--Lg-Button-Icon-Radius, var(--Button-Icon-Radius, var(--Style-Border-Radius)))'
                : 'var(--Button-Icon-Radius, var(--Style-Border-Radius))',
            border: '1px solid ' + borderToken,
          }}>
          <Icon size="small"><AddIcon /></Icon>
        </Box>
      </Box>

      {/* Helper */}
      {helperText && (
        <BodySmall style={{ color: 'var(--Quiet)', marginTop: '4px', marginLeft: '2px' }}>
          {helperText}
        </BodySmall>
      )}
    </Box>
  );
}

export default NumberField;
