// src/components/Progress/Progress.stories.js
import {
  Progress,
  CircularProgressComponent,
  ProgressWithLabel,
  StepProgress,
  BufferedProgress,
  SegmentedProgress,
  AllVariantsProgress,
  ProgressWithStates,
} from './Progress';
import { useState } from 'react';
import { Box, Stack, Typography, Paper, Slider } from '@mui/material';

export default {
  title: 'Feedback/Progress',
  component: Progress,
};

// Basic Progress
export const BasicProgress = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
          0%
        </Typography>
        <Progress value={0} />
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
          50%
        </Typography>
        <Progress value={50} />
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
          100%
        </Typography>
        <Progress value={100} />
      </Box>
    </Stack>
  ),
};

// All Color Variants
export const AllColorVariants = {
  render: () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        8 Color Variants
      </Typography>
      <AllVariantsProgress value={65} />
      <Typography variant="caption" sx={{ display: 'block', mt: 3, color: 'var(--Text-Secondary)' }}>
        • Unfilled: var(--Border-Variant)
        <br />
        • Filled (Primary): var(--Buttons-Primary-Button)
        <br />
        • Filled (Others): Semantic colors (success, warning, error, info)
      </Typography>
    </Paper>
  ),
};

// Sizes
export const Sizes = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
          Small
        </Typography>
        <Progress value={40} size="small" />
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
          Medium
        </Typography>
        <Progress value={40} size="medium" />
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
          Large
        </Typography>
        <Progress value={40} size="large" />
      </Box>
    </Stack>
  ),
};

// Indeterminate Progress
export const Indeterminate = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
          Indeterminate - Primary
        </Typography>
        <Progress indeterminate variant="primary" />
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
          Indeterminate - Success
        </Typography>
        <Progress indeterminate variant="success" />
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
          Indeterminate - Error
        </Typography>
        <Progress indeterminate variant="error" />
      </Box>
    </Stack>
  ),
};

// Striped Progress
export const Striped = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
          Striped - Animated
        </Typography>
        <Progress value={70} striped animated variant="primary" />
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
          Striped - Not Animated
        </Typography>
        <Progress value={70} striped animated={false} variant="warning" />
      </Box>
    </Stack>
  ),
};

// Circular Progress
export const Circular = {
  render: () => (
    <Stack spacing={3}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Circular Progress
      </Typography>
      <Stack direction="row" spacing={4} sx={{ flexWrap: 'wrap' }}>
        <CircularProgressComponent value={25} variant="primary" />
        <CircularProgressComponent value={50} variant="success" />
        <CircularProgressComponent value={75} variant="warning" />
        <CircularProgressComponent value={100} variant="error" />
      </Stack>
      <Typography variant="h6" sx={{ fontWeight: 700, mt: 4 }}>
        Indeterminate Circular
      </Typography>
      <Stack direction="row" spacing={4} sx={{ flexWrap: 'wrap' }}>
        <CircularProgressComponent indeterminate variant="primary" size={60} />
        <CircularProgressComponent indeterminate variant="success" size={60} />
      </Stack>
    </Stack>
  ),
};

// Progress with Label
export const WithLabel = {
  render: () => (
    <Stack spacing={3}>
      <ProgressWithLabel value={25} label="Download" variant="primary" />
      <ProgressWithLabel value={50} label="Installation" variant="success" />
      <ProgressWithLabel value={75} label="Processing" variant="warning" />
      <ProgressWithLabel value={100} label="Complete" variant="info" />
    </Stack>
  ),
};

// Step Progress
export const Steps = {
  render: () => {
    const steps = [
      { label: '1. Setup', completed: true },
      { label: '2. Config', completed: true },
      { label: '3. Deploy', completed: false },
      { label: '4. Live', completed: false },
    ];

    return (
      <StepProgress
        steps={steps}
        variant="primary"
        sx={{ mt: 2 }}
      />
    );
  },
};

// Buffered Progress
export const Buffered = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
          Video Buffering
        </Typography>
        <BufferedProgress value={30} buffer={60} variant="primary" />
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
          Download Progress
        </Typography>
        <BufferedProgress value={50} buffer={80} variant="info" />
      </Box>
    </Stack>
  ),
};

// Segmented Progress
export const Segmented = {
  render: () => {
    const segments = [
      { label: 'Complete', value: 40, color: '#4caf50' },
      { label: 'In Progress', value: 35, color: '#2196f3' },
      { label: 'Pending', value: 25, color: '#ff9800' },
    ];

    return (
      <SegmentedProgress
        segments={segments}
        variant="primary"
      />
    );
  },
};

// Different States
export const States = {
  render: () => (
    <ProgressWithStates />
  ),
};

// Interactive Progress
export const Interactive = {
  render: () => {
    const [value, setValue] = useState(50);

    return (
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
            Adjust Progress
          </Typography>
          <Slider
            value={value}
            onChange={(e, newValue) => setValue(newValue)}
            min={0}
            max={100}
            marks={[
              { value: 0, label: '0%' },
              { value: 50, label: '50%' },
              { value: 100, label: '100%' },
            ]}
          />
        </Box>

        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, color: 'var(--Text-Secondary)' }}>
              Linear Progress
            </Typography>
            <Progress value={value} variant="primary" />
          </Box>

          <Box>
            <Typography variant="body2" sx={{ mb: 1, color: 'var(--Text-Secondary)' }}>
              Circular Progress
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgressComponent value={value} variant="primary" size={80} />
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ mb: 1, color: 'var(--Text-Secondary)' }}>
              With Label
            </Typography>
            <ProgressWithLabel value={value} label="Download" variant="primary" />
          </Box>
        </Stack>
      </Stack>
    );
  },
};

// All Progress Types
export const AllTypes = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Linear Progress
        </Typography>
        <Progress value={60} variant="primary" />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Circular Progress
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgressComponent value={60} variant="primary" size={80} />
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          With Label
        </Typography>
        <ProgressWithLabel value={60} label="Loading" variant="primary" />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Buffered
        </Typography>
        <BufferedProgress value={40} buffer={70} variant="primary" />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Striped & Animated
        </Typography>
        <Progress value={60} striped animated variant="warning" />
      </Box>
    </Stack>
  ),
};

// Color Variants Demo
export const ColorVariantsDemo = {
  render: () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        Design System Color Variables
      </Typography>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Unfilled (All Variants):
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'var(--Text-Secondary)' }}>
            var(--Border-Variant)
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Filled - Primary:
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'var(--Text-Secondary)' }}>
            var(--Buttons-Primary-Button)
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Filled - Success/Warning/Error/Info:
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'var(--Text-Secondary)' }}>
            Semantic colors (solid colors, not CSS variables)
          </Typography>
        </Box>
      </Stack>

      <Typography variant="h6" sx={{ mt: 4, mb: 3, fontWeight: 700 }}>
        Examples
      </Typography>
      <AllVariantsProgress value={65} />
    </Paper>
  ),
};
