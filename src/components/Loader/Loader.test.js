// src/components/Loader/Loader.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Loader,
  LinearLoader,
  SkeletonLoader,
  DotsLoader,
  PageLoader,
  SkeletonCard,
  OverlayLoader,
} from './Loader';

describe('Loader Component', () => {
  test('renders Loader', () => {
    const { container } = render(<Loader />);
    expect(container).toBeInTheDocument();
  });

  test('displays default message', () => {
    render(<Loader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays custom message', () => {
    render(<Loader message="Please wait" />);
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });

  test('hides message when empty string', () => {
    const { container } = render(<Loader message="" />);
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  test('renders CircularProgress', () => {
    const { container } = render(<Loader />);
    const progress = container.querySelector('[role="progressbar"]');
    expect(progress).toBeInTheDocument();
  });
});

describe('LinearLoader Component', () => {
  test('renders LinearLoader', () => {
    const { container } = render(<LinearLoader />);
    expect(container).toBeInTheDocument();
  });

  test('displays indeterminate progress', () => {
    const { container } = render(<LinearLoader />);
    const progress = container.querySelector('[role="progressbar"]');
    expect(progress).toBeInTheDocument();
  });

  test('displays determinate progress with value', () => {
    render(<LinearLoader value={50} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  test('displays label', () => {
    render(<LinearLoader label="Loading file" value={75} />);
    expect(screen.getByText('Loading file')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });
});

describe('SkeletonLoader Component', () => {
  test('renders SkeletonLoader', () => {
    const { container } = render(<SkeletonLoader />);
    expect(container).toBeInTheDocument();
  });

  test('renders default number of rows', () => {
    const { container } = render(<SkeletonLoader />);
    const skeletons = container.querySelectorAll('[class*="MuiSkeleton"]');
    expect(skeletons.length).toBe(3);
  });

  test('renders custom number of rows', () => {
    const { container } = render(<SkeletonLoader rows={5} />);
    const skeletons = container.querySelectorAll('[class*="MuiSkeleton"]');
    expect(skeletons.length).toBe(5);
  });
});

describe('DotsLoader Component', () => {
  test('renders DotsLoader', () => {
    const { container } = render(<DotsLoader />);
    expect(container).toBeInTheDocument();
  });

  test('displays message', () => {
    render(<DotsLoader message="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders three dots', () => {
    const { container } = render(<DotsLoader />);
    const dots = container.querySelectorAll('[style*="animation"]');
    expect(dots.length).toBe(3);
  });
});

describe('PageLoader Component', () => {
  test('renders PageLoader', () => {
    const { container } = render(<PageLoader />);
    expect(container).toBeInTheDocument();
  });

  test('displays full height', () => {
    const { container } = render(<PageLoader />);
    const box = container.firstChild;
    expect(box).toHaveStyle('minHeight: 100vh');
  });

  test('displays message', () => {
    render(<PageLoader />);
    expect(screen.getByText('Loading page...')).toBeInTheDocument();
  });
});

describe('SkeletonCard Component', () => {
  test('renders SkeletonCard', () => {
    const { container } = render(<SkeletonCard />);
    expect(container).toBeInTheDocument();
  });

  test('displays image skeleton by default', () => {
    const { container } = render(<SkeletonCard />);
    const skeletons = container.querySelectorAll('[class*="MuiSkeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test('hides image skeleton when showImage is false', () => {
    const { container } = render(<SkeletonCard showImage={false} lines={2} />);
    const skeletons = container.querySelectorAll('[class*="MuiSkeleton"]');
    expect(skeletons.length).toBe(2);
  });

  test('renders custom number of lines', () => {
    const { container } = render(<SkeletonCard lines={5} />);
    const skeletons = container.querySelectorAll('[class*="MuiSkeleton"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(5);
  });
});

describe('OverlayLoader Component', () => {
  test('renders OverlayLoader', () => {
    const { container } = render(
      <OverlayLoader>
        <div>Content</div>
      </OverlayLoader>
    );
    expect(container).toBeInTheDocument();
  });

  test('displays children', () => {
    render(
      <OverlayLoader>
        <div>Test Content</div>
      </OverlayLoader>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('shows loader when isLoading is true', () => {
    render(
      <OverlayLoader isLoading={true}>
        <div>Content</div>
      </OverlayLoader>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('hides loader when isLoading is false', () => {
    const { queryByText } = render(
      <OverlayLoader isLoading={false}>
        <div>Content</div>
      </OverlayLoader>
    );
    expect(queryByText('Loading...')).not.toBeInTheDocument();
  });
});
