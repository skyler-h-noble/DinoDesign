// src/components/Loader/Loader.js
import React from 'react';
import {
  CircularProgress,
  LinearProgress,
  Box,
  Stack,
  Typography,
  Skeleton,
  Paper,
} from '@mui/material';

/**
 * Loader Component
 * Circular progress indicator with optional message
 * 
 * @param {number} size - Loader size in pixels (default: 40)
 * @param {string} message - Loading message text
 * @param {object} props - Additional props
 */
export function Loader({
  size = 40,
  message = 'Loading...',
  sx = {},
  ...props
}) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{
        py: 4,
        ...sx,
      }}
      {...props}
    >
      <CircularProgress
        size={size}
        sx={{
          color: 'var(--Primary-Color-11)',
        }}
      />
      {message && (
        <Typography
          sx={{
            color: 'var(--Text-Secondary)',
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      )}
    </Stack>
  );
}

/**
 * LinearLoader Component
 * Linear progress bar
 * 
 * @param {number} value - Progress value 0-100
 * @param {string} label - Optional label
 * @param {object} props - Additional props
 */
export function LinearLoader({
  value,
  label,
  sx = {},
  ...props
}) {
  return (
    <Stack spacing={1} sx={{ ...sx }} {...props}>
      {label && (
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'var(--Text)', fontWeight: 500 }}>
            {label}
          </Typography>
          {value !== undefined && (
            <Typography variant="caption" sx={{ color: 'var(--Text-Secondary)' }}>
              {value}%
            </Typography>
          )}
        </Stack>
      )}
      <LinearProgress
        variant={value !== undefined ? 'determinate' : 'indeterminate'}
        value={value}
        sx={{
          backgroundColor: 'var(--Border-Variant)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'var(--Primary-Color-11)',
          },
          height: 4,
          borderRadius: 2,
        }}
      />
    </Stack>
  );
}

/**
 * SkeletonLoader Component
 * Skeleton placeholder for loading content
 * 
 * @param {number} rows - Number of skeleton rows
 * @param {number} height - Height of each skeleton
 * @param {object} props - Additional props
 */
export function SkeletonLoader({
  rows = 3,
  height = 100,
  spacing = 2,
  sx = {},
  ...props
}) {
  return (
    <Stack spacing={spacing} sx={{ ...sx }} {...props}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          height={height}
          sx={{
            backgroundColor: 'var(--Container-Low)',
            borderRadius: '8px',
          }}
        />
      ))}
    </Stack>
  );
}

/**
 * DotsLoader Component
 * Animated dots loader
 * 
 * @param {string} message - Loading message
 * @param {object} props - Additional props
 */
export function DotsLoader({
  message = 'Loading',
  sx = {},
  ...props
}) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{
        py: 4,
        ...sx,
      }}
      {...props}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1,
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'var(--Primary-Color-11)',
              animation: `pulse 1.4s infinite`,
              animationDelay: `${i * 0.2}s`,
              '@keyframes pulse': {
                '0%': {
                  opacity: 1,
                },
                '50%': {
                  opacity: 0.5,
                },
                '100%': {
                  opacity: 1,
                },
              },
            }}
          />
        ))}
      </Box>
      {message && (
        <Typography
          sx={{
            color: 'var(--Text-Secondary)',
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      )}
    </Stack>
  );
}

/**
 * PageLoader Component
 * Full page loader overlay
 * 
 * @param {string} message - Loading message
 * @param {number} size - Loader size
 * @param {object} props - Additional props
 */
export function PageLoader({
  message = 'Loading page...',
  size = 60,
  sx = {},
  ...props
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--Background)',
        ...sx,
      }}
      {...props}
    >
      <Loader size={size} message={message} />
    </Box>
  );
}

/**
 * SkeletonCard Component
 * Skeleton loading state for cards
 * 
 * @param {number} lines - Number of text lines
 * @param {boolean} showImage - Show image skeleton
 * @param {object} props - Additional props
 */
export function SkeletonCard({
  lines = 3,
  showImage = true,
  sx = {},
  ...props
}) {
  return (
    <Paper
      sx={{
        p: 2,
        backgroundColor: 'var(--Container)',
        ...sx,
      }}
      {...props}
    >
      <Stack spacing={2}>
        {showImage && (
          <Skeleton
            variant="rectangular"
            height={200}
            sx={{
              backgroundColor: 'var(--Container-Low)',
              borderRadius: 1,
            }}
          />
        )}
        <Stack spacing={1}>
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              height={i === 0 ? 24 : 16}
              sx={{
                backgroundColor: 'var(--Container-Low)',
              }}
            />
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}

/**
 * OverlayLoader Component
 * Loader overlay for async operations
 * 
 * @param {boolean} isLoading - Show loader
 * @param {string} message - Loading message
 * @param {ReactNode} children - Content to overlay
 * @param {object} props - Additional props
 */
export function OverlayLoader({
  isLoading = false,
  message = 'Loading...',
  children,
  sx = {},
  ...props
}) {
  return (
    <Box
      sx={{
        position: 'relative',
        ...sx,
      }}
      {...props}
    >
      {children}
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'inherit',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
        >
          <Loader size={40} message={message} />
        </Box>
      )}
    </Box>
  );
}

export default Loader;
