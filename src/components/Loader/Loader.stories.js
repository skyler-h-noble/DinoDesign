// src/components/Loader/Loader.stories.js
import {
  Loader,
  LinearLoader,
  SkeletonLoader,
  DotsLoader,
  PageLoader,
  SkeletonCard,
  OverlayLoader,
} from './Loader';
import { Stack, Paper, Button } from '@mui/material';
import { useState } from 'react';

export default {
  title: 'Feedback/Loader',
  component: Loader,
};

// Basic Loader
export const Basic = {
  render: () => <Loader />,
};

// Loader with Custom Message
export const WithMessage = {
  render: () => <Loader message="Fetching your data..." />,
};

// Loader Different Sizes
export const Sizes = {
  render: () => (
    <Stack spacing={3}>
      <div>
        <h4>Small (30px)</h4>
        <Loader size={30} message="Small" />
      </div>
      <div>
        <h4>Medium (50px)</h4>
        <Loader size={50} message="Medium" />
      </div>
      <div>
        <h4>Large (80px)</h4>
        <Loader size={80} message="Large" />
      </div>
    </Stack>
  ),
};

// Linear Loader - Indeterminate
export const LinearIndeterminate = {
  render: () => (
    <Stack spacing={2}>
      <LinearLoader label="Uploading file..." />
    </Stack>
  ),
};

// Linear Loader - Determinate
export const LinearDeterminate = {
  render: () => (
    <Stack spacing={3}>
      <LinearLoader label="Installation" value={25} />
      <LinearLoader label="Download" value={50} />
      <LinearLoader label="Processing" value={75} />
      <LinearLoader label="Complete" value={100} />
    </Stack>
  ),
};

// Skeleton Loader
export const Skeleton = {
  render: () => (
    <Stack spacing={2}>
      <div>
        <h4>3 rows</h4>
        <SkeletonLoader rows={3} height={60} />
      </div>
      <div>
        <h4>5 rows with larger height</h4>
        <SkeletonLoader rows={5} height={100} />
      </div>
    </Stack>
  ),
};

// Dots Loader
export const Dots = {
  render: () => (
    <Stack spacing={3}>
      <DotsLoader message="Loading..." />
      <DotsLoader message="Please wait..." />
    </Stack>
  ),
};

// Page Loader
export const FullPage = {
  render: () => <PageLoader />,
};

// Skeleton Card
export const SkeletonCardStory = {
  render: () => (
    <Stack spacing={3}>
      <div>
        <h4>With Image</h4>
        <SkeletonCard lines={3} showImage={true} />
      </div>
      <div>
        <h4>Without Image</h4>
        <SkeletonCard lines={3} showImage={false} />
      </div>
    </Stack>
  ),
};

// Overlay Loader
export const Overlay = {
  render: () => {
    const [isLoading, setIsLoading] = useState(false);
    return (
      <Stack spacing={2}>
        <Button
          variant="contained"
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 3000);
          }}
        >
          Start Loading
        </Button>
        <OverlayLoader isLoading={isLoading} message="Processing...">
          <Paper sx={{ p: 3, minHeight: 200 }}>
            <div>
              This content will be overlaid with a loader when isLoading is true
            </div>
          </Paper>
        </OverlayLoader>
      </Stack>
    );
  },
};

// All Loaders Together
export const AllTypes = {
  render: () => (
    <Stack spacing={4}>
      <div>
        <h3>Circular Loader</h3>
        <Loader size={50} message="Loading..." />
      </div>

      <div>
        <h3>Linear Loader</h3>
        <LinearLoader label="Upload Progress" value={60} />
      </div>

      <div>
        <h3>Skeleton Loader</h3>
        <SkeletonLoader rows={2} height={80} />
      </div>

      <div>
        <h3>Dots Loader</h3>
        <DotsLoader message="Syncing..." />
      </div>

      <div>
        <h3>Skeleton Card</h3>
        <SkeletonCard lines={3} showImage={true} />
      </div>
    </Stack>
  ),
};
