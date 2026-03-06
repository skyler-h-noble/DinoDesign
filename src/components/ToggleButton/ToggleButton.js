// src/components/ToggleButton/ToggleButton.js
import React, { useState } from 'react';
import {
  ToggleButton as MuiToggleButton,
  ToggleButtonGroup as MuiToggleButtonGroup,
  Box,
  Stack,
  Typography,
  Paper,
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import AlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import AlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import AlignRightIcon from '@mui/icons-material/FormatAlignRight';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import GridViewIcon from '@mui/icons-material/GridView';

/**
 * ToggleButton Component
 * Single toggle button with design system styling
 * 
 * Design System Integration:
 * - Border: var(--Border)
 * - Background: Transparent or var(--Buttons-Primary-Button)
 * - Text: var(--Text)
 * 
 * WCAG 2.1 Accessibility:
 * - Proper ARIA labels
 * - Keyboard accessible
 * - Visual feedback on toggle
 * - Sufficient contrast
 * 
 * @param {React.ReactNode} children - Button content (text or icon)
 * @param {boolean} selected - Button selected state
 * @param {function} onChange - Selection change handler
 * @param {string} value - Button value
 * @param {object} props - Additional props
 */
export function ToggleButton({
  children,
  selected = false,
  onChange,
  value,
  sx = {},
  ...props
}) {
  return (
    <MuiToggleButton
      value={value}
      selected={selected}
      onChange={onChange}
      sx={{
        border: '1px solid var(--Border)',
        color: 'var(--Text)',
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        '&:hover': {
          backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'var(--Container-High)',
        },
        '&.Mui-selected': {
          backgroundColor: 'var(--Buttons-Primary-Button)',
          color: '#fff',
          '&:hover': {
            backgroundColor: 'var(--Buttons-Primary-Button)',
          },
        },
        textTransform: 'none',
        fontWeight: 500,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiToggleButton>
  );
}

/**
 * ToggleButtonGroup Component
 * Group of toggle buttons with exclusive or multiple selection
 * 
 * @param {Array} value - Selected value(s)
 * @param {function} onChange - Selection change handler
 * @param {'exclusive' | 'multiple'} exclusive - Selection mode
 * @param {Array} options - Button options [{value, label, icon?}]
 * @param {boolean} fullWidth - Stretch to full width
 * @param {object} props - Additional props
 */
export function ToggleButtonGroup({
  value,
  onChange,
  exclusive = true,
  options = [],
  fullWidth = false,
  sx = {},
  ...props
}) {
  return (
    <MuiToggleButtonGroup
      value={value}
      onChange={onChange}
      exclusive={exclusive}
      sx={{
        border: '1px solid var(--Border)',
        borderRadius: '4px',
        '& .MuiToggleButton-root': {
          border: 'none',
          borderRight: '1px solid var(--Border)',
          color: 'var(--Text)',
          backgroundColor: 'transparent',
          textTransform: 'none',
          fontWeight: 500,
          '&:last-child': {
            borderRight: 'none',
          },
          '&:hover': {
            backgroundColor: 'var(--Container-High)',
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--Buttons-Primary-Button)',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'var(--Buttons-Primary-Button)',
            },
          },
        },
        ...sx,
      }}
      fullWidth={fullWidth}
      {...props}
    >
      {options.map((option) => (
        <MuiToggleButton
          key={option.value}
          value={option.value}
          aria-label={option.label}
        >
          {option.icon && <Box sx={{ mr: option.label ? 1 : 0 }}>{option.icon}</Box>}
          {option.label}
        </MuiToggleButton>
      ))}
    </MuiToggleButtonGroup>
  );
}

/**
 * TextFormatToggleGroup Component
 * Text formatting buttons (bold, italic, underline)
 * 
 * @param {Array} formats - Selected formats
 * @param {function} onChange - Format change handler
 * @param {object} props - Additional props
 */
export function TextFormatToggleGroup({
  formats = [],
  onChange,
  sx = {},
  ...props
}) {
  const handleFormat = (event, newFormats) => {
    onChange?.(newFormats);
  };

  return (
    <MuiToggleButtonGroup
      value={formats}
      onChange={handleFormat}
      exclusive={false}
      sx={{
        border: '1px solid var(--Border)',
        borderRadius: '4px',
        '& .MuiToggleButton-root': {
          border: 'none',
          borderRight: '1px solid var(--Border)',
          color: 'var(--Text)',
          backgroundColor: 'transparent',
          '&:last-child': {
            borderRight: 'none',
          },
          '&:hover': {
            backgroundColor: 'var(--Container-High)',
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--Buttons-Primary-Button)',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'var(--Buttons-Primary-Button)',
            },
          },
        },
        ...sx,
      }}
      {...props}
    >
      <MuiToggleButton value="bold" aria-label="bold">
        <FormatBoldIcon />
      </MuiToggleButton>
      <MuiToggleButton value="italic" aria-label="italic">
        <FormatItalicIcon />
      </MuiToggleButton>
      <MuiToggleButton value="underlined" aria-label="underlined">
        <FormatUnderlinedIcon />
      </MuiToggleButton>
    </MuiToggleButtonGroup>
  );
}

/**
 * AlignmentToggleGroup Component
 * Text alignment buttons (left, center, right)
 * 
 * @param {string} alignment - Selected alignment
 * @param {function} onChange - Alignment change handler
 * @param {object} props - Additional props
 */
export function AlignmentToggleGroup({
  alignment = 'left',
  onChange,
  sx = {},
  ...props
}) {
  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      onChange?.(newAlignment);
    }
  };

  return (
    <MuiToggleButtonGroup
      value={alignment}
      onChange={handleAlignment}
      exclusive
      sx={{
        border: '1px solid var(--Border)',
        borderRadius: '4px',
        '& .MuiToggleButton-root': {
          border: 'none',
          borderRight: '1px solid var(--Border)',
          color: 'var(--Text)',
          backgroundColor: 'transparent',
          '&:last-child': {
            borderRight: 'none',
          },
          '&:hover': {
            backgroundColor: 'var(--Container-High)',
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--Buttons-Primary-Button)',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'var(--Buttons-Primary-Button)',
            },
          },
        },
        ...sx,
      }}
      {...props}
    >
      <MuiToggleButton value="left" aria-label="left aligned">
        <AlignLeftIcon />
      </MuiToggleButton>
      <MuiToggleButton value="center" aria-label="center aligned">
        <AlignCenterIcon />
      </MuiToggleButton>
      <MuiToggleButton value="right" aria-label="right aligned">
        <AlignRightIcon />
      </MuiToggleButton>
    </MuiToggleButtonGroup>
  );
}

/**
 * ViewModeToggleGroup Component
 * View mode buttons (list, module, grid)
 * 
 * @param {string} viewMode - Selected view mode
 * @param {function} onChange - View mode change handler
 * @param {object} props - Additional props
 */
export function ViewModeToggleGroup({
  viewMode = 'list',
  onChange,
  sx = {},
  ...props
}) {
  const handleViewMode = (event, newViewMode) => {
    if (newViewMode !== null) {
      onChange?.(newViewMode);
    }
  };

  return (
    <MuiToggleButtonGroup
      value={viewMode}
      onChange={handleViewMode}
      exclusive
      sx={{
        border: '1px solid var(--Border)',
        borderRadius: '4px',
        '& .MuiToggleButton-root': {
          border: 'none',
          borderRight: '1px solid var(--Border)',
          color: 'var(--Text)',
          backgroundColor: 'transparent',
          '&:last-child': {
            borderRight: 'none',
          },
          '&:hover': {
            backgroundColor: 'var(--Container-High)',
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--Buttons-Primary-Button)',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'var(--Buttons-Primary-Button)',
            },
          },
        },
        ...sx,
      }}
      {...props}
    >
      <MuiToggleButton value="list" aria-label="list view">
        <ViewListIcon />
      </MuiToggleButton>
      <MuiToggleButton value="module" aria-label="module view">
        <ViewModuleIcon />
      </MuiToggleButton>
      <MuiToggleButton value="grid" aria-label="grid view">
        <GridViewIcon />
      </MuiToggleButton>
    </MuiToggleButtonGroup>
  );
}

/**
 * SizeToggleGroup Component
 * Size selection toggle group
 * 
 * @param {string} size - Selected size
 * @param {function} onChange - Size change handler
 * @param {object} props - Additional props
 */
export function SizeToggleGroup({
  size = 'medium',
  onChange,
  sx = {},
  ...props
}) {
  const handleSize = (event, newSize) => {
    if (newSize !== null) {
      onChange?.(newSize);
    }
  };

  return (
    <MuiToggleButtonGroup
      value={size}
      onChange={handleSize}
      exclusive
      sx={{
        border: '1px solid var(--Border)',
        borderRadius: '4px',
        '& .MuiToggleButton-root': {
          border: 'none',
          borderRight: '1px solid var(--Border)',
          color: 'var(--Text)',
          backgroundColor: 'transparent',
          textTransform: 'none',
          fontWeight: 500,
          '&:last-child': {
            borderRight: 'none',
          },
          '&:hover': {
            backgroundColor: 'var(--Container-High)',
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--Buttons-Primary-Button)',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'var(--Buttons-Primary-Button)',
            },
          },
        },
        ...sx,
      }}
      {...props}
    >
      <MuiToggleButton value="small" aria-label="small">
        Small
      </MuiToggleButton>
      <MuiToggleButton value="medium" aria-label="medium">
        Medium
      </MuiToggleButton>
      <MuiToggleButton value="large" aria-label="large">
        Large
      </MuiToggleButton>
    </MuiToggleButtonGroup>
  );
}

/**
 * VerticalToggleButtonGroup Component
 * Vertical orientation toggle group
 * 
 * @param {Array} value - Selected value(s)
 * @param {function} onChange - Selection change handler
 * @param {Array} options - Button options
 * @param {boolean} exclusive - Exclusive selection
 * @param {object} props - Additional props
 */
export function VerticalToggleButtonGroup({
  value,
  onChange,
  options = [],
  exclusive = true,
  sx = {},
  ...props
}) {
  return (
    <MuiToggleButtonGroup
      value={value}
      onChange={onChange}
      exclusive={exclusive}
      orientation="vertical"
      sx={{
        border: '1px solid var(--Border)',
        borderRadius: '4px',
        '& .MuiToggleButton-root': {
          border: 'none',
          borderBottom: '1px solid var(--Border)',
          color: 'var(--Text)',
          backgroundColor: 'transparent',
          textTransform: 'none',
          fontWeight: 500,
          '&:last-child': {
            borderBottom: 'none',
          },
          '&:hover': {
            backgroundColor: 'var(--Container-High)',
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--Buttons-Primary-Button)',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'var(--Buttons-Primary-Button)',
            },
          },
        },
        ...sx,
      }}
      {...props}
    >
      {options.map((option) => (
        <MuiToggleButton
          key={option.value}
          value={option.value}
          aria-label={option.label}
        >
          {option.icon && <Box sx={{ mr: 1 }}>{option.icon}</Box>}
          {option.label}
        </MuiToggleButton>
      ))}
    </MuiToggleButtonGroup>
  );
}

/**
 * DisabledToggleButton Component
 * Toggle button in disabled state
 * 
 * @param {object} props - Toggle button props
 */
export function DisabledToggleButton({
  children,
  selected = false,
  sx = {},
  ...props
}) {
  return (
    <MuiToggleButton
      disabled
      selected={selected}
      sx={{
        border: '1px solid var(--Border)',
        color: 'var(--Text)',
        opacity: 0.5,
        backgroundColor: selected ? 'var(--Buttons-Primary-Button)' : 'transparent',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiToggleButton>
  );
}

/**
 * ToggleButtonShowcase Component
 * Display all toggle button variants
 */
export function ToggleButtonShowcase() {
  const [textFormats, setTextFormats] = useState([]);
  const [alignment, setAlignment] = useState('left');
  const [viewMode, setViewMode] = useState('list');
  const [size, setSize] = useState('medium');
  const [selected, setSelected] = useState(false);

  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  return (
    <Stack spacing={4}>
      {/* Single Toggle Button */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Single Toggle Button
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <ToggleButton
            selected={selected}
            onChange={() => setSelected(!selected)}
            value="toggle"
          >
            Toggle Me
          </ToggleButton>
          <Typography variant="caption" sx={{ color: 'var(--Text-Quiet)', ml: 2 }}>
            Selected: {selected ? 'Yes' : 'No'}
          </Typography>
        </Box>
      </Box>

      {/* Text Format Group */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Text Format (Multiple Selection)
        </Typography>
        <TextFormatToggleGroup
          formats={textFormats}
          onChange={setTextFormats}
        />
        <Typography variant="caption" sx={{ color: 'var(--Text-Quiet)', display: 'block', mt: 1 }}>
          Selected: {textFormats.length > 0 ? textFormats.join(', ') : 'None'}
        </Typography>
      </Box>

      {/* Alignment Group */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Text Alignment (Exclusive Selection)
        </Typography>
        <AlignmentToggleGroup
          alignment={alignment}
          onChange={setAlignment}
        />
        <Typography variant="caption" sx={{ color: 'var(--Text-Quiet)', display: 'block', mt: 1 }}>
          Alignment: {alignment}
        </Typography>
      </Box>

      {/* View Mode Group */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          View Mode (Icon Only)
        </Typography>
        <ViewModeToggleGroup
          viewMode={viewMode}
          onChange={setViewMode}
        />
        <Typography variant="caption" sx={{ color: 'var(--Text-Quiet)', display: 'block', mt: 1 }}>
          View Mode: {viewMode}
        </Typography>
      </Box>

      {/* Size Selection */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Size Selection
        </Typography>
        <SizeToggleGroup
          size={size}
          onChange={setSize}
        />
        <Typography variant="caption" sx={{ color: 'var(--Text-Quiet)', display: 'block', mt: 1 }}>
          Size: {size}
        </Typography>
      </Box>

      {/* Generic Toggle Button Group */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Custom Toggle Group
        </Typography>
        <ToggleButtonGroup
          value="option1"
          onChange={(event, newValue) => console.log(newValue)}
          options={options}
          fullWidth
        />
      </Box>

      {/* Vertical Orientation */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Vertical Orientation
        </Typography>
        <VerticalToggleButtonGroup
          value="option1"
          onChange={(event, newValue) => console.log(newValue)}
          options={options}
        />
      </Box>

      {/* Disabled State */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Disabled State
        </Typography>
        <Stack direction="row" spacing={1}>
          <DisabledToggleButton value="disabled">
            Disabled (Unselected)
          </DisabledToggleButton>
          <DisabledToggleButton value="disabled-selected" selected>
            Disabled (Selected)
          </DisabledToggleButton>
        </Stack>
      </Box>
    </Stack>
  );
}

export default ToggleButton;
