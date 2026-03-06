// src/components/TextInput/TextInput.js
import React from 'react';
import { TextField, Stack, Typography } from '@mui/material';

/**
 * TextInput Component
 * Basic text input field with design system styling
 * 
 * @param {string} label - Input label
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} type - Input type (default: text)
 * @param {boolean} error - Error state
 * @param {string} helperText - Helper/error text
 * @param {boolean} fullWidth - Full width input
 * @param {string} size - Size: small, medium (default: medium)
 * @param {object} props - Additional props
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
  ...props
}) {
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
      sx={{
        '& .MuiOutlinedInput-root': {
          color: 'var(--Text)',
          '& fieldset': {
            borderColor: 'var(--Border)',
          },
          '&:hover fieldset': {
            borderColor: 'var(--Border)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'var(--Button-Primary-Button)',
          },
        },
        '& .MuiInputLabel-root': {
          color: 'var(--Text-Secondary)',
          '&.Mui-focused': {
            color: 'var(--Button-Primary-Button)',
          },
        },
        '& .MuiFormHelperText-root': {
          color: 'var(--Text-Secondary)',
        },
        ...sx,
      }}
      {...props}
    />
  );
}

/**
 * EmailInput Component
 * Email input with validation styling
 * 
 * @param {string} label - Input label (default: Email)
 * @param {string} placeholder - Placeholder (default: your@email.com)
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {boolean} error - Error state
 * @param {string} helperText - Helper/error text
 * @param {object} props - Additional props
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
 * Password input with masked text
 * 
 * @param {string} label - Input label (default: Password)
 * @param {string} placeholder - Placeholder (default: ••••••••)
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {boolean} error - Error state
 * @param {string} helperText - Helper/error text
 * @param {object} props - Additional props
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
 * Multi-line text input
 * 
 * @param {string} label - Input label
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {number} rows - Number of rows (default: 4)
 * @param {boolean} error - Error state
 * @param {string} helperText - Helper/error text
 * @param {boolean} fullWidth - Full width input
 * @param {object} props - Additional props
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
  ...props
}) {
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
      sx={{
        '& .MuiOutlinedInput-root': {
          color: 'var(--Text)',
          '& fieldset': {
            borderColor: 'var(--Border)',
          },
          '&:hover fieldset': {
            borderColor: 'var(--Border)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'var(--Button-Primary-Button)',
          },
        },
        '& .MuiInputLabel-root': {
          color: 'var(--Text-Secondary)',
          '&.Mui-focused': {
            color: 'var(--Button-Primary-Button)',
          },
        },
        '& .MuiFormHelperText-root': {
          color: 'var(--Text-Secondary)',
        },
        ...sx,
      }}
      {...props}
    />
  );
}

export default TextInput;
