// src/components/Paper/Paper.stories.js
import {
  Paper,
  InteractivePaper,
  ElevatedPaper,
  OutlinedPaper,
  CardPaper,
  NestedPaper,
  TieredPaper,
  ResponsivePaper,
  FloatingPaper,
} from './Paper';
import { Stack, Box, Typography } from '@mui/material';

export default {
  title: 'Surfaces/Paper',
  component: Paper,
};

// All Elevation Levels
export const AllElevations = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          All 5 Elevation Levels
        </Typography>
        <TieredPaper />
      </Box>
      <Typography variant="body2" sx={{ color: 'var(--Text-Secondary)', mt: 2 }}>
        These papers demonstrate all 5 elevation levels with their data-surface attributes.
        The styling is applied via CSS variables based on the data-surface attribute.
      </Typography>
    </Stack>
  ),
};

// Basic Paper
export const Basic = {
  render: () => (
    <Paper>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Basic Paper
      </Typography>
      <Typography>
        This is a basic paper component with Container elevation level.
      </Typography>
    </Paper>
  ),
};

// Different Surface Levels
export const SurfaceLevels = {
  render: () => (
    <Stack spacing={3}>
      {['Container-Lowest', 'Container-Low', 'Container', 'Container-High', 'Container-Highest'].map((surface) => (
        <Paper key={surface} surface={surface}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            {surface}
          </Typography>
          <Typography variant="body2">
            This paper has data-surface="{surface}" applied for styling.
          </Typography>
        </Paper>
      ))}
    </Stack>
  ),
};

// Outlined Paper
export const Outlined = {
  render: () => (
    <OutlinedPaper>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Outlined Paper
      </Typography>
      <Typography>
        This paper uses the outlined variant with no elevation/shadow.
      </Typography>
    </OutlinedPaper>
  ),
};

// Elevated Paper
export const Elevated = {
  render: () => (
    <Stack spacing={3}>
      <ElevatedPaper surface="Container-Low">
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Low Elevation
        </Typography>
      </ElevatedPaper>
      <ElevatedPaper surface="Container-High">
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          High Elevation
        </Typography>
      </ElevatedPaper>
      <ElevatedPaper surface="Container-Highest">
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Highest Elevation
        </Typography>
      </ElevatedPaper>
    </Stack>
  ),
};

// Card Paper
export const Card = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
          Different Padding Sizes
        </Typography>
      </Box>
      <CardPaper padding="small">
        <Typography variant="body2">Small Padding</Typography>
      </CardPaper>
      <CardPaper padding="medium">
        <Typography variant="body2">Medium Padding</Typography>
      </CardPaper>
      <CardPaper padding="large">
        <Typography variant="body2">Large Padding</Typography>
      </CardPaper>
    </Stack>
  ),
};

// Interactive Paper
export const Interactive = {
  render: () => (
    <InteractivePaper
      surface="Container"
      onClick={() => console.log('Paper clicked')}
      hoverable={true}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Interactive Paper
      </Typography>
      <Typography>
        Hover over or click this paper. It elevates on hover and is clickable.
      </Typography>
    </InteractivePaper>
  ),
};

// Nested Paper
export const Nested = {
  render: () => (
    <NestedPaper
      outerSurface="Container-Low"
      innerSurface="Container-High"
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Nested Layers
      </Typography>
      <Typography>
        Outer surface: Container-Low | Inner surface: Container-High
      </Typography>
    </NestedPaper>
  ),
};

// Responsive Paper
export const Responsive = {
  render: () => (
    <ResponsivePaper
      mobileSurface="Container-Low"
      tabletSurface="Container"
      desktopSurface="Container-High"
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Responsive Paper
      </Typography>
      <Typography variant="body2">
        Resize your browser to see elevation change:
      </Typography>
      <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
        • Mobile: Container-Low
      </Typography>
      <Typography variant="caption" sx={{ display: 'block' }}>
        • Tablet: Container
      </Typography>
      <Typography variant="caption" sx={{ display: 'block' }}>
        • Desktop: Container-High
      </Typography>
    </ResponsivePaper>
  ),
};

// Floating Paper
export const Floating = {
  render: () => (
    <Box sx={{ position: 'relative', minHeight: 200 }}>
      <FloatingPaper>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Floating Paper
        </Typography>
        <Typography>
          This paper uses the highest elevation (Container-Highest) and appears to float.
        </Typography>
      </FloatingPaper>
    </Box>
  ),
};

// Data-Surface Attribute Demo
export const DataSurfaceDemo = {
  render: () => (
    <Stack spacing={4}>
      <Box sx={{ p: 3, backgroundColor: 'var(--Container-Low)', borderRadius: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Data-Surface Attribute
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          The data-surface attribute is used to apply CSS variable-based styling.
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              5 Available Levels:
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              • data-surface="Container-Lowest" - No shadow (0dp)
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              • data-surface="Container-Low" - Subtle shadow (1dp)
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              • data-surface="Container" - Standard shadow (4dp)
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              • data-surface="Container-High" - Elevated shadow (8dp)
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              • data-surface="Container-Highest" - Maximum shadow (12dp)
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
          Example Usage:
        </Typography>
        <Box
          sx={{
            p: 2,
            backgroundColor: 'var(--Background)',
            borderRadius: 1,
            border: '1px solid var(--Border)',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            overflow: 'auto',
          }}
        >
{`<Paper surface="Container-High">
  <Typography>Content</Typography>
</Paper>`}
        </Box>
      </Box>
    </Stack>
  ),
};

// Hook Usage Demo
export const HookUsage = {
  render: () => (
    <Stack spacing={3}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        usePaperSurface Hook
      </Typography>
      <Paper surface="Container">
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
          The usePaperSurface hook provides:
        </Typography>
        <Box component="ul" sx={{ ml: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <code>dataSurface</code> - The surface level string
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <code>elevation</code> - MUI elevation value (0, 1, 4, 8, 12)
          </Typography>
          <Typography component="li" variant="body2">
            <code>zIndex</code> - Stacking context value
          </Typography>
        </Box>
      </Paper>
      <Paper surface="Container-Low">
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
          Example:
        </Typography>
        <Box
          sx={{
            p: 2,
            backgroundColor: 'var(--Background)',
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            overflow: 'auto',
          }}
        >
{`const config = usePaperSurface('Container-High');
// Returns:
// {
//   dataSurface: 'Container-High',
//   elevation: 8,
//   zIndex: 300
// }`}
        </Box>
      </Paper>
    </Stack>
  ),
};
