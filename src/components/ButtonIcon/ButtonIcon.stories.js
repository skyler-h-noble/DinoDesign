// src/components/ButtonIcon/ButtonIcon.stories.js
import { ButtonIcon, IconButtonGroup } from './ButtonIcon';
import { Stack } from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  FavoriteBorder as FavoriteIcon,
} from '@mui/icons-material';

export default {
  title: 'Components/Button/ButtonIcon',
  component: ButtonIcon,
  argTypes: {
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'radio' },
      description: 'Button size',
    },
    color: {
      options: ['primary', 'secondary', 'tertiary', 'success', 'error', 'warning', 'info', 'neutral', 'default'],
      control: { type: 'radio' },
      description: 'Button color',
    },
    variant: {
      options: ['text', 'filled', 'outlined'],
      control: { type: 'radio' },
      description: 'Button style variant',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

// Text variant (default)
export const TextVariant = {
  args: {
    variant: 'text',
    color: 'primary',
    children: <EditIcon />,
  },
};

// Filled variant
export const FilledVariant = {
  args: {
    variant: 'filled',
    color: 'primary',
    children: <EditIcon />,
  },
};

// Outlined variant
export const OutlinedVariant = {
  args: {
    variant: 'outlined',
    color: 'primary',
    children: <EditIcon />,
  },
};

// All sizes
export const AllSizes = {
  render: () => (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
      <ButtonIcon size="small"><EditIcon /></ButtonIcon>
      <ButtonIcon size="medium"><EditIcon /></ButtonIcon>
      <ButtonIcon size="large"><EditIcon /></ButtonIcon>
    </Stack>
  ),
};

// All colors - Text variant
export const AllColorsText = {
  render: () => (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
      <ButtonIcon color="primary"><EditIcon /></ButtonIcon>
      <ButtonIcon color="secondary"><EditIcon /></ButtonIcon>
      <ButtonIcon color="tertiary"><EditIcon /></ButtonIcon>
      <ButtonIcon color="success"><SaveIcon /></ButtonIcon>
      <ButtonIcon color="error"><DeleteIcon /></ButtonIcon>
      <ButtonIcon color="warning"><SettingsIcon /></ButtonIcon>
      <ButtonIcon color="info"><AddIcon /></ButtonIcon>
    </Stack>
  ),
};

// All colors - Filled variant
export const AllColorsFilled = {
  render: () => (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
      <ButtonIcon variant="filled" color="primary"><EditIcon /></ButtonIcon>
      <ButtonIcon variant="filled" color="secondary"><EditIcon /></ButtonIcon>
      <ButtonIcon variant="filled" color="tertiary"><EditIcon /></ButtonIcon>
      <ButtonIcon variant="filled" color="success"><SaveIcon /></ButtonIcon>
      <ButtonIcon variant="filled" color="error"><DeleteIcon /></ButtonIcon>
      <ButtonIcon variant="filled" color="warning"><SettingsIcon /></ButtonIcon>
      <ButtonIcon variant="filled" color="info"><AddIcon /></ButtonIcon>
    </Stack>
  ),
};

// All colors - Outlined variant
export const AllColorsOutlined = {
  render: () => (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
      <ButtonIcon variant="outlined" color="primary"><EditIcon /></ButtonIcon>
      <ButtonIcon variant="outlined" color="secondary"><EditIcon /></ButtonIcon>
      <ButtonIcon variant="outlined" color="tertiary"><EditIcon /></ButtonIcon>
      <ButtonIcon variant="outlined" color="success"><SaveIcon /></ButtonIcon>
      <ButtonIcon variant="outlined" color="error"><DeleteIcon /></ButtonIcon>
      <ButtonIcon variant="outlined" color="warning"><SettingsIcon /></ButtonIcon>
      <ButtonIcon variant="outlined" color="info"><AddIcon /></ButtonIcon>
    </Stack>
  ),
};

// States
export const States = {
  render: () => (
    <Stack direction="row" spacing={2}>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Normal</div>
        <ButtonIcon><EditIcon /></ButtonIcon>
      </div>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Disabled</div>
        <ButtonIcon disabled><EditIcon /></ButtonIcon>
      </div>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Loading</div>
        <ButtonIcon loading><EditIcon /></ButtonIcon>
      </div>
    </Stack>
  ),
};

// With different icons
export const DifferentIcons = {
  render: () => (
    <Stack direction="row" spacing={2}>
      <ButtonIcon><EditIcon /></ButtonIcon>
      <ButtonIcon><DeleteIcon /></ButtonIcon>
      <ButtonIcon><SaveIcon /></ButtonIcon>
      <ButtonIcon><SettingsIcon /></ButtonIcon>
      <ButtonIcon><AddIcon /></ButtonIcon>
      <ButtonIcon><CloseIcon /></ButtonIcon>
      <ButtonIcon><DownloadIcon /></ButtonIcon>
      <ButtonIcon><ShareIcon /></ButtonIcon>
      <ButtonIcon><FavoriteIcon /></ButtonIcon>
    </Stack>
  ),
};

// Interactive
export const Interactive = {
  render: () => {
    const handleClick = (action) => {
      console.log(`Clicked: ${action}`);
    };
    return (
      <Stack direction="row" spacing={2}>
        <ButtonIcon onClick={() => handleClick('Edit')} title="Edit"><EditIcon /></ButtonIcon>
        <ButtonIcon onClick={() => handleClick('Delete')} title="Delete"><DeleteIcon /></ButtonIcon>
        <ButtonIcon onClick={() => handleClick('Save')} title="Save"><SaveIcon /></ButtonIcon>
      </Stack>
    );
  },
};

// Button group - Text variant
export const GroupTextVariant = {
  render: () => (
    <IconButtonGroup
      buttons={[
        { icon: <EditIcon />, label: 'Edit' },
        { icon: <DeleteIcon />, label: 'Delete' },
        { icon: <SaveIcon />, label: 'Save' },
      ]}
      variant="text"
      color="primary"
    />
  ),
};

// Button group - Filled variant
export const GroupFilledVariant = {
  render: () => (
    <IconButtonGroup
      buttons={[
        { icon: <EditIcon />, label: 'Edit' },
        { icon: <DeleteIcon />, label: 'Delete' },
        { icon: <SaveIcon />, label: 'Save' },
      ]}
      variant="filled"
      color="primary"
    />
  ),
};

// Button group - Outlined variant
export const GroupOutlinedVariant = {
  render: () => (
    <IconButtonGroup
      buttons={[
        { icon: <EditIcon />, label: 'Edit' },
        { icon: <DeleteIcon />, label: 'Delete' },
        { icon: <SaveIcon />, label: 'Save' },
      ]}
      variant="outlined"
      color="primary"
    />
  ),
};

// Button group - Mixed colors
export const GroupMixedColors = {
  render: () => (
    <IconButtonGroup
      buttons={[
        { icon: <EditIcon />, label: 'Edit', color: 'primary' },
        { icon: <SaveIcon />, label: 'Save', color: 'success' },
        { icon: <DeleteIcon />, label: 'Delete', color: 'error' },
      ]}
      variant="filled"
    />
  ),
};

// Button group - Large size
export const GroupLargeSize = {
  render: () => (
    <IconButtonGroup
      buttons={[
        { icon: <EditIcon />, label: 'Edit' },
        { icon: <DeleteIcon />, label: 'Delete' },
        { icon: <SaveIcon />, label: 'Save' },
      ]}
      size="large"
      variant="filled"
      color="primary"
    />
  ),
};

// Button group - With disabled
export const GroupWithDisabled = {
  render: () => (
    <IconButtonGroup
      buttons={[
        { icon: <EditIcon />, label: 'Edit' },
        { icon: <DeleteIcon />, label: 'Delete', disabled: true },
        { icon: <SaveIcon />, label: 'Save' },
      ]}
      variant="filled"
      color="primary"
    />
  ),
};

// Toolbar example
export const ToolbarExample = {
  render: () => (
    <IconButtonGroup
      buttons={[
        { icon: <AddIcon />, label: 'Add' },
        { icon: <EditIcon />, label: 'Edit' },
        { icon: <DeleteIcon />, label: 'Delete' },
        { icon: <DownloadIcon />, label: 'Download' },
        { icon: <ShareIcon />, label: 'Share' },
      ]}
      size="medium"
      variant="outlined"
      color="primary"
    />
  ),
};
