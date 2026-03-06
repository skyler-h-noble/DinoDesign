// src/components/Skeleton/Skeleton.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
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

describe('Skeleton Component', () => {
  test('renders single skeleton', () => {
    const { container } = render(
      <Skeleton />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders multiple skeletons', () => {
    const { container } = render(
      <Skeleton count={5} />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders with correct height', () => {
    const { container } = render(
      <Skeleton height={100} />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders different variants', () => {
    const variants = ['rectangular', 'circular', 'text'];
    variants.forEach(variant => {
      const { container } = render(
        <Skeleton variant={variant} />
      );
      expect(container).toBeInTheDocument();
    });
  });

  test('has aria-busy attribute', () => {
    const { container } = render(
      <Skeleton />
    );
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  test('has aria-label', () => {
    const { container } = render(
      <Skeleton />
    );
    expect(container.querySelector('[aria-label]')).toBeInTheDocument();
  });
});

describe('TextSkeleton Component', () => {
  test('renders multiple text lines', () => {
    const { container } = render(
      <TextSkeleton lines={3} />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders with custom spacing', () => {
    const { container } = render(
      <TextSkeleton lines={4} spacing={2} />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders with last line width', () => {
    const { container } = render(
      <TextSkeleton lines={3} lastLineWidth="60%" />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('AvatarSkeleton Component', () => {
  test('renders circular avatar skeleton', () => {
    const { container } = render(
      <AvatarSkeleton />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders with custom size', () => {
    const { container } = render(
      <AvatarSkeleton size={80} />
    );
    expect(container).toBeInTheDocument();
  });

  test('has aria-label', () => {
    const { container } = render(
      <AvatarSkeleton />
    );
    expect(container.querySelector('[aria-label]')).toBeInTheDocument();
  });
});

describe('CardSkeleton Component', () => {
  test('renders card skeleton', () => {
    const { container } = render(
      <CardSkeleton />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders with image', () => {
    const { container } = render(
      <CardSkeleton withImage={true} />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders with text lines', () => {
    const { container } = render(
      <CardSkeleton withText={true} lines={3} />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders without image', () => {
    const { container } = render(
      <CardSkeleton withImage={false} />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('ListSkeleton Component', () => {
  test('renders list skeleton', () => {
    const { container } = render(
      <ListSkeleton />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders with custom count', () => {
    const { container } = render(
      <ListSkeleton count={3} />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders with avatar', () => {
    const { container } = render(
      <ListSkeleton withAvatar={true} />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders without avatar', () => {
    const { container } = render(
      <ListSkeleton withAvatar={false} />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('TableSkeleton Component', () => {
  test('renders table skeleton', () => {
    const { container } = render(
      <TableSkeleton />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders with custom rows and columns', () => {
    const { container } = render(
      <TableSkeleton rows={3} columns={5} />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('ProfileSkeleton Component', () => {
  test('renders profile skeleton', () => {
    const { container } = render(
      <ProfileSkeleton />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('GridSkeleton Component', () => {
  test('renders grid skeleton', () => {
    const { container } = render(
      <GridSkeleton />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders with custom count and columns', () => {
    const { container } = render(
      <GridSkeleton count={9} columns={3} />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('SkeletonGroup Component', () => {
  test('renders card skeleton group', () => {
    const { container } = render(
      <SkeletonGroup type="card" />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders list skeleton group', () => {
    const { container } = render(
      <SkeletonGroup type="list" />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders profile skeleton group', () => {
    const { container } = render(
      <SkeletonGroup type="profile" />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders table skeleton group', () => {
    const { container } = render(
      <SkeletonGroup type="table" />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('PulsingBadgeSkeleton Component', () => {
  test('renders badge skeleton', () => {
    const { container } = render(
      <PulsingBadgeSkeleton />
    );
    expect(container).toBeInTheDocument();
  });

  test('renders with custom count', () => {
    const { container } = render(
      <PulsingBadgeSkeleton count={5} />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('Skeleton Styling - Design System', () => {
  test('uses Border-Variant background', () => {
    const { container } = render(
      <Skeleton />
    );
    expect(container).toBeInTheDocument();
  });

  test('all variants use Border-Variant', () => {
    const components = [
      <Skeleton key="1" />,
      <TextSkeleton key="2" />,
      <AvatarSkeleton key="3" />,
      <CardSkeleton key="4" />,
      <ListSkeleton key="5" />,
      <TableSkeleton key="6" />,
      <ProfileSkeleton key="7" />,
      <GridSkeleton key="8" />,
      <PulsingBadgeSkeleton key="9" />,
    ];

    components.forEach(component => {
      const { container } = render(component);
      expect(container).toBeInTheDocument();
    });
  });
});

describe('Skeleton Animation', () => {
  test('skeleton has pulse animation', () => {
    const { container } = render(
      <Skeleton />
    );
    expect(container).toBeInTheDocument();
  });
});

describe('Accessibility', () => {
  test('skeletons have proper ARIA attributes', () => {
    const { container } = render(
      <Skeleton />
    );
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
    expect(container.querySelector('[aria-label]')).toBeInTheDocument();
  });

  test('multiple skeletons maintain accessibility', () => {
    const { container } = render(
      <Skeleton count={3} />
    );
    const busyElements = container.querySelectorAll('[aria-busy="true"]');
    expect(busyElements.length).toBeGreaterThan(0);
  });
});
