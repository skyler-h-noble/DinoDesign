// src/components/TextInput/TextInput.js
import React from 'react';
import { TextField, Stack, Typography } from '@mui/material';

/**
 * TextInput Component
 * Basic text input field with design system styling
 *
 * ACCESSIBILITY:
 *   - aria-label and aria-labelledby passed via inputProps to <input>
 *   - Always provide label prop OR aria-label for screen readers
 */
export function TextInput({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error = false,
  helperText = '',
  fullWidth = true,
  size = 'medium',
  sx = {},
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  inputProps: inputPropsProp = {},
  ...props
}) {
  const mergedInputProps = {
    ...inputPropsProp,
    ...(ariaLabel       && { 'aria-label': ariaLabel }),
    ...(ariaLabelledBy  && { 'aria-labelledby': ariaLabelledBy }),
    ...(ariaDescribedBy && { 'aria-describedby': ariaDescribedBy }),
  };

  return (
    <TextField
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={type}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      size={size}
      inputProps={mergedInputProps}
      sx={{
        '& .MuiOutlinedInput-root': {
          color: 'var(--Text)',
          '& fieldset': { borderColor: 'var(--Border)' },
          '&:hover fieldset': { borderColor: 'var(--Border)' },
          '&.Mui-focused fieldset': { borderColor: 'var(--Button-Primary-Button)' },
        },
        '& .MuiInputLabel-root': {
          color: 'var(--Text-Secondary)',
          '&.Mui-focused': { color: 'var(--Button-Primary-Button)' },
        },
        '& .MuiFormHelperText-root': { color: 'var(--Text-Secondary)' },
        ...sx,
      }}
      {...props}
    />
  );
}

/**
 * EmailInput Component
 */
export function EmailInput({
  label = 'Email',
  placeholder = 'your@email.com',
  value,
  onChange,
  error = false,
  helperText = '',
  sx = {},
  ...props
}) {
  return (
    <TextInput
      type="email"
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      sx={sx}
      {...props}
    />
  );
}

/**
 * PasswordInput Component
 */
export function PasswordInput({
  label = 'Password',
  placeholder = '••••••••',
  value,
  onChange,
  error = false,
  helperText = '',
  sx = {},
  ...props
}) {
  return (
    <TextInput
      type="password"
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      sx={sx}
      {...props}
    />
  );
}

/**
 * TextArea Component
 */
export function TextArea({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  error = false,
  helperText = '',
  fullWidth = true,
  sx = {},
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  inputProps: inputPropsProp = {},
  ...props
}) {
  const mergedInputProps = {
    ...inputPropsProp,
    ...(ariaLabel       && { 'aria-label': ariaLabel }),
    ...(ariaLabelledBy  && { 'aria-labelledby': ariaLabelledBy }),
    ...(ariaDescribedBy && { 'aria-describedby': ariaDescribedBy }),
  };

  return (
    <TextField
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      multiline
      rows={rows}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      inputProps={mergedInputProps}
      sx={{
        '& .MuiOutlinedInput-root': {
          color: 'var(--Text)',
          '& fieldset': { borderColor: 'var(--Border)' },
          '&:hover fieldset': { borderColor: 'var(--Border)' },
          '&.Mui-focused fieldset': { borderColor: 'var(--Button-Primary-Button)' },
        },
        '& .MuiInputLabel-root': {
          color: 'var(--Text-Secondary)',
          '&.Mui-focused': { color: 'var(--Button-Primary-Button)' },
        },
        '& .MuiFormHelperText-root': { color: 'var(--Text-Secondary)' },
        ...sx,
      }}
      {...props}
    />
  );
}

export default TextInput;