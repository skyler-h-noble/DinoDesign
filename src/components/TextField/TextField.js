// src/components/TextField/TextField.js
import React, { useState } from 'react';
import {
  TextField as MuiTextField,
  Box,
  FormHelperText,
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
  sx = {},
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
          input: {
            style: {
              color: textColor,
            },
          },
        }}
        sx={{
          width: fullWidth ? '100%' : 'auto',
          // Outlined variant styling
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--Container)',
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
              backgroundColor: 'var(--Container-Low)',
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
export function TextArea({
  label,
  value = '',
  onChange,
  placeholder,
  error = false,
  errorMessage = '',
  disabled = false,
  helperText = '',
  rows = 4,
  required = false,
  fullWidth = true,
  sx = {},
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? 'var(--Buttons-Error-Border)'
    : isFocused
    ? 'var(--Buttons-Primary-Border)'
    : 'var(--Border)';

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <MuiTextField
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        variant="outlined"
        multiline
        rows={rows}
        required={required}
        fullWidth={fullWidth}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        error={error}
        slotProps={{
          input: {
            style: {
              color: 'var(--Text)',
            },
          },
        }}
        sx={{
          width: fullWidth ? '100%' : 'auto',
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--Container)',
            transition: 'all 0.2s ease-in-out',
            color: 'var(--Text)',

            '& fieldset': {
              borderColor: borderColor,
              transition: 'border-color 0.2s ease-in-out',
            },

            '&:hover fieldset': {
              borderColor: error
                ? 'var(--Buttons-Error-Border)'
                : 'var(--Buttons-Primary-Border)',
            },

            '&.Mui-focused fieldset': {
              borderColor: error
                ? 'var(--Buttons-Error-Border)'
                : 'var(--Buttons-Primary-Border)',
              borderWidth: '2px',
            },

            '&.Mui-disabled': {
              backgroundColor: 'var(--Container-Low)',
              opacity: 0.6,
            },
          },

          '& .MuiInputLabel-root': {
            color: error
              ? 'var(--Text)'
              : isFocused
              ? 'var(--Text)'
              : 'var(--Text-Quiet)',
            transition: 'all 0.2s ease-in-out',
            fontSize: '14px',
            fontWeight: 500,

            '&.Mui-focused': {
              color: error ? 'var(--Text)' : 'var(--Text)',
              fontWeight: 600,
            },

            '&.Mui-error': {
              color: 'var(--Text)',
            },

            '&.Mui-disabled': {
              color: 'var(--Text-Secondary)',
              opacity: 0.6,
            },
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
