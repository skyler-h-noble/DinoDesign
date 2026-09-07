// src/components/TextField/TextField.js
import React, { useState } from 'react';
import { Input } from '../Input/Input';
import {
  TextField as MuiTextField,
  Box,
  FormHelperText,
  InputAdornment,
} from '@mui/material';

/**
 * TextField Component - Design System Implementation
 * 
 * Uses Material-UI TextField with custom design system styling
 * Implements WCAG 2.1 AA accessibility standards with color contrast requirements:
 * - Border: 3.1:1 contrast ratio against background
 * - Text: 4.5:1 contrast ratio against background
 * - Error state uses error colors
 * 
 * @param {string} label - Field label text
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {string} error - Error message (empty = no error)
 * @param {boolean} disabled - Disabled state
 * @param {string} helperText - Helper text below field
 * @param {string} variant - Variant: outlined, filled, standard (default: outlined)
 * @param {string} size - Size: small, medium (default: medium)
 * @param {string} type - Input type: text, email, password, number, etc
 * @param {boolean} required - Required field
 * @param {object} sx - Additional MUI sx props
 * @param {object} ...props - Other MUI TextField props
 */
export function TextField({
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
  // Left in ...props they spread onto the wrapper <div>, which is invalid ARIA
  // (aria-label on a div with no role) AND leaves the input unnamed.
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  // Determine colors based on state
  const borderColor = error
    ? 'var(--Buttons-Error-Border)'
    : isFocused
    ? 'var(--Buttons-Primary-Border)'
    : 'var(--Border)';

  const labelColor = error
    ? 'var(--Text)'
    : isFocused
    ? 'var(--Text)'
    : 'var(--Text-Quiet)';

  const textColor = error ? 'var(--Text)' : 'var(--Text)';

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <MuiTextField
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        variant={variant}
        size={size}
        type={type}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        error={error}
        fullWidth={fullWidth}
        slotProps={{
          htmlInput: {
            ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
            ...(ariaLabelledby ? { 'aria-labelledby': ariaLabelledby } : {}),
          },
          input: {
            // The input is a CONTAINER on whatever surface it sits on. Declaring
            // it here means --Background resolves to the container tone AND the
            // paired --Text / --Border come with it, instead of naming a surface
            // token directly and leaving the foregrounds on the parent's tone.
            //
            // Disabled is a different SURFACE, not a different colour: saying
            // Container-Low here brings its foregrounds too, where an sx
            // override of backgroundColor would have left --Text where it was.
            'data-surface': disabled ? 'Container-Low' : 'Container',
            style: {
              color: textColor,
            },
            startAdornment: startAdornment
              ? <InputAdornment position="start">{startAdornment}</InputAdornment>
              : undefined,
            endAdornment: endAdornment
              ? <InputAdornment position="end">{endAdornment}</InputAdornment>
              : undefined,
          },
        }}
        sx={{
          width: fullWidth ? '100%' : 'auto',
          // Outlined variant styling
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--Background)',
            transition: 'all 0.2s ease-in-out',
            color: textColor,

            // Border color
            '& fieldset': {
              borderColor: borderColor,
              transition: 'border-color 0.2s ease-in-out',
            },

            // Focus state
            '&:hover fieldset': {
              borderColor: error
                ? 'var(--Buttons-Error-Border)'
                : 'var(--Buttons-Primary-Border)',
            },

            // Focused state
            '&.Mui-focused fieldset': {
              borderColor: error
                ? 'var(--Buttons-Error-Border)'
                : 'var(--Buttons-Primary-Border)',
              borderWidth: '2px',
            },

            // Disabled state
            '&.Mui-disabled': {
              backgroundColor: 'var(--Background)',
              opacity: 0.6,
            },
          },

          // Label styling
          '& .MuiInputLabel-root': {
            color: labelColor,
            transition: 'all 0.2s ease-in-out',
            fontSize: '14px',
            fontWeight: 500,

            // Focused/filled state
            '&.Mui-focused': {
              color: error ? 'var(--Text)' : 'var(--Text)',
              fontWeight: 600,
            },

            '&.Mui-error': {
              color: 'var(--Text)',
            },

            // Disabled
            '&.Mui-disabled': {
              color: 'var(--Text-Secondary)',
              opacity: 0.6,
            },
          },

          // Helper text
          '& .MuiFormHelperText-root': {
            color: error ? 'var(--Buttons-Error-Border)' : 'var(--Text-Secondary)',
            marginTop: '4px',
            fontSize: '12px',
          },

          ...sx,
        }}
        {...props}
      />
      {error && errorMessage && (
        <FormHelperText
          error={true}
          sx={{
            color: 'var(--Buttons-Error-Border)',
            marginTop: '4px',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          {errorMessage}
        </FormHelperText>
      )}
    </Box>
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
 *   - No size, no variant, no colour, no adornments, no floating label.
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
export function TextFieldGroup({
  fields = [],
  spacing = 2,
  sx = {},
  ...props
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: `var(--Spacing-${spacing})`,
        width: '100%',
        ...sx,
      }}
      {...props}
    >
      {fields.map((field) => (
        <TextField key={field.id} {...field} />
      ))}
    </Box>
  );
}

export default TextField;
