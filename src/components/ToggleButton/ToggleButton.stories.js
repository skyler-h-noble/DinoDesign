// src/components/ToggleButton/ToggleButton.stories.js
import {
  ToggleButton,
  ToggleButtonGroup,
  TextFormatToggleGroup,
  AlignmentToggleGroup,
  ViewModeToggleGroup,
  SizeToggleGroup,
  VerticalToggleButtonGroup,
  DisabledToggleButton,
  ToggleButtonShowcase,
} from './ToggleButton';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';

export default {
  title: 'Inputs/ToggleButton',
  component: ToggleButton,
};

// Single Toggle Button
export const SingleToggleButton = {
  render: () => {
    const Demo = () => {
      const [selected, setSelected] = useState(false);
      return (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
            Single Toggle Button
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ToggleButton
              selected={selected}
              onChange={() => setSelected(!selected)}
              value="toggle"
            >
              Toggle Me
            </ToggleButton>
            <Typography variant="body2" sx={{ color: 'var(--Text-Quiet)' }}>
              Selected: {selected ? 'Yes' : 'No'}
            </Typography>
          </Box>
        </Paper>
      );
    };
    return <Demo />;
  },
};

// Exclusive Selection Group
export const ExclusiveSelection = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState('option1');
      return (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
            Exclusive Selection
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'var(--Text-Quiet)' }}>
            Only one option can be selected at a time
          </Typography>
          <ToggleButtonGroup
            value={value}
            onChange={(event, newValue) => newValue && setValue(newValue)}
            options={[
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' },
            ]}
            fullWidth
          />
          <Typography variant="caption" sx={{ color: 'var(--Text-Quiet)', display: 'block', mt: 2 }}>
            Selected: {value}
          </Typography>
        </Paper>
      );
    };
    return <Demo />;
  },
};

// Multiple Selection
export const MultipleSelection = {
  render: () => {
    const Demo = () => {
      const [selected, setSelected] = useState([]);
      const handleChange = (event, newSelected) => {
        setSelected(newSelected);
      };
      return (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
            Multiple Selection
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'var(--Text-Quiet)' }}>
            Multiple options can be selected
          </Typography>
          <ToggleButtonGroup
            value={selected}
            onChange={handleChange}
            exclusive={false}
            options={[
              { value: 'opt1', label: 'Option 1' },
              { value: 'opt2', label: 'Option 2' },
              { value: 'opt3', label: 'Option 3' },
            ]}
            fullWidth
          />
          <Typography variant="caption" sx={{ color: 'var(--Text-Quiet)', display: 'block', mt: 2 }}>
            Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
          </Typography>
        </Paper>
      );
    };
    return <Demo />;
  },
};

// Text Format Group
export const TextFormat = {
  render: () => {
    const Demo = () => {
      const [formats, setFormats] = useState([]);
      return (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
            Text Format Buttons
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'var(--Text-Quiet)' }}>
            Common text formatting options (Bold, Italic, Underline)
          </Typography>
          <TextFormatToggleGroup
            formats={formats}
            onChange={setFormats}
          />
          <Typography variant="caption" sx={{ color: 'var(--Text-Quiet)', display: 'block', mt: 2 }}>
            Selected: {formats.length > 0 ? formats.join(', ') : 'None'}
          </Typography>
        </Paper>
      );
    };
    return <Demo />;
  },
};

// Text Alignment
export const TextAlignment = {
  render: () => {
    const Demo = () => {
      const [alignment, setAlignment] = useState('left');
      return (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
            Text Alignment
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'var(--Text-Quiet)' }}>
            Choose text alignment direction
          </Typography>
          <AlignmentToggleGroup
            alignment={alignment}
            onChange={setAlignment}
          />
          <Typography variant="caption" sx={{ color: 'var(--Text-Quiet)', display: 'block', mt: 2 }}>
            Alignment: {alignment}
          </Typography>
        </Paper>
      );
    };
    return <Demo />;
  },
};

// View Mode Selection
export const ViewMode = {
  render: () => {
    const Demo = () => {
      const [viewMode, setViewMode] = useState('list');
      return (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
            View Mode Selection
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'var(--Text-Quiet)' }}>
            Select how to display content (List, Module, Grid)
          </Typography>
          <ViewModeToggleGroup
            viewMode={viewMode}
            onChange={setViewMode}
          />
          <Typography variant="caption" sx={{ color: 'var(--Text-Quiet)', display: 'block', mt: 2 }}>
            View Mode: {viewMode}
          </Typography>
        </Paper>
      );
    };
    return <Demo />;
  },
};

// Size Selection
export const SizeSelection = {
  render: () => {
    const Demo = () => {
      const [size, setSize] = useState('medium');
      return (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
            Size Selection
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'var(--Text-Quiet)' }}>
            Choose a size option
          </Typography>
          <SizeToggleGroup
            size={size}
            onChange={setSize}
          />
          <Typography variant="caption" sx={{ color: 'var(--Text-Quiet)', display: 'block', mt: 2 }}>
            Size: {size}
          </Typography>
        </Paper>
      );
    };
    return <Demo />;
  },
};

// Vertical Orientation
export const VerticalOrientation = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState('option1');
      return (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
            Vertical Orientation
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'var(--Text-Quiet)' }}>
            Toggle buttons arranged vertically
          </Typography>
          <VerticalToggleButtonGroup
            value={value}
            onChange={(event, newValue) => newValue && setValue(newValue)}
            options={[
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' },
            ]}
          />
          <Typography variant="caption" sx={{ color: 'var(--Text-Quiet)', display: 'block', mt: 2 }}>
            Selected: {value}
          </Typography>
        </Paper>
      );
    };
    return <Demo />;
  },
};

// Disabled State
export const DisabledState = {
  render: () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        Disabled State
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'var(--Text-Quiet)' }}>
        Disabled toggle buttons cannot be interacted with
      </Typography>
      <Stack direction="row" spacing={2}>
        <DisabledToggleButton value="disabled">
          Disabled (Unselected)
        </DisabledToggleButton>
        <DisabledToggleButton value="disabled-selected" selected>
          Disabled (Selected)
        </DisabledToggleButton>
      </Stack>
    </Paper>
  ),
};

// Design System Demo
export const DesignSystemDemo = {
  render: () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        ToggleButton Design System
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Design System Variables:
        </Typography>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li><Typography variant="caption">Border: var(--Border)</Typography></li>
          <li><Typography variant="caption">Selected Background: var(--Buttons-Primary-Button)</Typography></li>
          <li><Typography variant="caption">Hover: var(--Container-High)</Typography></li>
          <li><Typography variant="caption">Text: var(--Text)</Typography></li>
        </ul>
      </Box>

      <Box sx={{ p: 2, backgroundColor: 'var(--Container-Low)', borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Example:
        </Typography>
        <ToggleButtonGroup
          value="opt1"
          onChange={jest.fn()}
          options={[
            { value: 'opt1', label: 'Option 1' },
            { value: 'opt2', label: 'Option 2' },
            { value: 'opt3', label: 'Option 3' },
          ]}
          fullWidth
        />
      </Box>
    </Paper>
  ),
};

// All Variants
export const AllVariants = {
  render: () => <ToggleButtonShowcase />,
};
