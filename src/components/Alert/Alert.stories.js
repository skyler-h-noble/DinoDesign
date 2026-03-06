// src/components/Alert/Alert.stories.js
import React from 'react';
import { Alert } from './Alert';
import { Box, Stack } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';

export default { title: 'Feedback/Alert', component: Alert };

const COLORS = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];

export const Default = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 500 }}>
      <Alert variant="outline" color="info" startDecorator={<InfoIcon sx={{ fontSize: 'inherit' }} />}>
        This is an informational alert.
      </Alert>
    </Box>
  ),
};

export const Variants = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 500 }}>
      <Stack spacing={2}>
        <Alert variant="standard">Standard — no border, no background.</Alert>
        <Alert variant="outline" color="info">Outline — colored border, no fill.</Alert>
        <Alert variant="light" color="info">Light — themed background, outer border.</Alert>
        <Alert variant="solid" color="info">Solid — strong themed background, outer border.</Alert>
      </Stack>
    </Box>
  ),
};

export const OutlineColors = {
  name: 'Outline — All Colors',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 500 }}>
      <Stack spacing={2}>
        {COLORS.map((c) => (
          <Alert key={c} variant="outline" color={c}>Outline {c} alert message.</Alert>
        ))}
      </Stack>
    </Box>
  ),
};

export const LightColors = {
  name: 'Light — All Colors',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 500 }}>
      <Stack spacing={2}>
        {COLORS.map((c) => (
          <Alert key={c} variant="light" color={c}>Light {c} alert message.</Alert>
        ))}
      </Stack>
    </Box>
  ),
};

export const SolidColors = {
  name: 'Solid — All Colors',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 500 }}>
      <Stack spacing={2}>
        {COLORS.map((c) => (
          <Alert key={c} variant="solid" color={c}>Solid {c} alert message.</Alert>
        ))}
      </Stack>
    </Box>
  ),
};

export const Sizes = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 500 }}>
      <Stack spacing={2}>
        {['small', 'medium', 'large'].map((s) => (
          <Alert key={s} variant="outline" color="info" size={s}
            startDecorator={<InfoIcon sx={{ fontSize: 'inherit' }} />}>
            {s.charAt(0).toUpperCase() + s.slice(1)} alert
          </Alert>
        ))}
      </Stack>
    </Box>
  ),
};

export const WithStartDecorators = {
  name: 'Start Decorators',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 500 }}>
      <Stack spacing={2}>
        <Alert variant="outline" color="info" startDecorator={<InfoIcon sx={{ fontSize: 'inherit', color: 'var(--Buttons-Info-Border)' }} />}>
          Info alert with icon
        </Alert>
        <Alert variant="light" color="success" startDecorator={<CheckCircleIcon sx={{ fontSize: 'inherit', color: 'var(--Buttons-Success-Border)' }} />}>
          Success alert with icon
        </Alert>
        <Alert variant="solid" color="warning" startDecorator={<WarningIcon sx={{ fontSize: 'inherit' }} />}>
          Warning alert with icon
        </Alert>
        <Alert variant="outline" color="error" startDecorator={<ErrorIcon sx={{ fontSize: 'inherit', color: 'var(--Buttons-Error-Border)' }} />}>
          Error alert with icon
        </Alert>
      </Stack>
    </Box>
  ),
};

export const WithEndDecorators = {
  name: 'End Decorators',
  render: () => (
    <Box sx={{ p: 4, maxWidth: 500 }}>
      <Stack spacing={2}>
        <Alert variant="outline" color="info"
          endDecorator={
            <Box component="button" sx={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', color: 'var(--Text-Quiet)' }}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </Box>
          }>
          Dismissible with icon button
        </Alert>
        <Alert variant="light" color="success"
          endDecorator={
            <Box component="a" href="#" sx={{ fontSize: '13px', fontWeight: 600, color: 'var(--Buttons-Success-Border)', textDecoration: 'underline' }}>
              Learn more
            </Box>
          }>
          With link end decorator
        </Alert>
        <Alert variant="solid" color="primary"
          endDecorator={
            <Box component="button" sx={{
              padding: '4px 12px', fontSize: '13px', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer',
              backgroundColor: 'var(--Buttons-Primary-Button)', color: 'var(--Buttons-Primary-Text)',
            }}>
              Undo
            </Box>
          }>
          With button end decorator
        </Alert>
      </Stack>
    </Box>
  ),
};

export const FullExample = {
  render: () => (
    <Box sx={{ p: 4, maxWidth: 500 }}>
      <Alert
        variant="light"
        color="error"
        size="large"
        startDecorator={<ErrorIcon sx={{ fontSize: 'inherit', color: 'var(--Buttons-Error-Border)' }} />}
        endDecorator={
          <Box component="button" sx={{
            padding: '4px 12px', fontSize: '13px', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer',
            backgroundColor: 'var(--Buttons-Error-Button)', color: 'var(--Buttons-Error-Text)',
          }}>
            Retry
          </Box>
        }
      >
        Your session has expired. Please try again.
      </Alert>
    </Box>
  ),
};
