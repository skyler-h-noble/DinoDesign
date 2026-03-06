// src/components/Skeleton/Skeleton.js
import React from 'react';
import {
  Skeleton as MuiSkeleton,
  Stack,
  Box,
  Card,
  Typography,
  Avatar,
  Grid,
} from '@mui/material';

/**
 * Skeleton Component
 * Loading placeholder with multiple variants
 * 
 * Design System Integration:
 * - Background: var(--Border-Variant) (lighter, unloaded state)
 * - Animation: Subtle shimmer effect
 * - Border Radius: Matches component type
 * 
 * WCAG 2.1 Accessibility:
 * - Proper aria-busy attribute
 * - Loading state indication
 * - Accessible structure
 * 
 * @param {number} count - Number of skeletons to render
 * @param {number|string} height - Height of skeleton
 * @param {string} variant - Skeleton variant: 'rectangular' | 'circular' | 'text'
 * @param {object} props - Additional props
 */
export function Skeleton({
  count = 1,
  height = 40,
  variant = 'rectangular',
  spacing = 1,
  sx = {},
  ...props
}) {
  return (
    <Stack spacing={spacing}>
      {Array.from({ length: count }).map((_, i) => (
        <MuiSkeleton
          key={i}
          variant={variant}
          height={height}
          aria-busy="true"
          aria-label="Loading content"
          sx={{
            backgroundColor: 'var(--Border-Variant)',
            borderRadius: variant === 'circular' ? '50%' : '4px',
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': {
                opacity: 0.6,
              },
              '50%': {
                opacity: 1,
              },
              '100%': {
                opacity: 0.6,
              },
            },
            ...sx,
          }}
          {...props}
        />
      ))}
    </Stack>
  );
}

/**
 * TextSkeleton Component
 * Multiple line text loading skeleton
 * 
 * @param {number} lines - Number of text lines
 * @param {object} props - Additional props
 */
export function TextSkeleton({
  lines = 3,
  spacing = 0.5,
  lastLineWidth = '80%',
  sx = {},
  ...props
}) {
  return (
    <Stack spacing={spacing}>
      {Array.from({ length: lines }).map((_, i) => (
        <MuiSkeleton
          key={i}
          variant="text"
          height={20}
          aria-busy="true"
          sx={{
            backgroundColor: 'var(--Border-Variant)',
            borderRadius: '4px',
            width: i === lines - 1 ? lastLineWidth : '100%',
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.6 },
              '50%': { opacity: 1 },
            },
            ...sx,
          }}
          {...props}
        />
      ))}
    </Stack>
  );
}

/**
 * AvatarSkeleton Component
 * Avatar loading placeholder
 * 
 * @param {number} size - Avatar size in pixels
 * @param {object} props - Additional props
 */
export function AvatarSkeleton({
  size = 40,
  sx = {},
  ...props
}) {
  return (
    <MuiSkeleton
      variant="circular"
      width={size}
      height={size}
      aria-busy="true"
      aria-label="Loading avatar"
      sx={{
        backgroundColor: 'var(--Border-Variant)',
        animation: 'pulse 1.5s ease-in-out infinite',
        '@keyframes pulse': {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
        ...sx,
      }}
      {...props}
    />
  );
}

/**
 * CardSkeleton Component
 * Card loading placeholder
 * 
 * @param {object} props - Additional props
 */
export function CardSkeleton({
  withImage = true,
  withText = true,
  lines = 3,
  sx = {},
  ...props
}) {
  return (
    <Card
      sx={{
        backgroundColor: 'var(--Container)',
        p: 2,
        ...sx,
      }}
      {...props}
    >
      {withImage && (
        <MuiSkeleton
          variant="rectangular"
          height={200}
          sx={{
            backgroundColor: 'var(--Border-Variant)',
            borderRadius: 1,
            mb: 2,
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.6 },
              '50%': { opacity: 1 },
            },
          }}
        />
      )}

      {withText && (
        <Stack spacing={1}>
          <MuiSkeleton
            variant="text"
            height={24}
            width="80%"
            sx={{
              backgroundColor: 'var(--Border-Variant)',
              borderRadius: '4px',
              animation: 'pulse 1.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 0.6 },
                '50%': { opacity: 1 },
              },
            }}
          />
          {Array.from({ length: lines }).map((_, i) => (
            <MuiSkeleton
              key={i}
              variant="text"
              height={16}
              width={i === lines - 1 ? '60%' : '100%'}
              sx={{
                backgroundColor: 'var(--Border-Variant)',
                borderRadius: '4px',
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 0.6 },
                  '50%': { opacity: 1 },
                },
              }}
            />
          ))}
        </Stack>
      )}
    </Card>
  );
}

/**
 * ListSkeleton Component
 * List item loading skeleton
 * 
 * @param {number} count - Number of list items
 * @param {boolean} withAvatar - Include avatar placeholder
 * @param {object} props - Additional props
 */
export function ListSkeleton({
  count = 5,
  withAvatar = true,
  withText = true,
  sx = {},
  ...props
}) {
  return (
    <Stack spacing={2} sx={sx} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'flex-start',
          }}
        >
          {withAvatar && (
            <MuiSkeleton
              variant="circular"
              width={40}
              height={40}
              sx={{
                backgroundColor: 'var(--Border-Variant)',
                flexShrink: 0,
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 0.6 },
                  '50%': { opacity: 1 },
                },
              }}
            />
          )}
          {withText && (
            <Stack spacing={1} sx={{ flex: 1 }}>
              <MuiSkeleton
                variant="text"
                height={20}
                width="60%"
                sx={{
                  backgroundColor: 'var(--Border-Variant)',
                  borderRadius: '4px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 0.6 },
                    '50%': { opacity: 1 },
                  },
                }}
              />
              <MuiSkeleton
                variant="text"
                height={16}
                width="90%"
                sx={{
                  backgroundColor: 'var(--Border-Variant)',
                  borderRadius: '4px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 0.6 },
                    '50%': { opacity: 1 },
                  },
                }}
              />
            </Stack>
          )}
        </Box>
      ))}
    </Stack>
  );
}

/**
 * TableSkeleton Component
 * Table row loading skeleton
 * 
 * @param {number} rows - Number of rows
 * @param {number} columns - Number of columns
 * @param {object} props - Additional props
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  sx = {},
  ...props
}) {
  return (
    <Box sx={sx} {...props}>
      <Stack spacing={1}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: 1,
            }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <MuiSkeleton
                key={colIndex}
                variant="text"
                height={40}
                sx={{
                  backgroundColor: 'var(--Border-Variant)',
                  borderRadius: '4px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 0.6 },
                    '50%': { opacity: 1 },
                  },
                }}
              />
            ))}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

/**
 * ProfileSkeleton Component
 * Profile page loading skeleton
 * 
 * @param {object} props - Additional props
 */
export function ProfileSkeleton({
  sx = {},
  ...props
}) {
  return (
    <Stack spacing={3} sx={sx} {...props}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <MuiSkeleton
          variant="circular"
          width={80}
          height={80}
          sx={{
            backgroundColor: 'var(--Border-Variant)',
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.6 },
              '50%': { opacity: 1 },
            },
          }}
        />
        <Stack spacing={1} sx={{ flex: 1 }}>
          <MuiSkeleton
            variant="text"
            height={28}
            width="40%"
            sx={{
              backgroundColor: 'var(--Border-Variant)',
              borderRadius: '4px',
              animation: 'pulse 1.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 0.6 },
                '50%': { opacity: 1 },
              },
            }}
          />
          <MuiSkeleton
            variant="text"
            height={16}
            width="60%"
            sx={{
              backgroundColor: 'var(--Border-Variant)',
              borderRadius: '4px',
              animation: 'pulse 1.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 0.6 },
                '50%': { opacity: 1 },
              },
            }}
          />
        </Stack>
      </Box>

      {/* Content */}
      <Stack spacing={2}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Box key={i}>
            <MuiSkeleton
              variant="text"
              height={20}
              width="30%"
              sx={{
                backgroundColor: 'var(--Border-Variant)',
                borderRadius: '4px',
                mb: 1,
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 0.6 },
                  '50%': { opacity: 1 },
                },
              }}
            />
            {Array.from({ length: 2 }).map((_, j) => (
              <MuiSkeleton
                key={j}
                variant="text"
                height={16}
                sx={{
                  backgroundColor: 'var(--Border-Variant)',
                  borderRadius: '4px',
                  mb: j === 0 ? 0.5 : 0,
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 0.6 },
                    '50%': { opacity: 1 },
                  },
                }}
              />
            ))}
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}

/**
 * GridSkeleton Component
 * Grid of skeleton items
 * 
 * @param {number} count - Number of items
 * @param {number} columns - Number of columns
 * @param {object} props - Additional props
 */
export function GridSkeleton({
  count = 6,
  columns = 3,
  spacing = 2,
  sx = {},
  ...props
}) {
  return (
    <Grid
      container
      spacing={spacing}
      sx={sx}
      {...props}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Grid item xs={12 / columns} key={i}>
          <MuiSkeleton
            variant="rectangular"
            height={200}
            sx={{
              backgroundColor: 'var(--Border-Variant)',
              borderRadius: 1,
              animation: 'pulse 1.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 0.6 },
                '50%': { opacity: 1 },
              },
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

/**
 * SkeletonGroup Component
 * Group multiple skeleton types together
 * 
 * @param {string} type - Group type: 'card' | 'list' | 'profile' | 'table'
 * @param {number} count - Number of items (for list/table)
 * @param {object} props - Additional props
 */
export function SkeletonGroup({
  type = 'card',
  count = 3,
  sx = {},
  ...props
}) {
  switch (type) {
    case 'list':
      return <ListSkeleton count={count} sx={sx} {...props} />;
    case 'profile':
      return <ProfileSkeleton sx={sx} {...props} />;
    case 'table':
      return <TableSkeleton rows={count} sx={sx} {...props} />;
    case 'card':
    default:
      return (
        <Stack spacing={2} sx={sx} {...props}>
          {Array.from({ length: count }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </Stack>
      );
  }
}

/**
 * PulsingBadgeSkeleton Component
 * Badge/chip loading skeleton
 * 
 * @param {number} count - Number of badges
 * @param {object} props - Additional props
 */
export function PulsingBadgeSkeleton({
  count = 3,
  sx = {},
  ...props
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
        ...sx,
      }}
      {...props}
    >
      {Array.from({ length: count }).map((_, i) => (
        <MuiSkeleton
          key={i}
          variant="rectangular"
          width={80}
          height={32}
          sx={{
            backgroundColor: 'var(--Border-Variant)',
            borderRadius: 2,
            animation: 'pulse 1.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.6 },
              '50%': { opacity: 1 },
            },
          }}
        />
      ))}
    </Box>
  );
}

export default Skeleton;
