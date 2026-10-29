// src/components/_textFieldBase.js
//
// MUI's TextField — FormControl, InputLabel, InputBase in its outlined /
// filled / standard shapes, NotchedOutline, InputAdornment and FormHelperText
// — as static markup and one static sheet, for the converted Input and
// TextField.
//
// Same markup, class names and ARIA MUI produced, so every consumer rule and
// test that targets .MuiOutlinedInput-root, .MuiInputLabel-shrink,
// .MuiInputBase-input and the rest still lands. Same behaviour: the
// FormControl's focused / filled / adorned-start state, the label's shrink
// and data-shrink, the notch, aria-invalid and aria-describedby, click-to-
// focus on the field, autofill detection, and the auto-growing textarea (MUI's
// own TextareaAutosize, which has no styling engine in it).
//
// The sheet is MUI's default-theme styles, written out. Rules keep emotion's
// weights — one class for a part, plus its state class where MUI wrote
// `&.Mui-focused` — with three exceptions marked :where(), where MUI's state
// rule tied with the lib's own override and lost on order (the override was
// inserted after it): the label's and the field's state colours and the
// helper text's.
import React, { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { registerStaticStyles, useStaticStyles } from './_staticStyles';

const useEnhancedEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const FONT = '"Roboto","Helvetica","Arial",sans-serif';
const BODY1 = `font-family:${FONT};font-weight:400;font-size:1rem;letter-spacing:0.00938em`;
const PRIMARY = 'rgb(25, 118, 210)';
const ERROR = 'rgb(211, 47, 47)';
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN_OUT = 'cubic-bezier(0.4, 0, 0.2, 1)';
const UNDERLINE_AFTER = `left:0;bottom:0;content:"";position:absolute;right:0;transform:scaleX(0);transition:transform 200ms ${EASE_OUT} 0ms;pointer-events:none`;
const UNDERLINE_BEFORE_POS = `left:0;bottom:0;content:"";position:absolute;right:0;transition:border-bottom-color 200ms ${EASE_IN_OUT} 0ms;pointer-events:none`;
const PLACEHOLDER = `color:currentColor;opacity:0.42;transition:opacity 200ms ${EASE_IN_OUT} 0ms`;
/* One rule per vendor form: a selector list with a pseudo-element the browser
   does not know drops the whole rule. */
const placeholderRules = (sel, decls) => ['::-webkit-input-placeholder', '::-moz-placeholder', '::placeholder']
  .map((p) => `${sel.replace(/%/g, p)}{${decls}}`);

registerStaticStyles('omni-textfield', [
  /* FormControl */
  '.omni-fc{display:inline-flex;flex-direction:column;position:relative;min-width:0;padding:0;margin:0;border:0;vertical-align:top}',
  '.omni-fc-normal{margin-top:16px;margin-bottom:8px}',
  '.omni-fc-dense{margin-top:8px;margin-bottom:4px}',
  '.omni-fc-full{width:100%}',

  /* InputLabel on FormLabel. MUI merged every variant into the one class, in
     this order; :where() keeps each at that one class's weight. */
  `.omni-fl{color:rgba(0, 0, 0, 0.6);${BODY1};line-height:1.4375em;padding:0;position:relative;display:block;`
    + 'transform-origin:top left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}',
  '.omni-fl:where(.MuiInputLabel-formControl){position:absolute;left:0;top:0;transform:translate(0, 20px) scale(1)}',
  '.omni-fl:where(.MuiInputLabel-sizeSmall){transform:translate(0, 17px) scale(1)}',
  '.omni-fl:where(.MuiInputLabel-shrink){transform:translate(0, -1.5px) scale(0.75);transform-origin:top left;max-width:133%}',
  `.omni-fl:where(.MuiInputLabel-animated){transition:color 200ms ${EASE_OUT} 0ms,transform 200ms ${EASE_OUT} 0ms,max-width 200ms ${EASE_OUT} 0ms}`,
  '.omni-fl:where(.MuiInputLabel-filled){z-index:1;pointer-events:none;transform:translate(12px, 16px) scale(1);max-width:calc(100% - 24px)}',
  '.omni-fl:where(.MuiInputLabel-filled.MuiInputLabel-sizeSmall){transform:translate(12px, 13px) scale(1)}',
  '.omni-fl:where(.MuiInputLabel-filled.MuiInputLabel-shrink){user-select:none;pointer-events:auto;transform:translate(12px, 7px) scale(0.75);max-width:calc(133% - 24px)}',
  '.omni-fl:where(.MuiInputLabel-filled.MuiInputLabel-shrink.MuiInputLabel-sizeSmall){transform:translate(12px, 4px) scale(0.75)}',
  '.omni-fl:where(.MuiInputLabel-outlined){z-index:1;pointer-events:none;transform:translate(14px, 16px) scale(1);max-width:calc(100% - 24px)}',
  '.omni-fl:where(.MuiInputLabel-outlined.MuiInputLabel-sizeSmall){transform:translate(14px, 9px) scale(1)}',
  '.omni-fl:where(.MuiInputLabel-outlined.MuiInputLabel-shrink){user-select:none;pointer-events:auto;max-width:calc(133% - 32px);transform:translate(14px, -9px) scale(0.75)}',
  `.omni-fl:where(.Mui-focused){color:${PRIMARY}}`,
  '.omni-fl:where(.Mui-disabled){color:rgba(0, 0, 0, 0.38)}',
  `.omni-fl:where(.Mui-error){color:${ERROR}}`,
  `.omni-fl-ast.Mui-error{color:${ERROR}}`,

  /* InputBase root, then each shape's root (MUI composed them into one class). */
  `.omni-ib{${BODY1};line-height:1.4375em;color:rgba(0, 0, 0, 0.87);box-sizing:border-box;position:relative;cursor:text;`
    + 'display:inline-flex;-webkit-box-align:center;align-items:center}',
  '.omni-ib:where(.MuiInputBase-multiline){padding:4px 0 5px}',
  '.omni-ib:where(.MuiInputBase-multiline.MuiInputBase-sizeSmall){padding-top:1px}',
  '.omni-ib:where(.MuiInputBase-fullWidth){width:100%}',
  '.omni-ib:where(.Mui-disabled){color:rgba(0, 0, 0, 0.38);cursor:default}',
  // Outlined
  '.omni-ib-o{position:relative;border-radius:4px}',
  '.omni-ib-o:hover .MuiOutlinedInput-notchedOutline{border-color:rgba(0, 0, 0, 0.87)}',
  '@media (hover: none){.omni-ib-o:hover .MuiOutlinedInput-notchedOutline{border-color:rgba(0, 0, 0, 0.23)}}',
  '.omni-ib-o.Mui-focused .MuiOutlinedInput-notchedOutline{border-width:2px}',
  `.omni-ib-o.Mui-focused .MuiOutlinedInput-notchedOutline{border-color:${PRIMARY}}`,
  `.omni-ib-o.Mui-error .MuiOutlinedInput-notchedOutline{border-color:${ERROR}}`,
  '.omni-ib-o.Mui-disabled .MuiOutlinedInput-notchedOutline{border-color:rgba(0, 0, 0, 0.26)}',
  '.omni-ib-o:where(.MuiInputBase-adornedStart){padding-left:14px}',
  '.omni-ib-o:where(.MuiInputBase-adornedEnd){padding-right:14px}',
  '.omni-ib-o:where(.MuiInputBase-multiline){padding:16.5px 14px}',
  '.omni-ib-o:where(.MuiInputBase-multiline.MuiInputBase-sizeSmall){padding:8.5px 14px}',
  // Filled
  `.omni-ib-f{position:relative;background-color:rgba(0, 0, 0, 0.06);border-top-left-radius:4px;border-top-right-radius:4px;`
    + `transition:background-color 200ms ${EASE_OUT} 0ms}`,
  '.omni-ib-f:hover{background-color:rgba(0, 0, 0, 0.09)}',
  '@media (hover: none){.omni-ib-f:hover{background-color:rgba(0, 0, 0, 0.06)}}',
  '.omni-ib-f.Mui-focused{background-color:rgba(0, 0, 0, 0.06)}',
  '.omni-ib-f.Mui-disabled{background-color:rgba(0, 0, 0, 0.12)}',
  // Standard
  '.omni-ib-s{position:relative}',
  'label + .omni-ib-s{margin-top:16px}',
  // The underline, shared by filled and standard.
  `.omni-ib-u::after{${UNDERLINE_AFTER}}`,
  '.omni-ib-u.Mui-focused:after{transform:scaleX(1) translateX(0)}',
  `.omni-ib-u.Mui-error::before,.omni-ib-u.Mui-error::after{border-bottom-color:${ERROR}}`,
  `.omni-ib-u::before{border-bottom:1px solid rgba(0, 0, 0, 0.42);${UNDERLINE_BEFORE_POS}}`,
  '.omni-ib-f:hover:not(.Mui-disabled, .Mui-error):before{border-bottom:1px solid rgba(0, 0, 0, 0.87)}',
  '.omni-ib-s:hover:not(.Mui-disabled, .Mui-error):before{border-bottom:2px solid rgba(0, 0, 0, 0.87)}',
  '@media (hover: none){.omni-ib-s:hover:not(.Mui-disabled, .Mui-error):before{border-bottom:1px solid rgba(0, 0, 0, 0.42)}}',
  '.omni-ib-u.Mui-disabled:before{border-bottom-style:dotted}',
  `.omni-ib-u::after{border-bottom:2px solid ${PRIMARY}}`,
  '.omni-ib-f:where(.MuiInputBase-adornedStart){padding-left:12px}',
  '.omni-ib-f:where(.MuiInputBase-adornedEnd){padding-right:12px}',
  '.omni-ib-f:where(.MuiInputBase-multiline){padding:25px 12px 8px}',
  '.omni-ib-f:where(.MuiInputBase-multiline.MuiInputBase-sizeSmall){padding-top:21px;padding-bottom:4px}',

  /* The <input> / <textarea>. */
  '.omni-ii{font:inherit;letter-spacing:inherit;color:currentColor;padding:4px 0 5px;border:0;box-sizing:content-box;'
    + 'background:none;height:1.4375em;margin:0;-webkit-tap-highlight-color:transparent;display:block;min-width:0;width:100%;'
    + 'animation-name:mui-auto-fill-cancel;animation-duration:10ms}',
  ...placeholderRules('.omni-ii%', PLACEHOLDER),
  '.omni-ii:focus{outline:0}',
  '.omni-ii:invalid{box-shadow:none}',
  '.omni-ii::-webkit-search-decoration{-webkit-appearance:none}',
  ...placeholderRules('label[data-shrink=false] + .MuiInputBase-formControl .omni-ii%', 'opacity:0 !important'),
  ...placeholderRules('label[data-shrink=false] + .MuiInputBase-formControl .omni-ii:focus%', 'opacity:0.42'),
  '.omni-ii.Mui-disabled{opacity:1;-webkit-text-fill-color:rgba(0, 0, 0, 0.38)}',
  '.omni-ii:-webkit-autofill{animation-duration:5000s;animation-name:mui-auto-fill}',
  '.omni-ii:where(.MuiInputBase-inputSizeSmall){padding-top:1px}',
  '.omni-ii:where(.MuiInputBase-inputMultiline){height:auto;resize:none;padding:0;padding-top:0}',
  '.omni-ii:where(.MuiInputBase-inputTypeSearch){-moz-appearance:textfield}',
  // Outlined input
  '.omni-ii-o{padding:16.5px 14px}',
  '.omni-ii-o:-webkit-autofill{border-radius:inherit}',
  '.omni-ii-o:where(.MuiInputBase-inputSizeSmall){padding:8.5px 14px}',
  '.omni-ii-o:where(.MuiInputBase-inputMultiline){padding:0}',
  '.omni-ii-o:where(.MuiInputBase-inputAdornedStart){padding-left:0}',
  '.omni-ii-o:where(.MuiInputBase-inputAdornedEnd){padding-right:0}',
  // Filled input
  '.omni-ii-f{padding-top:25px;padding-right:12px;padding-bottom:8px;padding-left:12px}',
  '.omni-ii-f:-webkit-autofill{border-top-left-radius:inherit;border-top-right-radius:inherit}',
  '.omni-ii-f:where(.MuiInputBase-inputSizeSmall){padding-top:21px;padding-bottom:4px}',
  '.omni-ii-f:where(.MuiInputBase-inputAdornedStart){padding-left:0}',
  '.omni-ii-f:where(.MuiInputBase-inputAdornedEnd){padding-right:0}',
  '.omni-ii-f:where(.MuiInputBase-inputMultiline){padding-top:0;padding-bottom:0;padding-left:0;padding-right:0}',
  '@keyframes mui-auto-fill{from{display:block}}',
  '@keyframes mui-auto-fill-cancel{from{display:block}}',

  /* NotchedOutline */
  '.omni-no{text-align:left;position:absolute;bottom:0;right:0;top:-5px;left:0;margin:0;padding:0 8px;pointer-events:none;'
    + 'border-radius:inherit;border-style:solid;border-width:1px;overflow:hidden;min-width:0%;border-color:rgba(0, 0, 0, 0.23)}',
  `.omni-leg{float:unset;width:auto;overflow:hidden;padding:0;line-height:11px;transition:width 150ms ${EASE_OUT} 0ms}`,
  `.omni-leg-l{float:unset;width:auto;overflow:hidden;display:block;padding:0;height:11px;font-size:0.75em;visibility:hidden;`
    + `max-width:0.01px;transition:max-width 50ms ${EASE_OUT} 0ms;white-space:nowrap}`,
  '.omni-leg-l > span{padding-left:5px;padding-right:5px;display:inline-block;opacity:0;visibility:visible}',
  `.omni-leg-n{max-width:100%;transition:max-width 100ms ${EASE_OUT} 50ms}`,

  /* InputAdornment */
  '.omni-ad{display:flex;max-height:2em;-webkit-box-align:center;align-items:center;white-space:nowrap;color:rgba(0, 0, 0, 0.54)}',
  '.omni-ad-f.MuiInputAdornment-positionStart:not(.MuiInputAdornment-hiddenLabel){margin-top:16px}',
  '.omni-ad:where(.MuiInputAdornment-positionStart){margin-right:8px}',
  '.omni-ad:where(.MuiInputAdornment-positionEnd){margin-left:8px}',
  '.omni-ad:where(.MuiInputAdornment-disablePointerEvents){pointer-events:none}',
  `.omni-ad-text{margin:0;${BODY1};line-height:1.5;color:rgba(0, 0, 0, 0.6)}`,

  /* FormHelperText */
  `.omni-ht{color:rgba(0, 0, 0, 0.6);font-family:${FONT};font-weight:400;font-size:0.75rem;line-height:1.66;`
    + 'letter-spacing:0.03333em;text-align:left;margin-top:3px;margin-right:0;margin-bottom:0;margin-left:0}',
  '.omni-ht.Mui-disabled{color:rgba(0, 0, 0, 0.38)}',
  `.omni-ht.Mui-error{color:${ERROR}}`,
  '.omni-ht:where(.MuiFormHelperText-sizeSmall){margin-top:4px}',
  '.omni-ht:where(.MuiFormHelperText-contained){margin-left:14px;margin-right:14px}',
].join('\n'));

// --- Context -------------------------------------------------------------------

const FieldContext = createContext(null);
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const cx = (...a) => a.filter(Boolean).join(' ');
const hasValue = (v) => v != null && !(Array.isArray(v) && v.length === 0);
const isFilled = (obj, SSR = false) => obj && ((hasValue(obj.value) && obj.value !== '') || (SSR && hasValue(obj.defaultValue) && obj.defaultValue !== ''));
const SHAPE = { outlined: 'o', filled: 'f', standard: 's' };
const SHAPE_CLASS = { outlined: 'MuiOutlinedInput', filled: 'MuiFilledInput', standard: 'MuiInput' };

function setRef(ref, value) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

// --- Adornment ----------------------------------------------------------------

/** MUI's InputAdornment: reads the field's shape and size from context. */
export function FieldAdornment({ position, children, className, disablePointerEvents = false, disableTypography = false, variant: variantProp, ...props }) {
  useStaticStyles('omni-textfield');
  const field = useContext(FieldContext) || {};
  const variant = variantProp || field.variant;
  return (
    <FieldContext.Provider value={null}>
      <div
        className={cx('MuiInputAdornment-root', disablePointerEvents && 'MuiInputAdornment-disablePointerEvents',
          position && 'MuiInputAdornment-position' + cap(position), variant && 'MuiInputAdornment-' + variant,
          field.hiddenLabel && 'MuiInputAdornment-hiddenLabel', field.size && 'MuiInputAdornment-size' + cap(field.size),
          'omni-ad', variant === 'filled' && 'omni-ad-f', className)}
        {...props}
      >
        {typeof children === 'string' && !disableTypography
          ? <p className="MuiTypography-root MuiTypography-body1 omni-ad-text">{children}</p>
          : <>{position === 'start' ? <span className="notranslate" aria-hidden="true">{'​'}</span> : null}{children}</>}
      </div>
    </FieldContext.Provider>
  );
}

// --- Helper text --------------------------------------------------------------

/** MUI's FormHelperText. Inside a field it takes the field's state. */
export function HelperText({ children, className, error, disabled, id, ...props }) {
  useStaticStyles('omni-textfield');
  const f = useContext(FieldContext);
  const st = {
    variant: f ? f.variant : undefined,
    size: f ? f.size : undefined,
    disabled: disabled ?? (f ? f.disabled : undefined),
    error: error ?? (f ? f.error : undefined),
    filled: f ? f.filled : undefined,
    focused: f ? f.focused : undefined,
    required: f ? f.required : undefined,
  };
  const contained = st.variant === 'filled' || st.variant === 'outlined';
  return (
    <p
      className={cx('MuiFormHelperText-root', st.disabled && 'Mui-disabled', st.error && 'Mui-error', st.size && 'MuiFormHelperText-size' + cap(st.size),
        contained && 'MuiFormHelperText-contained', st.focused && 'Mui-focused', st.filled && 'Mui-filled', st.required && 'Mui-required',
        'omni-ht', className)}
      id={id}
      {...props}
    >
      {children === ' ' ? <span className="notranslate" aria-hidden="true">{'​'}</span> : children}
    </p>
  );
}

// --- The field ----------------------------------------------------------------

/**
 * TextField, as MUI built it. Props are MUI TextField's, less the ones only
 * the MUI version supports (select, slots / slotProps, InputLabelProps and
 * the like) — a caller that passes those gets the MUI version instead; see
 * the components' own fallbacks.
 *
 *   InputProps   — what MUI passed to the input component: startAdornment,
 *                  endAdornment, and anything else lands on the input root.
 *   labelShrink  — InputLabelProps.shrink.
 */
export function StaticTextField({
  autoComplete,
  autoFocus = false,
  className,
  color = 'primary',
  defaultValue,
  disabled = false,
  error = false,
  /* FormControl's visual focus override. */
  focused: visuallyFocused,
  fullWidth = false,
  helperText,
  id: idOverride,
  inputProps: htmlInputProps = {},
  InputProps = {},
  inputRef,
  label,
  labelShrink,
  margin = 'none',
  maxRows,
  minRows,
  multiline = false,
  name,
  onBlur,
  onChange,
  onFocus,
  placeholder,
  required = false,
  rows,
  size = 'medium',
  type,
  value: valueProp,
  variant = 'outlined',
  ...other
}) {
  useStaticStyles('omni-textfield');
  const reactId = useId();
  const id = idOverride ?? reactId;
  const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
  const inputLabelId = label && id ? `${id}-label` : undefined;
  const shape = SHAPE[variant] ? variant : 'outlined';
  const S = SHAPE[shape];
  const {
    startAdornment, endAdornment, className: rootClassName, readOnly, onClick: rootOnClick,
    onKeyDown, onKeyUp, 'aria-describedby': ariaDescribedbyIP, ...rootOther
  } = InputProps;

  // FormControl state.
  const [adornedStart, setAdornedStart] = useState(() => Boolean(startAdornment));
  const [filled, setFilled] = useState(() => Boolean(isFilled({ value: valueProp, defaultValue }, true) || isFilled(htmlInputProps, true)));
  const [focusedState, setFocused] = useState(false);
  if (disabled && focusedState) setFocused(false);
  const focused = visuallyFocused !== undefined && !disabled ? visuallyFocused : focusedState;

  // InputBase.
  const value = htmlInputProps.value != null ? htmlInputProps.value : valueProp;
  const { current: isControlled } = useRef(value != null);
  const ownInputRef = useRef(null);
  const handleInputRef = useCallback((node) => {
    ownInputRef.current = node;
    setRef(inputRef, node);
    setRef(htmlInputProps.ref, node);
  }, [inputRef, htmlInputProps.ref]);
  const checkDirty = useCallback((obj) => {
    if (isFilled(obj)) setFilled(true);
    else setFilled(false);
  }, []);
  useEnhancedEffect(() => {
    if (isControlled) checkDirty({ value });
  }, [value, checkDirty, isControlled]);
  useEnhancedEffect(() => {
    if (!autoFocus) return;
    const input = ownInputRef.current;
    if (!input) return;
    const doc = input.ownerDocument || document;
    const active = doc.activeElement;
    if (input === active) setFocused(true);
    else if (active == null || active === doc.body || active === doc.documentElement) input.focus();
  }, [autoFocus]);
  useEffect(() => { checkDirty(ownInputRef.current); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setAdornedStart(Boolean(startAdornment)); }, [startAdornment]);

  const handleFocus = (event) => {
    if (onFocus) onFocus(event);
    if (htmlInputProps.onFocus) htmlInputProps.onFocus(event);
    setFocused(true);
  };
  const handleBlur = (event) => {
    if (onBlur) onBlur(event);
    if (htmlInputProps.onBlur) htmlInputProps.onBlur(event);
    setFocused(false);
  };
  const handleChange = (event, ...args) => {
    if (!isControlled) {
      const element = event.target || ownInputRef.current;
      checkDirty({ value: element.value });
    }
    if (htmlInputProps.onChange) htmlInputProps.onChange(event, ...args);
    if (onChange) onChange(event, ...args);
  };
  const handleClick = (event) => {
    if (ownInputRef.current && event.currentTarget === event.target) ownInputRef.current.focus();
    if (rootOnClick) rootOnClick(event);
  };
  const handleAutoFill = (event) => {
    checkDirty(event.animationName === 'mui-auto-fill-cancel' ? ownInputRef.current : { value: 'x' });
  };

  const shrink = labelShrink !== undefined ? labelShrink : (filled || focused || adornedStart);
  const notched = labelShrink !== undefined ? labelShrink : Boolean(startAdornment || filled || focused);
  const small = size === 'small';
  const ctx = {
    variant: shape, size, color, disabled, error, filled, focused, required, hiddenLabel: false, adornedStart,
  };

  // The input element, or MUI's auto-growing textarea.
  const {
    className: htmlClassName, onFocus: _f, onBlur: _b, onChange: _c, ref: _r, value: _v, ...htmlRest
  } = htmlInputProps;
  let InputComponent = 'input';
  let multilineProps = {};
  if (multiline) {
    InputComponent = TextareaAutosize;
    multilineProps = rows ? { type: undefined, minRows: rows, maxRows: rows } : { type: undefined, maxRows, minRows };
  }
  const isSearch = (type || 'text') === 'search';
  const inputEl = (
    <InputComponent
      aria-invalid={error}
      aria-describedby={ariaDescribedbyIP !== undefined ? ariaDescribedbyIP : helperTextId}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      defaultValue={defaultValue}
      disabled={disabled}
      id={id}
      onAnimationStart={handleAutoFill}
      name={name}
      placeholder={placeholder}
      readOnly={readOnly}
      required={required}
      rows={rows}
      value={value}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      type={type || 'text'}
      {...multilineProps}
      {...htmlRest}
      ref={handleInputRef}
      className={cx('MuiInputBase-input', SHAPE_CLASS[shape] + '-input', disabled && 'Mui-disabled', isSearch && 'MuiInputBase-inputTypeSearch',
        multiline && 'MuiInputBase-inputMultiline', small && 'MuiInputBase-inputSizeSmall',
        startAdornment && 'MuiInputBase-inputAdornedStart', endAdornment && 'MuiInputBase-inputAdornedEnd',
        'omni-ii', S !== 's' && 'omni-ii-' + S, htmlClassName, readOnly && 'MuiInputBase-readOnly')}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
    />
  );

  const withLabel = label != null && label !== '';
  const notchLabel = withLabel && required ? <>{label}{' '}{'*'}</> : label;
  const shapeRoot = shape === 'filled'
    ? cx('MuiFilledInput-root', 'MuiFilledInput-underline', startAdornment && 'MuiFilledInput-adornedStart', endAdornment && 'MuiFilledInput-adornedEnd',
      multiline && 'MuiFilledInput-multiline')
    : shape === 'standard' ? 'MuiInput-root MuiInput-underline' : 'MuiOutlinedInput-root';

  return (
    <FieldContext.Provider value={ctx}>
      <div
        className={cx('MuiFormControl-root', margin !== 'none' && 'MuiFormControl-margin' + cap(margin), fullWidth && 'MuiFormControl-fullWidth',
          'MuiTextField-root', 'omni-fc', margin !== 'none' && 'omni-fc-' + margin, fullWidth && 'omni-fc-full', className)}
        {...other}
      >
        {withLabel && (
          <label
            className={cx('MuiFormLabel-root', 'MuiInputLabel-root', 'MuiInputLabel-formControl', 'MuiInputLabel-animated', shrink && 'MuiInputLabel-shrink',
              small && 'MuiInputLabel-sizeSmall', 'MuiInputLabel-' + shape, 'MuiFormLabel-color' + cap(color), disabled && 'Mui-disabled',
              error && 'Mui-error', filled && 'MuiFormLabel-filled', focused && 'Mui-focused', required && 'Mui-required', 'omni-fl')}
            data-shrink={shrink}
            htmlFor={id}
            id={inputLabelId}
          >
            {label}
            {required && (
              <span aria-hidden="true" className={cx('MuiFormLabel-asterisk', 'MuiInputLabel-asterisk', error && 'Mui-error', 'omni-fl-ast')}>
                {' '}{'*'}
              </span>
            )}
          </label>
        )}
        <div
          onClick={handleClick}
          {...rootOther}
          className={cx('MuiInputBase-root', shapeRoot, 'MuiInputBase-color' + cap(color), disabled && 'Mui-disabled', error && 'Mui-error',
            fullWidth && 'MuiInputBase-fullWidth', focused && 'Mui-focused', 'MuiInputBase-formControl', small && 'MuiInputBase-sizeSmall',
            multiline && 'MuiInputBase-multiline', startAdornment && 'MuiInputBase-adornedStart', endAdornment && 'MuiInputBase-adornedEnd',
            'omni-ib', 'omni-ib-' + S, shape !== 'outlined' && 'omni-ib-u', rootClassName, readOnly && 'MuiInputBase-readOnly')}
        >
          {startAdornment}
          {inputEl}
          {endAdornment}
          {shape === 'outlined' && (
            <fieldset aria-hidden="true" className="MuiOutlinedInput-notchedOutline omni-no">
              <legend className={withLabel ? cx('omni-leg-l', notched && 'omni-leg-n') : 'omni-leg'}>
                {withLabel ? <span>{notchLabel}</span> : <span className="notranslate" aria-hidden="true">{'​'}</span>}
              </legend>
            </fieldset>
          )}
        </div>
        {helperText && <HelperText id={helperTextId}>{helperText}</HelperText>}
      </div>
    </FieldContext.Provider>
  );
}
