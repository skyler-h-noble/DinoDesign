// src/components/TextInput/TextInput.stories.js
import { TextInput, EmailInput, PasswordInput, TextArea } from './TextInput';
import { Stack } from '@mui/material';

export default {
  title: 'Forms/TextInput',
  component: TextInput,
};

export const Basic = {
  render: () => <TextInput label="Username" value="" onChange={() => {}} />,
};

export const WithPlaceholder = {
  render: () => (
    <TextInput
      label="Email"
      placeholder="Enter your email"
      value=""
      onChange={() => {}}
    />
  ),
};

export const WithHelperText = {
  render: () => (
    <TextInput
      label="Password"
      type="password"
      helperText="At least 8 characters"
      value=""
      onChange={() => {}}
    />
  ),
};

export const ErrorState = {
  render: () => (
    <TextInput
      label="Email"
      value="invalid"
      onChange={() => {}}
      error={true}
      helperText="Invalid email format"
    />
  ),
};

export const Email = {
  render: () => (
    <EmailInput value="" onChange={() => {}} />
  ),
};

export const Password = {
  render: () => (
    <PasswordInput value="" onChange={() => {}} />
  ),
};

export const TextAreaBasic = {
  render: () => (
    <TextArea
      label="Comments"
      placeholder="Enter your comments"
      value=""
      onChange={() => {}}
    />
  ),
};

export const TextAreaCustomRows = {
  render: () => (
    <TextArea
      label="Description"
      rows={8}
      value=""
      onChange={() => {}}
    />
  ),
};

export const AllInputs = {
  render: () => (
    <Stack spacing={3} sx={{ maxWidth: 400 }}>
      <TextInput label="Username" value="" onChange={() => {}} />
      <EmailInput value="" onChange={() => {}} />
      <PasswordInput value="" onChange={() => {}} />
      <TextArea label="Comments" rows={4} value="" onChange={() => {}} />
    </Stack>
  ),
};
