// src/components/TextField/TextField.js
import React, { useState } from 'react';
import { Input } from '../Input/Input';
import { registerStaticStyles, useStaticStyles } from '../_staticStyles';
import { lazySxBox, lazyFallback } from '../_lazyFallback';
import { StaticTextField, FieldAdornment, HelperText } from '../_textFieldBase';

// --- Static sheet ------------------------------------------------------------
//
// TextField was MUI's TextField with an sx override. It now renders the same
// markup from _textFieldBase.js, and its sx became the rules below — the same
// selectors and weights (one class on the field root, then MUI's part
// classes), so a caller's sx still lands on top. The focus / error colours
// that the sx picked from React state are classes on the root.
const SxBox = lazySxBox('TextField');
const TextFieldMui = lazyFallback('TextField', () => import('./TextField.mui'));
const hasSx = (sx) => sx != null && (typeof sx !== 'object' || Array.isArray(sx) || Object.keys(sx).length > 0);
const MUI_ONLY = ['select', 'SelectProps', 'slots', 'slotProps', 'InputProps', 'InputLabelProps', 'FormHelperTextProps', 'inputProps', 'inputComponent', 'children'];
const OR = ' .MuiOutlinedInput-root';

registerStaticStyles('omni-text-field', [
  '.omni-tf-box{width:100%}',
  '.omni-tf-box-auto{width:auto}',
  '.omni-tf{width:100%}',
  '.omni-tf-auto{width:auto}',
  `.omni-tf${OR}{background-color:var(--Background);transition:all 0.2s ease-in-out;color:var(--Text)}`,
  // Border: --Border at rest, the primary border focused, the error border in error.
  `.omni-tf${OR} fieldset{border-color:var(--Border);transition:border-color 0.2s ease-in-out}`,
  `.omni-tf-foc${OR} fieldset{border-color:var(--Buttons-Primary-Border)}`,
  `.omni-tf-err${OR} fieldset{border-color:var(--Buttons-Error-Border)}`,
  `.omni-tf${OR}:hover fieldset{border-color:var(--Buttons-Primary-Border)}`,
  `.omni-tf-err${OR}:hover fieldset{border-color:var(--Buttons-Error-Border)}`,
  `.omni-tf${OR}.Mui-focused fieldset{border-color:var(--Buttons-Primary-Border);border-width:2px}`,
  `.omni-tf-err${OR}.Mui-focused fieldset{border-color:var(--Buttons-Error-Border)}`,
  `.omni-tf${OR}.Mui-disabled{background-color:var(--Background);opacity:var(--Disabled, 0.38)}`,
  // Label
  '.omni-tf .MuiInputLabel-root{color:var(--Text-Quiet);transition:all 0.2s ease-in-out;font-size:14px;font-weight:500}',
  '.omni-tf-foc .MuiInputLabel-root,.omni-tf-err .MuiInputLabel-root{color:var(--Text)}',
  '.omni-tf .MuiInputLabel-root.Mui-focused{color:var(--Text);font-weight:600}',
  '.omni-tf .MuiInputLabel-root.Mui-error{color:var(--Text)}',
  '.omni-tf .MuiInputLabel-root.Mui-disabled{color:var(--Text-Secondary);opacity:var(--Disabled, 0.38)}',
  // Helper text
  '.omni-tf .MuiFormHelperText-root{color:var(--Text-Secondary);margin-top:4px;font-size:12px}',
  '.omni-tf-err .MuiFormHelperText-root{color:var(--Buttons-Error-Border)}',
  /* The error message under the field. Its colour is the helper's own error
     rule, which outweighed the override's colour before as well. */
  '.omni-ht.omni-tf-em{margin-top:4px;font-size:12px;font-weight:500}',
].join('\n'));

/**
 * TextField Component - Design System Implementation
 *
 * MUI's TextField markup and behaviour, styled by the design system:
 * - Border: 3:1 contrast against the background (--Border)
 * - Text: 4.5:1 contrast against the background (--Text)
 * - Error state uses the error colours
 *
 * @param {string} label - Field label text
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {boolean} error - Error state
 * @param {string} errorMessage - Message shown under the field in error
 * @param {boolean} disabled - Disabled state
 * @param {string} helperText - Helper text below field
 * @param {string} variant - Variant: outlined, filled, standard (default: outlined)
 * @param {string} size - Size: small, medium (default: medium)
 * @param {string} type - Input type: text, email, password, number, etc
 * @param {boolean} required - Required field
 * @param {object} sx - Additional sx, layered over the field root
 * @param {object} ...props - Other TextField props
 */
export function TextField(allProps) {
  if (MUI_ONLY.some((k) => allProps[k] !== undefined)) return <TextFieldMui {...allProps} />;
  return <TextFieldStatic {...allProps} />;
}

function TextFieldStatic({
  label,
  value = '',
  onChange,
  placeholder,
  error = false,
  errorMessage = '',
  disabled = false,
  helperText = '',
  variant = 'outlined',
  size = 'medium',
  type = 'text',
  required = false,
  fullWidth = true,
  startAdornment,   // ReactNode rendered inside the input on the left
  endAdornment,     // ReactNode rendered inside the input on the right
  sx = {},
  // aria-label / aria-labelledby name the INPUT, not the FormControl wrapper.
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  /* Held out of ...props so the spread cannot overwrite the composed handlers
     below — the field tracks its own focus for the border color. */
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  className,
  ...props
}) {
  useStaticStyles('omni-text-field');
  const [isFocused, setIsFocused] = useState(false);
  const rootClass = 'omni-tf' + (fullWidth ? '' : ' omni-tf-auto') + (isFocused ? ' omni-tf-foc' : '') + (error ? ' omni-tf-err' : '')
    + (className ? ' ' + className : '');

  const fieldProps = {
    label,
    value,
    onChange,
    placeholder,
    disabled,
    variant,
    size,
    type,
    required,
    /* Compose, do not replace: a caller's onFocus still runs and the field
       keeps tracking its own focus for the border color. */
    onFocus: (e) => { setIsFocused(true); onFocusProp?.(e); },
    onBlur: (e) => { setIsFocused(false); onBlurProp?.(e); },
    error,
    fullWidth,
    inputProps: {
      ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
      ...(ariaLabelledby ? { 'aria-labelledby': ariaLabelledby } : {}),
    },
    InputProps: {
      // The input is a CONTAINER on whatever surface it sits on: declaring it
      // brings --Background AND the paired --Text / --Border with it.
      // Disabled is a different SURFACE (Container-Low), not a different color.
      'data-surface': disabled ? 'Container-Low' : 'Container',
      style: { color: 'var(--Text)' },
      startAdornment: startAdornment ? <FieldAdornment position="start">{startAdornment}</FieldAdornment> : undefined,
      endAdornment: endAdornment ? <FieldAdornment position="end">{endAdornment}</FieldAdornment> : undefined,
    },
    ...props,
  };

  return (
    <div className={'MuiBox-root omni-tf-box' + (fullWidth ? '' : ' omni-tf-box-auto')}>
      {hasSx(sx)
        ? <SxBox component={StaticTextField} sx={sx} className={rootClass} {...fieldProps} />
        : <StaticTextField className={rootClass} {...fieldProps} />}
      {error && errorMessage && (
        <HelperText error className="omni-tf-em">{errorMessage}</HelperText>
      )}
    </div>
  );
}

/**
 * Email TextField
 * Pre-configured for email input with validation
 */
export function EmailTextField({
  label = 'Email',
  ...props
}) {
  return (
    <TextField
      label={label}
      type="email"
      placeholder="user@example.com"
      {...props}
    />
  );
}

/**
 * Password TextField
 * Pre-configured for password input
 */
export function PasswordTextField({
  label = 'Password',
  ...props
}) {
  return (
    <TextField
      label={label}
      type="password"
      {...props}
    />
  );
}

/**
 * Search TextField
 * Pre-configured for search input
 */
export function SearchTextField({
  label = 'Search',
  placeholder = 'Type to search...',
  ...props
}) {
  return (
    <TextField
      label={label}
      type="search"
      placeholder={placeholder}
      {...props}
    />
  );
}

/**
 * Number TextField
 * Pre-configured for numeric input
 */
export function NumberTextField({
  label = 'Number',
  ...props
}) {
  return (
    <TextField
      label={label}
      type="number"
      {...props}
    />
  );
}

/**
 * Phone TextField
 * Pre-configured for phone number input
 */
export function PhoneTextField({
  label = 'Phone',
  placeholder = '(555) 123-4567',
  ...props
}) {
  return (
    <TextField
      label={label}
      type="tel"
      placeholder={placeholder}
      {...props}
    />
  );
}

/**
 * URL TextField
 * Pre-configured for URL input
 */
export function URLTextField({
  label = 'Website',
  placeholder = 'https://example.com',
  ...props
}) {
  return (
    <TextField
      label={label}
      type="url"
      placeholder={placeholder}
      {...props}
    />
  );
}

/**
 * Textarea Component
 * Multi-line text input
 */
/**
 * TextArea — Input, multiline.
 *
 * A thin delegation, not a component. It used to be a second implementation
 * wrapping MUI's TextField directly, and the two had drifted apart in every
 * way that matters:
 *
 *   - No borderRadius at all, so it inherited MUI's corner instead of
 *     --Input-Radius. A TextArea beside a TextInput had a visibly different
 *     corner, and the STUDIO ships a CSS override to paper over it
 *     (libRadiusOverrideCSS) whose own comment says "the real fix is for the
 *     lib to read the token". This is that fix — the override can go.
 *   - error / errorMessage where Input has validation / validationMessage, so
 *     the same state was spelled two ways depending on which control you
 *     reached for.
 *   - No size, no variant, no color, no adornments, no floating label.
 *
 * Input already takes multiline / rows / maxRows and renders a <textarea>, so
 * there was never a second thing to build — only a second thing to maintain.
 * The export stays so callers do not break; everything it can do is now
 * everything Input can do.
 */
export function TextArea({
  // Mapped: TextArea spoke error/errorMessage, Input speaks validation.
  error = false,
  errorMessage = '',
  rows = 4,
  fullWidth = true,
  ...props
}) {
  /* `resize` is Input's — forwarded through ...props, not reimplemented here,
     so <Input multiline> and <TextArea> cannot disagree about the default. */
  return (
    <Input
      multiline
      rows={rows}
      fullWidth={fullWidth}
      {...(error && { validation: 'error', validationMessage: errorMessage })}
      {...props}
    />
  );
}

/**
 * TextFieldGroup Component
 * Multiple text fields grouped together
 */
registerStaticStyles('omni-text-field-group', [
  '.omni-tfg{display:flex;flex-direction:column;gap:var(--_tfg-gap);width:100%}',
].join('\n'));
const GroupSxBox = lazySxBox('TextFieldGroup');

export function TextFieldGroup({
  fields = [],
  spacing = 2,
  sx = {},
  className,
  style,
  ...props
}) {
  useStaticStyles('omni-text-field-group');
  const groupProps = {
    className: 'MuiBox-root omni-tfg' + (className ? ' ' + className : ''),
    style: { '--_tfg-gap': `var(--Spacing-${spacing})`, ...style },
    ...props,
  };
  const children = fields.map((field) => <TextField key={field.id} {...field} />);
  if (hasSx(sx)) return <GroupSxBox sx={sx} {...groupProps}>{children}</GroupSxBox>;
  return <div {...groupProps}>{children}</div>;
}

export default TextField;
