// src/components/Progress/Progress.js
import React from 'react';
import {
  LinearProgress,
  CircularProgress,
  Box,
  Stack,
  Typography,
  Paper,
} from '@mui/material';

/**
 * Progress Component Color Mapping
 * Maps variant names to color variables
 */
const colorVariants = {
  primary: {
    filledColor: 'var(--Buttons-Primary-Button)',
    emptyColor: 'var(--Border-Variant)',
  },
  secondary: {
    filledColor: '#9c27b0',
    emptyColor: 'var(--Border-Variant)',
  },
  tertiary: {
    filledColor: '#ff9800',
    emptyColor: 'var(--Border-Variant)',
  },
  neutral: {
    filledColor: 'var(--Text)',
    emptyColor: 'var(--Border-Variant)',
  },
  success: {
    filledColor: '#4caf50',
    emptyColor: 'var(--Border-Variant)',
  },
  warning: {
    filledColor: '#ff9800',
    emptyColor: 'var(--Border-Variant)',
  },
  error: {
    filledColor: '#f44336',
    emptyColor: 'var(--Border-Variant)',
  },
  info: {
    filledColor: '#2196f3',
    emptyColor: 'var(--Border-Variant)',
  },
};

/**
 * LinearProgress Component
 * Horizontal progress bar with color variants
 * 
 * @param {number} value - Progress value 0-100
 * @param {string} variant - Color variant: primary, secondary, tertiary, neutral, success, warning, error, info
 * @param {string} size - Bar size: small, medium, large
 * @param {boolean} indeterminate - Indeterminate progress
 * @param {boolean} striped - Add striped pattern
 * @param {boolean} animated - Animate progress
 * @param {object} props - Additional props
 */
export function Progress({
  value = 0,
  variant = 'primary',
  size = 'medium',
  indeterminate = false,
  striped = false,
  animated = true,
  sx = {},
  ...props
}) {
  const colors = colorVariants[variant] || colorVariants.primary;

  const sizeMap = {
    small: 4,
    medium: 8,
    large: 12,
  };

  const height = sizeMap[size];

  return (
    <LinearProgress
      variant={indeterminate ? 'indeterminate' : 'determinate'}
      value={indeterminate ? undefined : value}
      sx={{
        height,
        borderRadius: height / 2,
        backgroundColor: colors.emptyColor,
        transition: animated ? 'all 0.3s ease-in-out' : 'none',
        '& .MuiLinearProgress-bar': {
          backgroundColor: colors.filledColor,
          borderRadius: height / 2,
          backgroundImage: striped
            ? `linear-gradient(
                45deg,
                transparent 25%,
                rgba(255, 255, 255, 0.2) 25%,
                rgba(255, 255, 255, 0.2) 50%,
                transparent 50%,
                transparent 75%,
                rgba(255, 255, 255, 0.2) 75%,
                rgba(255, 255, 255, 0.2)
              )`
            : 'none',
          backgroundSize: striped ? '20px 20px' : 'auto',
          animation: striped && animated
            ? 'progress-stripes 1s linear infinite'
            : 'none',
          '@keyframes progress-stripes': {
            '0%': {
              backgroundPosition: '0 0',
            },
            '100%': {
              backgroundPosition: '20px 20px',
            },
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
}

/**
 * CircularProgress Component
 * Circular progress indicator with color variants
 * 
 * @param {number} value - Progress value 0-100
 * @param {string} variant - Color variant
 * @param {number} size - Diameter in pixels
 * @param {number} thickness - Stroke thickness
 * @param {boolean} indeterminate - Indeterminate progress
 * @param {object} props - Additional props
 */
export function CircularProgressComponent({
  value = 0,
  variant = 'primary',
  size = 40,
  thickness = 3.6,
  indeterminate = false,
  sx = {},
  ...props
}) {
  const colors = colorVariants[variant] || colorVariants.primary;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', ...sx }}>
      <CircularProgress
        variant={indeterminate ? 'indeterminate' : 'determinate'}
        value={indeterminate ? undefined : value}
        size={size}
        thickness={thickness}
        sx={{
          color: colors.filledColor,
          '& .MuiCircularProgress-track': {
            color: colors.emptyColor,
          },
        }}
        {...props}
      />
      {!indeterminate && (
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Typography
            variant="caption"
            component="div"
            sx={{ color: 'var(--Text)', fontWeight: 600 }}
          >
            {`${Math.round(value)}%`}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

/**
 * ProgressWithLabel Component
 * Linear progress with percentage label
 * 
 * @param {number} value - Progress value 0-100
 * @param {string} label - Progress label text
 * @param {string} variant - Color variant
 * @param {object} props - Additional props
 */
export function ProgressWithLabel({
  value = 0,
  label,
  variant = 'primary',
  sx = {},
  ...props
}) {
  const colors = colorVariants[variant] || colorVariants.primary;

  return (
    <Box sx={sx} {...props}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        {label && (
          <Typography variant="body2" sx={{ color: 'var(--Text)', fontWeight: 500 }}>
            {label}
          </Typography>
        )}
        <Typography variant="caption" sx={{ color: 'var(--Text-Secondary)' }}>
          {value}%
        </Typography>
      </Box>
      <Progress
        value={value}
        variant={variant}
        size="medium"
      />
    </Box>
  );
}

/**
 * StepProgress Component
 * Progress showing specific steps/milestones
 * 
 * @param {Array} steps - Array of step objects with label and completed
 * @param {string} variant - Color variant
 * @param {object} props - Additional props
 */
export function StepProgress({
  steps = [],
  variant = 'primary',
  sx = {},
  ...props
}) {
  const colors = colorVariants[variant] || colorVariants.primary;
  const completedSteps = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  const percentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <Box sx={sx} {...props}>
      <Stack spacing={2}>
        <Progress
          value={percentage}
          variant={variant}
          size="medium"
        />
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between' }}>
          {steps.map((step, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                padding: 1,
                backgroundColor: step.completed ? colors.filledColor : colors.emptyColor,
                borderRadius: 1,
                textAlign: 'center',
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: step.completed ? '#fff' : 'var(--Text-Secondary)',
                  fontWeight: 600,
                }}
              >
                {step.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

/**
 * BufferedProgress Component
 * Shows both buffered and progress values
 * 
 * @param {number} value - Actual progress value
 * @param {number} buffer - Buffered value
 * @param {string} variant - Color variant
 * @param {object} props - Additional props
 */
export function BufferedProgress({
  value = 0,
  buffer = 0,
  variant = 'primary',
  sx = {},
  ...props
}) {
  const colors = colorVariants[variant] || colorVariants.primary;

  return (
    <Box sx={sx} {...props}>
      <Box sx={{ position: 'relative', height: 8, borderRadius: 4, overflow: 'hidden' }}>
        {/* Background (empty) */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.emptyColor,
          }}
        />
        {/* Buffer layer */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${buffer}%`,
            backgroundColor: colors.filledColor,
            opacity: 0.3,
            transition: 'width 0.3s ease-in-out',
          }}
        />
        {/* Actual progress */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${value}%`,
            backgroundColor: colors.filledColor,
            transition: 'width 0.3s ease-in-out',
          }}
        />
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ color: 'var(--Text-Secondary)' }}>
          Progress: {value}%
        </Typography>
        <Typography variant="caption" sx={{ color: 'var(--Text-Secondary)' }}>
          Buffered: {buffer}%
        </Typography>
      </Stack>
    </Box>
  );
}

/**
 * SegmentedProgress Component
 * Progress divided into segments
 * 
 * @param {Array} segments - Array with value and label
 * @param {string} variant - Color variant
 * @param {object} props - Additional props
 */
export function SegmentedProgress({
  segments = [],
  variant = 'primary',
  sx = {},
  ...props
}) {
  const colors = colorVariants[variant] || colorVariants.primary;
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);

  return (
    <Box sx={sx} {...props}>
      <Stack direction="row" spacing={0.5} sx={{ height: 8, borderRadius: 4, overflow: 'hidden' }}>
        {segments.map((segment, index) => (
          <Box
            key={index}
            sx={{
              flex: segment.value,
              backgroundColor: segment.color || colors.filledColor,
              transition: 'all 0.3s ease-in-out',
            }}
          />
        ))}
      </Stack>
      <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap' }}>
        {segments.map((segment, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '2px',
                backgroundColor: segment.color || colors.filledColor,
              }}
            />
            <Typography variant="caption" sx={{ color: 'var(--Text-Secondary)' }}>
              {segment.label}: {segment.value}%
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

/**
 * AllVariantsProgress Component
 * Showcase of all color variants
 * 
 * @param {number} value - Progress value
 * @param {object} props - Additional props
 */
export function AllVariantsProgress({
  value = 65,
  sx = {},
  ...props
}) {
  const variants = ['primary', 'secondary', 'tertiary', 'neutral', 'success', 'warning', 'error', 'info'];

  return (
    <Stack spacing={3} sx={sx} {...props}>
      {variants.map(variant => (
        <Box key={variant}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--Text)', fontWeight: 600, textTransform: 'capitalize' }}>
            {variant}
          </Typography>
          <Progress value={value} variant={variant} size="medium" />
        </Box>
      ))}
    </Stack>
  );
}

/**
 * ProgressWithStates Component
 * Progress showing different states
 * 
 * @param {object} props - Additional props
 */
export function ProgressWithStates({
  sx = {},
  ...props
}) {
  return (
    <Stack spacing={3} sx={sx} {...props}>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--Text)', fontWeight: 600 }}>
          Determinate (0%)
        </Typography>
        <Progress value={0} variant="primary" size="medium" />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--Text)', fontWeight: 600 }}>
          Progress (50%)
        </Typography>
        <Progress value={50} variant="primary" size="medium" />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--Text)', fontWeight: 600 }}>
          Complete (100%)
        </Typography>
        <Progress value={100} variant="success" size="medium" />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--Text)', fontWeight: 600 }}>
          Indeterminate
        </Typography>
        <Progress indeterminate variant="primary" size="medium" />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'var(--Text)', fontWeight: 600 }}>
          Striped
        </Typography>
        <Progress value={70} variant="warning" striped size="medium" />
      </Box>
    </Stack>
  );
}

export default Progress;
