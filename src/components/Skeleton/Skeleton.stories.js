// src/components/Skeleton/Skeleton.stories.js
import {
  Skeleton,
  TextSkeleton,
  AvatarSkeleton,
  CardSkeleton,
  ListSkeleton,
  TableSkeleton,
  ProfileSkeleton,
  GridSkeleton,
  SkeletonGroup,
  PulsingBadgeSkeleton,
} from './Skeleton';
import { Box, Stack, Typography, Paper } from '@mui/material';

export default {
  title: 'Feedback/Skeleton',
  component: Skeleton,
};

// Basic Skeleton
export const Basic = {
  render: () => (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Basic Skeleton
      </Typography>
      <Skeleton count={3} height={60} />
    </Box>
  ),
};

// Skeleton Variants
export const Variants = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Rectangular
        </Typography>
        <Skeleton variant="rectangular" height={100} />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Circular
        </Typography>
        <Skeleton variant="circular" height={100} width={100} />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Text
        </Typography>
        <Skeleton variant="text" height={20} count={3} spacing={0.5} />
      </Box>
    </Stack>
  ),
};

// Text Skeleton
export const TextLoading = {
  render: () => (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Text Skeleton
      </Typography>
      <TextSkeleton lines={5} spacing={0.5} />
    </Box>
  ),
};

// Avatar Skeleton
export const Avatars = {
  render: () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Avatar Skeleton Sizes
      </Typography>
      <Stack direction="row" spacing={3}>
        <AvatarSkeleton size={40} />
        <AvatarSkeleton size={60} />
        <AvatarSkeleton size={80} />
        <AvatarSkeleton size={120} />
      </Stack>
    </Box>
  ),
};

// Card Skeleton
export const Cards = {
  render: () => (
    <Box sx={{ maxWidth: 800 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Card Skeleton
      </Typography>
      <Stack spacing={2}>
        <CardSkeleton withImage={true} lines={3} />
        <CardSkeleton withImage={false} lines={2} />
      </Stack>
    </Box>
  ),
};

// List Skeleton
export const Lists = {
  render: () => (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        List Skeleton
      </Typography>
      <ListSkeleton count={4} withAvatar={true} />
    </Box>
  ),
};

// Table Skeleton
export const Tables = {
  render: () => (
    <Box sx={{ maxWidth: 900 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Table Skeleton
      </Typography>
      <TableSkeleton rows={5} columns={4} />
    </Box>
  ),
};

// Profile Skeleton
export const Profile = {
  render: () => (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Profile Skeleton
      </Typography>
      <ProfileSkeleton />
    </Box>
  ),
};

// Grid Skeleton
export const Grid = {
  render: () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Grid Skeleton
      </Typography>
      <GridSkeleton count={6} columns={3} spacing={2} />
    </Box>
  ),
};

// Badge Skeleton
export const Badges = {
  render: () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Badge/Chip Skeleton
      </Typography>
      <PulsingBadgeSkeleton count={5} />
    </Box>
  ),
};

// Skeleton Groups
export const SkeletonGroups = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Card Group
        </Typography>
        <SkeletonGroup type="card" count={2} />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          List Group
        </Typography>
        <SkeletonGroup type="list" count={3} />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Profile Group
        </Typography>
        <SkeletonGroup type="profile" />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Table Group
        </Typography>
        <SkeletonGroup type="table" count={4} />
      </Box>
    </Stack>
  ),
};

// Design System Demo
export const DesignSystemDemo = {
  render: () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        Skeleton Design System Styling
      </Typography>

      <Stack spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Background Color:
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'var(--Text-Secondary)', ml: 2 }}>
            var(--Border-Variant)
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Animation:
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'var(--Text-Secondary)', ml: 2 }}>
            Pulse animation 1.5s ease-in-out
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'var(--Text-Secondary)', ml: 2 }}>
            Opacity: 0.6 → 1.0 → 0.6
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Accessibility:
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'var(--Text-Secondary)', ml: 2 }}>
            aria-busy="true"
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: 'var(--Text-Secondary)', ml: 2 }}>
            aria-label="Loading content"
          </Typography>
        </Box>
      </Stack>

      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
        Example - Text Loading:
      </Typography>
      <TextSkeleton lines={4} />
    </Paper>
  ),
};

// All Variants
export const AllVariants = {
  render: () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Basic Skeleton
        </Typography>
        <Skeleton count={2} height={50} />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Text Skeleton
        </Typography>
        <TextSkeleton lines={3} />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Avatar Skeleton
        </Typography>
        <AvatarSkeleton size={60} />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Card Skeleton
        </Typography>
        <CardSkeleton />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          List Skeleton
        </Typography>
        <ListSkeleton count={3} />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Table Skeleton
        </Typography>
        <TableSkeleton rows={3} columns={3} />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Profile Skeleton
        </Typography>
        <ProfileSkeleton />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Grid Skeleton
        </Typography>
        <GridSkeleton count={6} columns={2} />
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Badge Skeleton
        </Typography>
        <PulsingBadgeSkeleton count={4} />
      </Box>
    </Stack>
  ),
};

// Real-world Example
export const RealWorldExample = {
  render: () => (
    <Stack spacing={3}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Real-world Loading States
      </Typography>

      {/* Feed Loading */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Social Feed Loading
        </Typography>
        <Stack spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Box key={i}>
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <AvatarSkeleton size={40} />
                <Stack spacing={0.5} sx={{ flex: 1 }}>
                  <Skeleton variant="text" height={16} width="40%" />
                  <Skeleton variant="text" height={14} width="60%" />
                </Stack>
              </Box>
              <Skeleton variant="rectangular" height={200} />
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Product Grid Loading */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Product Grid Loading
        </Typography>
        <GridSkeleton count={6} columns={2} spacing={2} />
      </Box>

      {/* User List Loading */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          User List Loading
        </Typography>
        <ListSkeleton count={5} />
      </Box>
    </Stack>
  ),
};
