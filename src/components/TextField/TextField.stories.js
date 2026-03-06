// src/components/TextField/TextField.stories.js
import { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import {
  TextField,
  EmailTextField,
  PasswordTextField,
  SearchTextField,
  NumberTextField,
  PhoneTextField,
  URLTextField,
  TextArea,
  TextFieldGroup,
} from './TextField';

export default {
  title: 'Inputs/TextField',
  component: TextField,
};

export const BasicTextField = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TextField
        label="Basic TextField"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter text..."
      />
    );
  },
};

export const WithError = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TextField
        label="Email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="email"
        error={true}
        errorMessage="Invalid email format"
      />
    );
  },
};

export const Disabled = {
  render: () => (
    <TextField
      label="Disabled Field"
      value="Cannot edit this"
      disabled={true}
    />
  ),
};

export const Required = {
  render: () => (
    <TextField
      label="Required Field"
      placeholder="This field is required"
      required={true}
    />
  ),
};

export const EmailVariant = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <EmailTextField value={value} onChange={(e) => setValue(e.target.value)} />
    );
  },
};

export const PasswordVariant = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <PasswordTextField value={value} onChange={(e) => setValue(e.target.value)} />
    );
  },
};

export const SearchVariant = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <SearchTextField value={value} onChange={(e) => setValue(e.target.value)} />
    );
  },
};

export const NumberVariant = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <NumberTextField value={value} onChange={(e) => setValue(e.target.value)} />
    );
  },
};

export const PhoneVariant = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <PhoneTextField value={value} onChange={(e) => setValue(e.target.value)} />
    );
  },
};

export const URLVariant = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <URLTextField value={value} onChange={(e) => setValue(e.target.value)} />
    );
  },
};

export const TextAreaVariant = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TextArea
        label="Message"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
        placeholder="Enter your message..."
      />
    );
  },
};

export const AllVariants = {
  render: () => {
    const [values, setValues] = useState({
      basic: '',
      email: '',
      password: '',
      search: '',
      number: '',
      phone: '',
      url: '',
      textarea: '',
    });

    return (
      <Stack spacing={3}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          TextField Variants
        </Typography>

        <TextField
          label="Basic Text"
          value={values.basic}
          onChange={(e) => setValues({ ...values, basic: e.target.value })}
          placeholder="Basic text input"
        />

        <EmailTextField
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />

        <PasswordTextField
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
        />

        <SearchTextField
          value={values.search}
          onChange={(e) => setValues({ ...values, search: e.target.value })}
        />

        <NumberTextField
          value={values.number}
          onChange={(e) => setValues({ ...values, number: e.target.value })}
        />

        <PhoneTextField
          value={values.phone}
          onChange={(e) => setValues({ ...values, phone: e.target.value })}
        />

        <URLTextField
          value={values.url}
          onChange={(e) => setValues({ ...values, url: e.target.value })}
        />

        <TextArea
          label="Message"
          value={values.textarea}
          onChange={(e) => setValues({ ...values, textarea: e.target.value })}
          rows={4}
        />
      </Stack>
    );
  },
};

export const WithHelperText = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TextField
        label="Password"
        type="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        helperText="Password must be at least 8 characters"
      />
    );
  },
};
