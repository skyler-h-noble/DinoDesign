// src/components/Snackbar/Snackbar.stories.js
import React from 'react';
import { Snackbar } from './Snackbar';
import { Box, Stack } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default { title: 'Feedback/Snackbar', component: Snackbar };

const SnackbarDemo = (snackbarProps) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Box sx={{ p: 4 }}>
      <Box
        component="button"
        onClick={() => setOpen(true)}
        sx={{ padding: '8px 16px', fontSize: '14px', cursor: 'pointer',
          border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)',
          backgroundColor: 'var(--Background)', color: 'var(--Text)', fontFamily: 'inherit' }}
      >
        Show Snackbar
      </Box>
      <Snackbar open={open} onClose={() => setOpen(false)} autoHideDuration={4000} {...snackbarProps}>
        {snackbarProps.children || 'Changes saved successfully.'}
      </Snackbar>
    </Box>
  );
};

export const Default = { render: () => <SnackbarDemo /> };

export const Variants = {
  name: 'All Variants',
  render: () => {
    const Demo = () => {
      const [which, setWhich] = React.useState(null);
      return (
        <Box sx={{ p: 4 }}>
          <Stack direction="row" spacing={2}>
            {['standard', 'solid', 'light'].map((v) => (
              <Box key={v} component="button" onClick={() => setWhich(v)}
                sx={{ padding: '8px 16px', fontSize: '13px', cursor: 'pointer',
                  border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)',
                  backgroundColor: 'var(--Background)', color: 'var(--Text)', fontFamily: 'inherit' }}>
                {v}
              </Box>
            ))}
          </Stack>
          {['standard', 'solid', 'light'].map((v) => (
            <Snackbar key={v} open={which === v} onClose={() => setWhich(null)} variant={v} color="info" autoHideDuration={4000}>
              This is a {v} snackbar
            </Snackbar>
          ))}
        </Box>
      );
    };
    return <Demo />;
  },
};

export const SolidColors = {
  name: 'Solid — All Colors',
  render: () => {
    const Demo = () => {
      const [active, setActive] = React.useState(null);
      const colors = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
      return (
        <Box sx={{ p: 4 }}>
          <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
            {colors.map((c) => (
              <Box key={c} component="button" onClick={() => setActive(c)}
                sx={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer',
                  border: '1px solid var(--Border)', borderRadius: '4px',
                  backgroundColor: 'var(--Background)', color: 'var(--Text)', fontFamily: 'inherit' }}>
                {c}
              </Box>
            ))}
          </Stack>
          {colors.map((c) => (
            <Snackbar key={c} open={active === c} onClose={() => setActive(null)} variant="solid" color={c} autoHideDuration={4000}>
              Solid {c} notification
            </Snackbar>
          ))}
        </Box>
      );
    };
    return <Demo />;
  },
};

export const LightColors = {
  name: 'Light — All Colors',
  render: () => {
    const Demo = () => {
      const [active, setActive] = React.useState(null);
      const colors = ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'];
      return (
        <Box sx={{ p: 4 }}>
          <Stack direction="row" flexWrap="wrap" sx={{ gap: 1 }}>
            {colors.map((c) => (
              <Box key={c} component="button" onClick={() => setActive(c)}
                sx={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer',
                  border: '1px solid var(--Border)', borderRadius: '4px',
                  backgroundColor: 'var(--Background)', color: 'var(--Text)', fontFamily: 'inherit' }}>
                {c}
              </Box>
            ))}
          </Stack>
          {colors.map((c) => (
            <Snackbar key={c} open={active === c} onClose={() => setActive(null)} variant="light" color={c} autoHideDuration={4000}>
              Light {c} notification
            </Snackbar>
          ))}
        </Box>
      );
    };
    return <Demo />;
  },
};

export const Sizes = {
  render: () => {
    const Demo = () => {
      const [active, setActive] = React.useState(null);
      return (
        <Box sx={{ p: 4 }}>
          <Stack direction="row" spacing={2}>
            {['small', 'medium', 'large'].map((s) => (
              <Box key={s} component="button" onClick={() => setActive(s)}
                sx={{ padding: '8px 16px', fontSize: '13px', cursor: 'pointer',
                  border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)',
                  backgroundColor: 'var(--Background)', color: 'var(--Text)', fontFamily: 'inherit' }}>
                {s}
              </Box>
            ))}
          </Stack>
          {['small', 'medium', 'large'].map((s) => (
            <Snackbar key={s} open={active === s} onClose={() => setActive(null)} size={s} autoHideDuration={4000}>
              Size: {s}
            </Snackbar>
          ))}
        </Box>
      );
    };
    return <Demo />;
  },
};

export const AnchorTop = {
  name: 'Anchor Top',
  render: () => <SnackbarDemo anchor="top">Anchored to top</SnackbarDemo>,
};

export const WithStartDecorator = {
  name: 'With Start Decorator',
  render: () => (
    <SnackbarDemo
      variant="light"
      color="success"
      startDecorator={<CheckCircleOutlineIcon sx={{ fontSize: 'inherit' }} />}
    >
      Operation completed successfully!
    </SnackbarDemo>
  ),
};

export const WithAction = {
  name: 'With Action Button',
  render: () => (
    <SnackbarDemo
      variant="solid"
      color="info"
      action={
        <Box component="button"
          sx={{ padding: '4px 10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
            border: '1px solid var(--Border)', borderRadius: '4px',
            backgroundColor: 'transparent', color: 'var(--Text)', fontFamily: 'inherit',
            '&:hover': { backgroundColor: 'var(--Hover)' } }}>
          Undo
        </Box>
      }
    >
      Item deleted
    </SnackbarDemo>
  ),
};

export const NoAutoHide = {
  name: 'No Auto-hide (persistent)',
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <Box sx={{ p: 4 }}>
        <Box component="button" onClick={() => setOpen(true)}
          sx={{ padding: '8px 16px', fontSize: '14px', cursor: 'pointer',
            border: '1px solid var(--Border)', borderRadius: 'var(--Style-Border-Radius)',
            backgroundColor: 'var(--Background)', color: 'var(--Text)', fontFamily: 'inherit' }}>
          Show persistent snackbar
        </Box>
        <Snackbar open={open} onClose={() => setOpen(false)}>
          This snackbar stays until dismissed.
        </Snackbar>
      </Box>
    );
  },
};
