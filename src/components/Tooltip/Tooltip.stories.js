// src/components/Tooltip/Tooltip.stories.js
import React from 'react';
import { Tooltip } from './Tooltip';
import { Stack, Box, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';

export default { title: 'Data Display/Tooltip', component: Tooltip };

const TriggerButton = ({ label, color = 'primary' }) => {
  const C = color.charAt(0).toUpperCase() + color.slice(1);
  return (
    <Button variant="contained"
      sx={{ backgroundColor: 'var(--Buttons-' + C + '-Button)',
        color: 'var(--Buttons-' + C + '-Text)', textTransform: 'none',
        fontFamily: 'inherit', borderRadius: 'var(--Style-Border-Radius)',
        '&:hover': { backgroundColor: 'var(--Buttons-' + C + '-Hover)' } }}>
      {label}
    </Button>
  );
};

export const Default = {
  render: () => (
    <Box sx={{ p: 8, display: 'flex', justifyContent: 'center' }}>
      <Tooltip title="Default solid tooltip">
        <TriggerButton label="Hover me" />
      </Tooltip>
    </Box>
  ),
};

export const Variants = {
  name: 'All Variants (Solid / Light / Outline)',
  render: () => (
    <Stack direction="row" spacing={4} sx={{ p: 8, justifyContent: 'center' }}>
      {['solid', 'light', 'outline'].map((v) => (
        <Tooltip key={v} title={'This is ' + v + ' style'} variant={v} color="primary" open>
          <TriggerButton label={v.charAt(0).toUpperCase() + v.slice(1)} />
        </Tooltip>
      ))}
    </Stack>
  ),
};

export const SolidColors = {
  name: 'Solid — All Colors',
  render: () => (
    <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ p: 8, justifyContent: 'center', gap: 4 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Tooltip key={c} title={'Tooltip: ' + c} variant="solid" color={c} open>
          <TriggerButton label={c} color={c} />
        </Tooltip>
      ))}
    </Stack>
  ),
};

export const LightColors = {
  name: 'Light — All Colors',
  render: () => (
    <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ p: 8, justifyContent: 'center', gap: 4 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Tooltip key={c} title={'Tooltip: ' + c} variant="light" color={c} open>
          <TriggerButton label={c} color={c} />
        </Tooltip>
      ))}
    </Stack>
  ),
};

export const OutlineColors = {
  name: 'Outline — All Colors',
  render: () => (
    <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ p: 8, justifyContent: 'center', gap: 4 }}>
      {['primary', 'secondary', 'tertiary', 'neutral', 'info', 'success', 'warning', 'error'].map((c) => (
        <Tooltip key={c} title={'Tooltip: ' + c} variant="outline" color={c} open>
          <TriggerButton label={c} color={c} />
        </Tooltip>
      ))}
    </Stack>
  ),
};

export const Sizes = {
  render: () => (
    <Stack direction="row" spacing={4} sx={{ p: 8, justifyContent: 'center' }}>
      {['small', 'medium', 'large'].map((s) => (
        <Tooltip key={s} title={'This is ' + s + ' size'} variant="solid" color="primary" size={s} open>
          <TriggerButton label={s.charAt(0).toUpperCase() + s.slice(1)} />
        </Tooltip>
      ))}
    </Stack>
  ),
};

export const Placements = {
  name: 'All 12 Placements',
  render: () => {
    const placements = [
      'top-start', 'top', 'top-end',
      'right-start', 'right', 'right-end',
      'bottom-start', 'bottom', 'bottom-end',
      'left-start', 'left', 'left-end',
    ];
    return (
      <Box sx={{ p: 10, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
        {placements.map((p) => (
          <Tooltip key={p} title={p} variant="solid" color="neutral" placement={p} open size="small">
            <TriggerButton label={p} color="neutral" />
          </Tooltip>
        ))}
      </Box>
    );
  },
};

export const WithArrow = {
  name: 'Arrow Tooltips',
  render: () => (
    <Stack direction="row" spacing={4} sx={{ p: 8, justifyContent: 'center' }}>
      <Tooltip title="Solid with arrow" variant="solid" color="primary" arrow open placement="top">
        <TriggerButton label="Solid" />
      </Tooltip>
      <Tooltip title="Light with arrow" variant="light" color="info" arrow open placement="top">
        <TriggerButton label="Light" color="info" />
      </Tooltip>
      <Tooltip title="Outline with arrow" variant="outline" color="error" arrow open placement="top">
        <TriggerButton label="Outline" color="error" />
      </Tooltip>
    </Stack>
  ),
};

export const OpenStates = {
  name: 'Open Control (uncontrolled / true / false)',
  render: () => (
    <Stack direction="row" spacing={4} sx={{ p: 8, justifyContent: 'center' }}>
      <Tooltip title="I appear on hover" variant="solid" color="primary">
        <TriggerButton label="Uncontrolled" />
      </Tooltip>
      <Tooltip title="Always visible" variant="solid" color="success" open={true}>
        <TriggerButton label="open={true}" color="success" />
      </Tooltip>
      <Tooltip title="Never visible" variant="solid" color="error" open={false}>
        <TriggerButton label="open={false}" color="error" />
      </Tooltip>
    </Stack>
  ),
};

export const IconButtonTrigger = {
  name: 'Icon Button as Trigger',
  render: () => (
    <Stack direction="row" spacing={3} sx={{ p: 8, justifyContent: 'center' }}>
      <Tooltip title="Delete" variant="solid" color="error" arrow>
        <IconButton sx={{ color: 'var(--Buttons-Error-Button)' }}><DeleteIcon /></IconButton>
      </Tooltip>
      <Tooltip title="Add item" variant="light" color="success" arrow>
        <IconButton sx={{ color: 'var(--Buttons-Success-Button)' }}><AddIcon /></IconButton>
      </Tooltip>
      <Tooltip title="More info" variant="outline" color="info" arrow>
        <IconButton sx={{ color: 'var(--Buttons-Info-Button)' }}><InfoIcon /></IconButton>
      </Tooltip>
    </Stack>
  ),
};
